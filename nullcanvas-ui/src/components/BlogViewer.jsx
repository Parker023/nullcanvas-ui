import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function BlogViewer({ content }) {

    const editor = useEditor({
        editable: false,
        extensions: [StarterKit],
        content
    });

    if (!editor) {
        return null;
    }

    return (
        <EditorContent editor={editor} />
    );
}

export default BlogViewer;