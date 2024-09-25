import { ProdUser } from "@src/models/ProdUser";
import { Request, Response } from "express";
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'url';
import { PDFButton } from "pdf-lib";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ProdUserViews {

    static getModelOptions = async (req: Request, res: Response) => {
        try {
            const models = await ProdUser.findModelsOptions()
            if (models) {
                res.status(200).json(models)
            } else {
                res.status(400).json({ message: 'Error to find models options' })
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }

    static getProductOptionsByModel = async (req: Request, res: Response) => {
        try {
            const { model } = req.query

            const models = await ProdUser.findProductsOptionsByModel(model as string)

            if (models) {
                res.status(200).json(models)
            } else {
                res.status(400).json({ message: 'Error to find product options' })
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }

    static getLinesOptionsByModelAndProduct = async (req: Request, res: Response) => {
        try {
            const { model, product } = req.query

            const lines = await ProdUser.findLinesOptionsByModelAndProduct(model as string, product as string)
            if (lines) {
                res.status(200).json(lines)
            } else {
                res.status(400).json({ message: 'Error to find line options' })
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }

    static getProductionITUploaded = async (model: string, product: string, line: string) => {
        try {
            const content = await ProdUser.exsitsThisListInProductionListsByModelLineAndProduct(
                model as string, product as string, line as string
            ) as { status: boolean, content: string, name: string, latestUpdated: string };

            if (content.latestUpdated === 'error') {
                return false
            }

            if (content.latestUpdated !== 'loading') {
                const pdfBuffer = fs.readFileSync(path.resolve(__dirname, `../files/production_its/${content.name}.pdf`))
                return pdfBuffer
            } else {
                return new Promise((resolve) => {
                    setTimeout(async () => {
                        const result = await this.getProductionITUploaded(model, product, line);
                        resolve(result);
                    }, 5000);
                });
            }
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static sendProductionIT = async (req: Request, res: Response) => {
        try {
            const { model, product, line } = req.query;

            const pdfBuffer = await this.getProductionITUploaded(model as string, product as string, line as string) as Buffer
            
            if (!pdfBuffer) {
                return res.status(400).json({message: 'Erro ao processar o arquivo, por favor verifique se a lista está correta!'})
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename=trdtrcece.pdf');
            res.send(Buffer.from(pdfBuffer));
        } catch (error) {
            console.error('Erro ao processar o PDF:', error);
            res.status(500).send('Erro ao processar o PDF.');
        }
    };

}