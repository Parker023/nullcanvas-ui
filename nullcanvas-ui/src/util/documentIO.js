import { generateHTML } from "@tiptap/core";
import { editorExtensions } from "../components/editorExtensions";

/* ==========================================================================
   Client-side document import / export.
   Heavy parsers (mammoth, pdfjs) are dynamically imported so they only load
   when the user actually imports a file.
   ========================================================================== */

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function slugify(title) {
    return (title || "blog")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60) || "blog";
}

// Tiptap JSON document -> HTML string, using the shared editor schema.
export function contentToHtml(content) {
    if (!content) {
        return "";
    }
    try {
        return generateHTML(content, editorExtensions);
    } catch (error) {
        console.error("Failed to render content to HTML", error);
        return "";
    }
}

function buildDocument(title, bodyHtml) {
    return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title || "Untitled")}</title>
<style>
  body { font-family: Calibri, Arial, sans-serif; font-size: 12pt; color: #1a1a1a; line-height: 1.6; max-width: 720px; margin: 40px auto; padding: 0 24px; }
  h1 { font-size: 24pt; margin: 0 0 4pt; }
  h2 { font-size: 18pt; margin: 18pt 0 6pt; }
  h3 { font-size: 14pt; margin: 14pt 0 6pt; }
  p { margin: 0 0 10pt; }
  img { max-width: 100%; height: auto; }
  blockquote { border-left: 3px solid #7c3aed; margin: 12pt 0; padding-left: 12pt; color: #555; }
  pre { background: #f4f3f7; padding: 10pt; border-radius: 6px; white-space: pre-wrap; }
  code { font-family: Consolas, monospace; }
  a { color: #7c3aed; }
  hr { border: none; border-top: 1px solid #ccc; margin: 16pt 0; }
</style>
</head>
<body>
<h1>${escapeHtml(title || "Untitled")}</h1>
${bodyHtml}
</body>
</html>`;
}

function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ---- Export: Word (.doc, opens in Microsoft Word / Google Docs) ---------- */
export function exportToWord(title, content) {
    const html = buildDocument(title, contentToHtml(content));
    const blob = new Blob(["﻿", html], {
        type: "application/msword"
    });
    triggerDownload(blob, `${slugify(title)}.doc`);
}

/* ---- Export: PDF (via the browser's native print -> Save as PDF) ---------- */
export function exportToPdf(title, content) {
    const html = buildDocument(title, contentToHtml(content));

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
        throw new Error("Popup blocked. Allow popups to export as PDF.");
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for images (and layout) before invoking the print dialog.
    const doPrint = () => {
        printWindow.focus();
        printWindow.print();
    };

    const images = Array.from(printWindow.document.images || []);
    if (images.length === 0) {
        setTimeout(doPrint, 250);
        return;
    }

    let remaining = images.length;
    const done = () => {
        remaining -= 1;
        if (remaining <= 0) {
            setTimeout(doPrint, 150);
        }
    };
    images.forEach((img) => {
        if (img.complete) {
            done();
        } else {
            img.addEventListener("load", done);
            img.addEventListener("error", done);
        }
    });
    // Safety net if some image never fires.
    setTimeout(doPrint, 3000);
}

/* ---- Import: Word (.docx) -> HTML ---------------------------------------- */
export async function importWord(file) {
    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return result.value || "";
}

/* ---- Import: PDF -> HTML (text extraction) ------------------------------- */
export async function importPdf(file) {
    const pdfjs = await import("pdfjs-dist");
    const workerSrc = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

    const pagesHtml = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Group text items into lines, then lines into paragraphs by y-gaps.
        const lines = [];
        let currentLine = { text: "", y: null };

        for (const item of textContent.items) {
            const str = item.str ?? "";
            const y = item.transform ? item.transform[5] : null;

            if (currentLine.y === null) {
                currentLine.y = y;
            }
            currentLine.text += str;

            if (item.hasEOL) {
                lines.push({ text: currentLine.text, y: currentLine.y });
                currentLine = { text: "", y: null };
            }
        }
        if (currentLine.text.trim()) {
            lines.push({ text: currentLine.text, y: currentLine.y });
        }

        // Merge lines into paragraphs (large vertical gap -> new paragraph).
        const gaps = [];
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].y != null && lines[i - 1].y != null) {
                gaps.push(Math.abs(lines[i - 1].y - lines[i].y));
            }
        }
        gaps.sort((a, b) => a - b);
        const medianGap = gaps.length ? gaps[Math.floor(gaps.length / 2)] : 0;
        const breakThreshold = medianGap * 1.6;

        const paragraphs = [];
        let buffer = "";

        for (let i = 0; i < lines.length; i++) {
            const text = lines[i].text.trim();
            if (!text) {
                continue;
            }

            if (buffer === "") {
                buffer = text;
            } else {
                const gap =
                    lines[i].y != null && lines[i - 1].y != null
                        ? Math.abs(lines[i - 1].y - lines[i].y)
                        : 0;

                if (breakThreshold && gap > breakThreshold) {
                    paragraphs.push(buffer);
                    buffer = text;
                } else {
                    buffer += " " + text;
                }
            }
        }
        if (buffer) {
            paragraphs.push(buffer);
        }

        const pageHtml = paragraphs
            .map((p) => `<p>${escapeHtml(p)}</p>`)
            .join("");

        pagesHtml.push(pageHtml);
    }

    // Separate pages with a divider.
    return pagesHtml.filter(Boolean).join("<hr>");
}

export async function importDocument(file) {
    const name = (file.name || "").toLowerCase();

    if (name.endsWith(".docx") || name.endsWith(".doc")) {
        return importWord(file);
    }
    if (name.endsWith(".pdf")) {
        return importPdf(file);
    }

    // Fall back on MIME type.
    if (file.type === "application/pdf") {
        return importPdf(file);
    }
    if (file.type.includes("word") || file.type.includes("officedocument")) {
        return importWord(file);
    }

    throw new Error("Unsupported file. Please choose a .docx or .pdf file.");
}
