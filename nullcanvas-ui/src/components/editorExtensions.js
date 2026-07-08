import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

// Shared Tiptap schema used by both the editor and the read-only viewer, so
// content (including inline images and links) serializes and renders identically.
export const editorExtensions = [
    StarterKit.configure({
        link: {
            openOnClick: false,
            autolink: true,
            HTMLAttributes: {
                rel: "noopener noreferrer nofollow",
                target: "_blank"
            }
        }
    }),
    Image.configure({
        inline: true,
        allowBase64: false
    })
];
