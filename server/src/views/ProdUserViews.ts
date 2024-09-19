import { ProdUser } from "@src/models/ProdUser";
import { PDFDocument } from "pdf-lib";
import { Request, Response } from "express";
import { exsitsThisListInProductionListsByModelLineAndProduct } from "../models/ProdUser";
import { generateCover } from "./generateCover";
import { getPage } from "./getPage";
import { generateObs } from "./generateObs";

export class ProdUserViews {

    static getModelOptions = async (req: Request, res: Response) => {
        try {
            const models = await ProdUser.findModelsOptions()
            if (models) {
                res.status(200).json(models)
            } else {
                res.status(400).json({message: 'Error to find models options'})
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }

    static getProductOptionsByModel = async (req: Request, res: Response) => {
        try {
            const {model} = req.query

            const models = await ProdUser.findProductsOptionsByModel(model as string)

            if (models) {
                res.status(200).json(models)
            } else {
                res.status(400).json({message: 'Error to find product options'})
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }

    static getLinesOptionsByModelAndProduct = async (req: Request, res: Response) => {
        try {
            const {model, product} = req.query

            const lines = await ProdUser.findLinesOptionsByModelAndProduct(model as string, product as string)
            if (lines) {
                res.status(200).json(lines)
            } else {
                res.status(400).json({message: 'Error to find line options'})
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }

    static sendProductionIT = async (req: Request, res: Response) => {
        try {
            const { model, product, line } = req.query;
    
            const content = await exsitsThisListInProductionListsByModelLineAndProduct(
                model as string, product as string, line as string
            ) as { status: boolean, content: string };
    
            if (content.status) {
                const jsonData = JSON.parse(content.content);
                const postsContent: { [key: string]: { it: string, page: number, operations: string }[] } = {};
                const postsUseds: string[] = [];
    
                jsonData.forEach((element: { post: string, it: string, page: number, operations: string }, i: number) => {
                    if (i > 0) {
                        if (postsContent[element.post]) {
                            postsContent[element.post].push({ it: element.it, page: element.page, operations: element.operations ?? '' });
                        } else {
                            postsContent[element.post] = [{ it: element.it, page: element.page, operations: element.operations ?? '' }];
                            postsUseds.push(String(element.post));
                        }
                    }
                });
    
                const newPdfDoc = await PDFDocument.create();
    
                for (const post of postsUseds) {
                    console.log('Iniciando obtenção dos dados posto ',  post)
                    // Gera os bytes da capa do PDF em paralelo
                    const coverPromise = generateCover(post).then(async (pdfBytes) => {
                        const existingPdfDoc = await PDFDocument.load(pdfBytes);
                        return await newPdfDoc.copyPages(existingPdfDoc, [0]);
                    });
    
                    const pdf = postsContent[post];
    
                    // Processa as páginas e operações em paralelo, mas mantendo o resultado na ordem correta
                    const pagePromises = pdf.map(async (el) => {
                        let pages: any[] = [];
    
                        if (el.operations !== '') {
                            const pdfBytesCover = await generateObs(el.operations);
                            const existingPdfDoc = await PDFDocument.load(pdfBytesCover);
                            const [obsPage] = await newPdfDoc.copyPages(existingPdfDoc, [0]);
                            pages.push(obsPage);
                        }
                        
                        const pdfBytes = await getPage(el.it, el.page);
                        const existingPdfDoc = await PDFDocument.load(pdfBytes);
                        const [page] = await newPdfDoc.copyPages(existingPdfDoc, [0]);
                        console.log(`Gerou a página ${el.page} da it: ${el.it}`)
                        pages.push(page);
    
                        return pages;
                    });
    
                    // Espera todas as promessas de geração de páginas serem resolvidas
                    const pagesArray = await Promise.all(pagePromises);
    
                    // Adiciona as páginas na ordem correta
                    const [coverPage] = await coverPromise;
                    newPdfDoc.addPage(coverPage);
    
                    pagesArray.forEach((pages) => {
                        pages.forEach((page) => {
                            newPdfDoc.addPage(page);
                        });
                    });
    
                    console.log('Gerou posto', post);
                }
    
                const pdf = await newPdfDoc.save();
                console.log('finalizou');
    
                // Envia o novo documento PDF como resposta
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'inline; filename=trdtrcece.pdf');
                res.send(Buffer.from(pdf));
            } else {
                res.status(404).send('Conteúdo não encontrado.');
            }
        } catch (error) {
            console.error('Erro ao processar o PDF:', error);
            res.status(500).send('Erro ao processar o PDF.');
        }
    };
    
}