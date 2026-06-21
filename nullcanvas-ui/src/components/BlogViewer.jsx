import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "../styles/blog.css";
import Image from "@tiptap/extension-image";

function BlogViewer({ content }) {

   const editor = useEditor({
    editable: false,
    extensions: [
        StarterKit,
       Image
    ],
    content
});

    if (!editor) {
        return null;
    }

    return (
        <div className="blog-content">
            <EditorContent editor={editor} />
        </div>
    );
}

export default BlogViewer;