import { useRef, useState } from "react";
import Menu from "../ui/Menu";
import { importDocument } from "../../util/documentIO";
import { useToast } from "../ui/ToastProvider";

/**
 * Toolbar control that imports a .docx or .pdf file and inserts its content
 * into the editor at the current cursor position (non-destructive).
 */
export default function EditorImport({ editor }) {

    const inputRef = useRef(null);
    const acceptRef = useRef("");
    const toast = useToast();
    const [importing, setImporting] = useState(false);

    const pickFile = (accept) => {
        acceptRef.current = accept;
        if (inputRef.current) {
            inputRef.current.accept = accept;
            inputRef.current.click();
        }
    };

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file || !editor) {
            return;
        }

        setImporting(true);
        try {
            const html = await importDocument(file);

            if (!html || !html.trim()) {
                toast.info("No readable content found in that file.");
                return;
            }

            editor.chain().focus().insertContent(html).run();
            toast.success(`Imported "${file.name}".`);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to import document.");
        } finally {
            setImporting(false);
        }
    };

    return (
        <>
            <Menu
                className="nc-tool"
                trigger={
                    importing
                        ? <span className="nc-spinner nc-spinner--sm" />
                        : <i className="bi bi-upload" title="Import document" />
                }
                items={[
                    {
                        icon: "bi-filetype-docx",
                        label: "Import Word (.docx)",
                        disabled: importing,
                        onClick: () =>
                            pickFile(".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                    },
                    {
                        icon: "bi-filetype-pdf",
                        label: "Import PDF",
                        disabled: importing,
                        onClick: () => pickFile(".pdf,application/pdf")
                    }
                ]}
            />
            <input
                ref={inputRef}
                type="file"
                style={{ display: "none" }}
                onChange={handleFile}
            />
        </>
    );
}
