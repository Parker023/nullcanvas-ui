import { EditorContent, useEditor } from "@tiptap/react";
import "../styles/blog.css";
import { editorExtensions } from "./editorExtensions";

function BlogViewer({ content }) {

    const editor = useEditor({
        editable: false,
        extensions: editorExtensions,
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
