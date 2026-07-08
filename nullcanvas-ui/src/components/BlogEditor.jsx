import { EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import { uploadImage } from "../api/blogApi";
import { useEffect, useRef, useState } from "react";
import { useToast } from "./ui/ToastProvider";
import { editorExtensions } from "./editorExtensions";
import EditorImport from "./blog/EditorImport";

function ToolButton({ active, disabled, onClick, title, children }) {
    return (
        <button
            type="button"
            title={title}
            disabled={disabled}
            className={`nc-tool ${active ? "nc-tool--active" : ""}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default function BlogEditor({ blogPublicId, blogId, content, onChange }) {

    // Works in both create (blogPublicId) and edit (blogId) flows.
    const targetId = blogPublicId || blogId;

    const imageInputRef = useRef(null);
    const toast = useToast();

    const [uploading, setUploading] = useState(false);
    const [linkOpen, setLinkOpen] = useState(false);
    const [linkValue, setLinkValue] = useState("");

    // Keep the latest upload handler reachable from static editorProps callbacks.
    const uploadRef = useRef(null);

    const editor = useEditor({
        extensions: [
            ...editorExtensions,
            Placeholder.configure({
                placeholder: "Start writing your story... (paste or drop images anywhere)"
            })
        ],
        content: {
            type: "doc",
            content: []
        },
        editorProps: {
            handlePaste(view, event) {
                const items = event.clipboardData?.items;
                if (!items) {
                    return false;
                }
                for (const item of items) {
                    if (item.type.startsWith("image/")) {
                        event.preventDefault();
                        uploadRef.current?.(item.getAsFile());
                        return true;
                    }
                }
                return false;
            },
            handleDrop(view, event) {
                const files = event.dataTransfer?.files;
                if (!files || files.length === 0) {
                    return false;
                }
                const imageFile = Array.from(files).find(f =>
                    f.type.startsWith("image/")
                );
                if (!imageFile) {
                    return false;
                }
                event.preventDefault();
                const coords = view.posAtCoords({
                    left: event.clientX,
                    top: event.clientY
                });
                uploadRef.current?.(imageFile, coords?.pos);
                return true;
            }
        }
    });

    useEffect(() => {
        if (!editor) {
            return;
        }
        const updateHandler = () => onChange(editor.getJSON());
        editor.on("update", updateHandler);
        return () => editor.off("update", updateHandler);
    }, [editor, onChange]);

    useEffect(() => {
        if (!editor || !content) {
            return;
        }
        editor.commands.setContent(content, false);
    }, [editor, content]);

    const insertImage = (url, pos) => {
        let chain = editor.chain().focus();
        if (typeof pos === "number") {
            chain = chain.insertContentAt(pos, {
                type: "image",
                attrs: { src: url }
            });
        } else {
            chain = chain.setImage({ src: url });
        }
        chain.run();
    };

    const handleImageUpload = async (file, pos) => {
        if (!file) {
            return;
        }

        setUploading(true);
        try {
            const response = await uploadImage(
                file,
                targetId,
                "BLOG_CONTENT_IMAGE"
            );
            insertImage(response.url, pos);
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    // Expose the latest handler to the static editorProps (paste/drop) callbacks.
    useEffect(() => {
        uploadRef.current = handleImageUpload;
    });

    const handleFileInput = (event) => {
        handleImageUpload(event.target.files?.[0]);
        event.target.value = "";
    };

    const openLinkEditor = () => {
        if (!editor) {
            return;
        }
        setLinkValue(editor.getAttributes("link").href || "");
        setLinkOpen(true);
    };

    const applyLink = (e) => {
        e?.preventDefault();
        const url = linkValue.trim();
        if (!url) {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
        } else {
            const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
            editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href })
                .run();
        }
        setLinkOpen(false);
    };

    if (!editor) {
        return null;
    }

    return (
        <div className="nc-editor">

            <div className="nc-toolbar">

                <ToolButton
                    title="Bold"
                    active={editor.isActive("bold")}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <i className="bi bi-type-bold" />
                </ToolButton>

                <ToolButton
                    title="Italic"
                    active={editor.isActive("italic")}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <i className="bi bi-type-italic" />
                </ToolButton>

                <ToolButton
                    title="Underline"
                    active={editor.isActive("underline")}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                    <i className="bi bi-type-underline" />
                </ToolButton>

                <ToolButton
                    title="Strikethrough"
                    active={editor.isActive("strike")}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                    <i className="bi bi-type-strikethrough" />
                </ToolButton>

                <ToolButton
                    title="Inline code"
                    active={editor.isActive("code")}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                >
                    <i className="bi bi-code" />
                </ToolButton>

                <ToolButton
                    title="Link"
                    active={editor.isActive("link")}
                    onClick={openLinkEditor}
                >
                    <i className="bi bi-link-45deg" />
                </ToolButton>

                <span className="nc-tool__sep" />

                <ToolButton
                    title="Heading 1"
                    active={editor.isActive("heading", { level: 1 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    H1
                </ToolButton>

                <ToolButton
                    title="Heading 2"
                    active={editor.isActive("heading", { level: 2 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    H2
                </ToolButton>

                <ToolButton
                    title="Heading 3"
                    active={editor.isActive("heading", { level: 3 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    H3
                </ToolButton>

                <span className="nc-tool__sep" />

                <ToolButton
                    title="Bullet list"
                    active={editor.isActive("bulletList")}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <i className="bi bi-list-ul" />
                </ToolButton>

                <ToolButton
                    title="Numbered list"
                    active={editor.isActive("orderedList")}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <i className="bi bi-list-ol" />
                </ToolButton>

                <ToolButton
                    title="Quote"
                    active={editor.isActive("blockquote")}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <i className="bi bi-quote" />
                </ToolButton>

                <ToolButton
                    title="Code block"
                    active={editor.isActive("codeBlock")}
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                >
                    <i className="bi bi-code-square" />
                </ToolButton>

                <ToolButton
                    title="Divider"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                >
                    <i className="bi bi-dash-lg" />
                </ToolButton>

                <span className="nc-tool__sep" />

                <ToolButton
                    title="Insert image"
                    disabled={uploading}
                    onClick={() => imageInputRef.current?.click()}
                >
                    {uploading
                        ? <span className="nc-spinner nc-spinner--sm" />
                        : <i className="bi bi-image" />}
                </ToolButton>
                <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileInput}
                />

                <EditorImport editor={editor} />

                <div className="ms-auto d-flex gap-1">
                    <ToolButton
                        title="Undo"
                        onClick={() => editor.chain().focus().undo().run()}
                    >
                        <i className="bi bi-arrow-counterclockwise" />
                    </ToolButton>
                    <ToolButton
                        title="Redo"
                        onClick={() => editor.chain().focus().redo().run()}
                    >
                        <i className="bi bi-arrow-clockwise" />
                    </ToolButton>
                </div>

                {linkOpen && (
                    <form className="nc-link-popover" onSubmit={applyLink}>
                        <i className="bi bi-link-45deg nc-muted" />
                        <input
                            autoFocus
                            className="nc-link-popover__input"
                            placeholder="Paste a link and press Enter"
                            value={linkValue}
                            onChange={(e) => setLinkValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Escape" && setLinkOpen(false)}
                        />
                        <button type="submit" className="nc-btn nc-btn--soft nc-btn--sm">
                            Apply
                        </button>
                        <button
                            type="button"
                            className="nc-tool"
                            title="Remove link"
                            onClick={() => { setLinkValue(""); applyLink(); }}
                        >
                            <i className="bi bi-x-lg" />
                        </button>
                    </form>
                )}

            </div>

            {uploading && (
                <div className="nc-editor__uploading">
                    <span className="nc-spinner nc-spinner--sm" />
                    Uploading image...
                </div>
            )}

            <EditorContent editor={editor} />

        </div>
    );
}
