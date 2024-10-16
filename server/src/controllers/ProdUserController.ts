import { NextFunction, Request, Response } from "express";
import {
    ProdUser
} from "../models/ProdUser";
import { convertJsonToExcel } from "../services/convertJsonToExcel";
import { convertExcelToJsonWithoutAlterLine } from "../services/convertExcelToJson";
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { PDFDocument } from "pdf-lib";
import { generateCover } from "@src/views/generateCover";
import { generateObs } from "@src/views/generateObs";
import { getPage } from "@src/views/getPage";

export class ProdUserController {
    // para pegar as opções de modelo, produto e linha
    static getModelProductOptionsAndLine = async (req: Request, res: Response) => {
        try {
            const options = await ProdUser.searchByModelAndProductOptionsAndLine()
            res.status(200).json(options)

        } catch (error) {
            res.status(500).json(error)
        }
    }
    // para pegas as opções de modelo e produto
    static getModelAndProductOptions = async (req: Request, res: Response) => {
        try {
            const options = await ProdUser.searchByModelAndProductOptionsAndLine()
            res.status(200).json(options)
        } catch (error) {
            res.status(500).json(error)
        }
    }
    // para fazer download de IT de produção
    static downloadList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { model, product, line } = req.query
            const productionList = await ProdUser.getContentFromProductionList(model as string, product as string, line as string) as { status: boolean, content: [], name: string }
            if (productionList.status) {
                const content = productionList.content
                const workbook = await convertJsonToExcel(content)
                const data = await workbook.xlsx.writeBuffer()
                res.setHeader('Content-Type', `${productionList.name}`);
                res.send(data)
                next()
            } else {
                res.status(400).json('Não existe lista com esse modelo e produto!')
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }

    // para carregar a IT
    static loadProductionIT = async (model: string, product: string, line: string) => {
        const content = await ProdUser.exsitsThisListInProductionListsByModelLineAndProduct(
            model, product, line
        ) as { status: boolean, content: string, name: string }

        if (content.status) {
            const jsonData = JSON.parse(content.content);
            const postsContent: { [key: string]: { it: string, page: number, operations: string, sequence: number }[] } = {};
            const postsUseds: string[] = [];
            console.log(jsonData)
            jsonData.forEach((element: { post: string, it: string, page: number, operations: string, sequence: number }, i: number) => {
                if (i > 0) {
                    if (postsContent[element.post]) {
                        postsContent[element.post].push({ it: element.it, page: element.page, operations: element.operations ?? '', sequence: element.sequence});
                    } else {
                        postsContent[element.post] = [{ it: element.it, page: element.page, operations: element.operations ?? '', sequence: element.sequence }];
                        postsUseds.push(String(element.post));
                    }
                }
            });

            const newPdfDoc = await PDFDocument.create();

            for (const post of postsUseds) {
                console.log('Iniciando obtenção dos dados posto ', post)
                // Gera os bytes da capa do PDF em paralelo
                const coverPromise = generateCover(post).then(async (pdfBytes) => {
                    const existingPdfDoc = await PDFDocument.load(pdfBytes);
                    return await newPdfDoc.copyPages(existingPdfDoc, [0]);
                });

                Object.keys(postsContent).forEach(key => {
                    postsContent[key].sort((a, b) => Number(a.sequence) - Number(b.sequence));
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

            console.log(pdf)

            fs.writeFileSync(path.resolve(__dirname, `../files/production_its/${content.name}.pdf`), pdf)

            return true
        }
    }

    // para fazer upload da IT
    static uploadProductionLists = async (req: Request, res: Response) => {

        let name: string | undefined;

        try {

            // 1. criando expressões regulares para deixar apenas o nome do arquivo
            // 1. sem (1) quando estiver em cópia ou extensão como: .dos, xlsx, xls

            // primeira expressão para quando for cópia e tiver (1).extensão
            const regexCopyTest = /\([0-9]?\).[a-z]+/
            // segunda expressão 
            const regexTest = /\.[a-z]+/
            //pegando o nome do arquivo
            const filename = req.file?.filename

            // fazendo a verificação se é cópia
            const tranformName = (originalName: string): { name: string } => {
                let name: string = ''
                if (filename?.match(regexCopyTest)) {
                    // se for remove o parenteses e a extensão 
                    name = filename.replace(regexCopyTest, '')
                } else if (filename?.match(regexTest)) {
                    // remove a extensão
                    name = filename?.replace(regexTest, '')
                } else {
                    name = originalName
                }
                return { name }
            }

            // Obtendo o nome sem extensão
            const result = tranformName(filename as string);
            name = result.name;

            // 2. pegando o caminho do arquivo 
            const filePath: string = path.resolve(__dirname, `../files/production_its/${req.file?.originalname}`)

            // 3. convertendo o conteúdo do arquivo em json
            const jsonData = convertExcelToJsonWithoutAlterLine(filePath)
            // pegando o modelo desse conteúdo
            const model: string = jsonData?.model as string
            // pegando o produto desse conteúdo
            const product: string = jsonData?.product as string
            // pegando a linha
            const line: string = jsonData?.line as string
            // pegando o conteúdo de instruções
            const content: string = jsonData?.content as string

            const latestUpdatedDate = new Date().toLocaleDateString('pt-BR')
            console.log(latestUpdatedDate)

            // agora pesquisa se dentro dessas tem uma com a linha especifica.
            const existThisListProd = await ProdUser.exsitsThisListInProductionListsByName(name) as { status: boolean }
            if (existThisListProd.status) {
                console.log('Já exite lista com esse modelo e produto e linha')
                await ProdUser.updateListInProductionLists(name, model, product, line, content)
            } else {
                console.log('Ainda não existe lista com esse modelo produto e linha')
                await ProdUser.saveNewListInProductionLists(name, model, product, line, content, latestUpdatedDate)
            }
            // apagando o arquivo do disco local.
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log('Erro ao excluir o arquivo!')
                }
                console.log('Arquivo excluído com sucesso!')
            })
            await ProdUser.updateLatestUpdatedDate(name, 'loading')
            await ProdUserController.loadProductionIT(model, product, line)
            await ProdUser.updateLatestUpdatedDate(name, latestUpdatedDate)
            // enviando uma resposta de confirmação de que todos os processos foram concluidos
            res.status(200).json('Operação concluída com sucesso!')
        } catch (error) {
            if (name) {
                await ProdUser.updateLatestUpdatedDate(name, 'error')
            }
            res.status(500).json(error)
            console.log(error)
        }
    }
}