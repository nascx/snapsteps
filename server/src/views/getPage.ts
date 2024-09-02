import { PDFDocument } from "pdf-lib";
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// para pegar a página especifica da it
export const getPage = async (it: string, pageNumber: number): Promise<Uint8Array> => {
    try {
        const ITpath = path.resolve(__dirname, `../_its/${it}.pdf`)
        const pdfBuffer = fs.readFileSync(ITpath);
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const newPdfDoc = await PDFDocument.create();
        const [page] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]); // Copia a primeira página
        await newPdfDoc.addPage(page);
        const pdfBytes = await newPdfDoc.save();
        return pdfBytes;
    } catch (error) {
        throw error;
    }
};