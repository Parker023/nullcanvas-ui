import Menu from "../ui/Menu";
import { exportToPdf, exportToWord } from "../../util/documentIO";
import { useToast } from "../ui/ToastProvider";

/**
 * Export the given blog (title + Tiptap content) to PDF or Word.
 */
export default function ExportMenu({ title, content, className = "nc-btn nc-btn--ghost nc-btn--sm", align = "end" }) {

    const toast = useToast();

    const handlePdf = () => {
        try {
            exportToPdf(title, content);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to export PDF.");
        }
    };

    const handleWord = () => {
        try {
            exportToWord(title, content);
            toast.success("Word document downloaded.");
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to export Word document.");
        }
    };

    return (
        <Menu
            className={className}
            align={align}
            trigger={<><i className="bi bi-download" /> Export <i className="bi bi-chevron-down" style={{ fontSize: "0.7rem" }} /></>}
            items={[
                { icon: "bi-filetype-pdf", label: "Export as PDF", onClick: handlePdf },
                { icon: "bi-filetype-docx", label: "Export as Word", onClick: handleWord }
            ]}
        />
    );
}
