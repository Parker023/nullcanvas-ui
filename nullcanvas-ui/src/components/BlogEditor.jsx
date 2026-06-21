import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { uploadImage, initializeBlog } from "../api/blogApi";
import { useEffect, useRef } from "react";


export default function BlogEditor({ blogPublicId, content, onChange }) {
    //  console.log("BlogEditor blogPublicId", blogPublicId);

    const imageInputRef = useRef(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Placeholder.configure({
                placeholder:
                    "Start writing your story..."
            })
        ],
        content: {
            type: "doc",
            content: []
        },
        editorProps: {
            handlePaste(view, event) {
                console.log("PASTE DETECTED");
              
                console.log(event);
                console.log(event.clipboardData);
                console.log(event.clipboardData?.getData("text/html"));
                console.log(event.clipboardData?.getData("text/plain"));

                const items =
                    event.clipboardData?.items;

                if (!items) {
                    return false;
                }

                for (const item of items) {

                    if (
                        item.type.startsWith(
                            "image/"
                        )
                    ) {

                        const file =
                            item.getAsFile();

                        handleImagePaste(
                            file
                        );

                        return true;
                    }
                }

                return false;
            }
        }
    });

    useEffect(() => {


        if (!editor) {
            return;
        }

        const updateHandler = () => {
            onChange(
                editor.getJSON()
            );
        };

        editor.on(
            "update",
            updateHandler
        );

        return () => {
            editor.off(
                "update",
                updateHandler
            );
        };

    }, [editor, onChange]);

    useEffect(() => {

        if (!editor || !content) {
            return;
        }

        editor.commands.setContent(
            content,
            false
        );

    }, [editor, content]);


    const handleImagePaste =
        async (file) => {

            if (!file) {
                return;
            }

            try {

                const response =
                    await uploadImage(
                        file,
                        blogPublicId,
                        "BLOG_CONTENT_IMAGE"
                    );

                editor
                    .chain()
                    .focus()
                    .setImage({
                        src: response.url
                    })
                    .run();

            } catch (error) {

                console.error(error);

                alert(
                    "Failed to upload image"
                );
            }
        };

    const handleImageUpload = async (event) => {


        const file = event.target.files?.[0];

        if (!file) {
            return;
        }


        try {

            const response = await uploadImage(
                file,
                blogPublicId,
                "BLOG_CONTENT_IMAGE"
            );

            editor
                .chain()
                .focus()
                .setImage({
                    src: response.url
                })
                .run();

        } catch (error) {

            console.error(error);

            alert("Failed to upload image");
        }
    };


    if (!editor) {
        return null;
    }

    return (
        <div className="border rounded">

            <div className="p-2 border-bottom">

                <button
                    type="button"
                    className={
                        editor.isActive("bold")
                            ? "btn btn-sm btn-primary me-2"
                            : "btn btn-sm btn-outline-secondary me-2"
                    }
                    onClick={() =>
                        editor.chain().focus().toggleBold().run()
                    }
                >
                    B
                </button>

                <button
                    type="button"
                    className={
                        editor.isActive("italic")
                            ? "btn btn-sm btn-primary me-2"
                            : "btn btn-sm btn-outline-secondary me-2"
                    }
                    onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                    }
                >
                    I
                </button>

                <button
                    type="button"
                    className={
                        editor.isActive("heading", { level: 1 })
                            ? "btn btn-sm btn-primary me-2"
                            : "btn btn-sm btn-outline-secondary me-2"
                    }
                    onClick={() =>
                        editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 1 })
                            .run()
                    }
                >
                    H1
                </button>

                <button
                    type="button"
                    className={
                        editor.isActive("heading", { level: 2 })
                            ? "btn btn-sm btn-primary me-2"
                            : "btn btn-sm btn-outline-secondary me-2"
                    }
                    onClick={() =>
                        editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 2 })
                            .run()
                    }
                >
                    H2
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary me-2"
                    onClick={() => imageInputRef.current?.click()}
                >
                    Insert Image
                </button>
                <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                />
                <button
                    type="button"
                    className={
                        editor.isActive("bulletList")
                            ? "btn btn-sm btn-primary me-2"
                            : "btn btn-sm btn-outline-secondary me-2"
                    }
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                >
                    • List
                </button>

                <button
                    type="button"
                    className={
                        editor.isActive("orderedList")
                            ? "btn btn-sm btn-primary me-2"
                            : "btn btn-sm btn-outline-secondary me-2"
                    }
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                >
                    1. List
                </button>

            </div>

            <EditorContent
                editor={editor}
                className="p-3"
            />

        </div>
    );
}