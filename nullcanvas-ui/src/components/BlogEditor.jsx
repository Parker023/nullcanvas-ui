import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

export default function BlogEditor({ content, onChange }) {


    useEffect(() => {

        if (
            editor &&
            content
        ) {
            editor.commands.setContent(
                content
            );
        }

    }, [editor, content]);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Start writing your story..."
            })
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON());
        }
    });
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