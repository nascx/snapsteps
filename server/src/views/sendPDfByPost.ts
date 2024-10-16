import { PDFDocument } from "pdf-lib";
import { Request, Response } from "express";
import { ProdUser } from "../models/ProdUser";
import { generateCover } from "./generateCover";
import { getPage } from "./getPage";
import { generateObs } from "./generateObs";

export const sendPdfByPost = async (req: Request, res: Response) => {
    try {
        const { model, product, line, post } = req.query;

        const content = await ProdUser.exsitsThisListInProductionListsByModelLineAndProduct(model as string, product as string, line as string) as { status: boolean, content: string };

        if (content.status) {

            const jsonData = JSON.parse(content.content);
            const postsContent: { [key: string]: { it: string, page: number, operations: string }[] } = {};
            const postsUseds: string[] = [post as string];

            jsonData.forEach((element: { post: string, it: string, page: number, operations: string }, i: number) => {
                if (i > 0) {
                    if (postsContent[element.post]) {
                        postsContent[element.post].push({ it: element.it, page: element.page, operations: element.operations ?? '' });
                    } else {
                        postsContent[element.post] = [{ it: element.it, page: element.page, operations: element.operations ?? '' }];
                    }
                }
            });

            const newPdfDoc = await PDFDocument.create();

            for (const post of postsUseds) {

                // Gera os bytes do PDF
                const pdfBytes = await generateCover(post);

                // Carrega os bytes do PDF gerado
                const existingPdfDoc = await PDFDocument.load(pdfBytes);

                // Copia todas as páginas do PDF existente para o novo PDF
                const [existingPage] = await newPdfDoc.copyPages(existingPdfDoc, [0]);

                // Adiciona a página copiada ao novo PDF
                newPdfDoc.addPage(existingPage);

                Object.keys(postsContent).forEach(key => {
                    postsContent[key].sort((a, b) => a.operations.localeCompare(b.operations));
                });

                const pdf = postsContent[post];

                for (const el of pdf) {

                    if (el.operations !== '') {
                        const pdfBytesCover = await generateObs(el.operations)
                        // Carrega os bytes do PDF gerado
                        const existingPdfDoc = await PDFDocument.load(pdfBytesCover);
                        // Copia todas as páginas do PDF existente para o novo PDF
                        const [existingPage] = await newPdfDoc.copyPages(existingPdfDoc, [0]);
                        // Adiciona a página copiada ao novo PDF
                        newPdfDoc.addPage(existingPage);
                    }

                    const pdfBytes = await getPage(el.it, el.page);

                    // Carrega os bytes do PDF gerado
                    const existingPdfDoc = await PDFDocument.load(pdfBytes);

                    // Copia todas as páginas do PDF existente para o novo PDF
                    const [existingPage] = await newPdfDoc.copyPages(existingPdfDoc, [0]);

                    // Adiciona a página copiada ao novo PDF
                    newPdfDoc.addPage(existingPage);
                }
            }

            const pdf = await newPdfDoc.save();

            // Envia o novo documento PDF como resposta
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename=extracted_page.pdf');
            res.send(Buffer.from(pdf));
        } else {
            res.status(404).send('Conteúdo não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao processar o PDF:', error);
        res.status(500).send('Erro ao processar o PDF.');
    }
};