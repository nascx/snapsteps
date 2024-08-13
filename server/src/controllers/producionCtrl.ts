import { Request, Response } from "express";
import {
    exsitsThisListInProductionLists,
    getContentFromEngineeringList,
    getContentFromProductionList,
    saveNewListInProductionLists,
    searchByModelAndProductOptions,
    searchByModelAndProductOptionsAndLine,
    updateListInProductionLists
} from "../models/production";
import { exsitsListsWithThisModelAndProductInProductionLists, updateContentInProductionLists } from "../models/engineer";
import { convertJsonToExcel } from "../commonFunctions/convertJsonToExcel";
import { convertExcelToJsonWithoutAlterLine, convertExcelToJson } from "../commonFunctions/convertExcelToJson";
import path from 'node:path'
import fs from 'node:fs'

export const downloadList = async (req: Request, res: Response) => {
    try {
        const { model, product, line } = req.query
        const productionList = await getContentFromProductionList(model as string, product as string, line as string) as { status: boolean, content: [] }
        if (productionList.status) {
            const content = productionList.content
            const workbook = await convertJsonToExcel(content)
            workbook.xlsx.writeBuffer().then((data: any) => {
                res.setHeader('Content-Disposition', `attachment; filename="1.xlsx"`);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.send(data)
            })
        } else {
            const engineeringList = await getContentFromEngineeringList(model as string, product as string) as { status: boolean, content: [] }
            if (engineeringList.status) {
                const content = engineeringList.content
                const workbook = await convertJsonToExcel(content)
                workbook.xlsx.writeBuffer().then((data: any) => {
                    res.setHeader('Content-Disposition', `attachment; filename="1.xlsx"`);
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    res.send(data)
                })
            } else {
                res.status(400).json('Não existe lista com esse modelo e produto!')
            }
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getModelAndProductOptions = async (req: Request, res: Response) => {
    try {
        const options = await searchByModelAndProductOptionsAndLine()
        res.status(200).json(options)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getModelProductOptionsAndLine = async (req: Request, res: Response) => {
    try {
        const options = await searchByModelAndProductOptionsAndLine()
        res.status(200).json(options)

    } catch (error) {
        res.status(500).json(error)
    }
}

// para upload de lista de produção
export const uploadProductionLists = async (req: Request, res: Response) => {
    try {
        // pegando o caminho do arquivo 
        const filePath: string = path.resolve(__dirname, `../00_production_lists/${req.file?.originalname}`)
        // convertendo o conteúdo do arquivo em json
        const jsonData = convertExcelToJsonWithoutAlterLine(filePath)
        // pegando o modelo desse conteúdo
        const model: string = jsonData?.model as string
        // pegando o produto desse conteúdo
        const product: string = jsonData?.product as string
        // pegando a linha
        const line: string = jsonData?.line as string
        // pegando o conteúdo de instruções
        const content: string = jsonData?.content as string
        // agora pesquisa se dentro dessas tem uma com a linha especifica.
        const existThisListProd = await exsitsThisListInProductionLists(model, product, line) as { status: boolean }
        if (existThisListProd.status) {
            console.log('Já exite lista com esse modelo e produto e linha')
            await updateListInProductionLists(model, product, line, content)
        } else {
            console.log('Ainda não existe lista com esse modelo produto e linha')
            await saveNewListInProductionLists(model, product, line, content)
        }
        // apagando o arquivo do disco local.
        fs.unlink(filePath, (err) => {
            if (err) {
                console.log('Erro ao excluir o arquivo!')
            }
            console.log('Arquivo excluído com sucesso!')
        })
        // enviando uma resposta de confirmação de que todos os processos foram concluidos
        res.status(200).json('Operação concluída com sucesso!')
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
}

interface HashStore {
    [key: string]: {it: string, page: number}[];
}

// para devolver a IT com base na lista
export const sendIT = async (req: Request, res: Response) => {
    try {
        // obtendo as informações da requisição
        const { model, product, line } = req.query
        // verificando se essa combinação de informações existe
        const prodList = await exsitsThisListInProductionLists(model as string, product as string, line as string) as { status: boolean, content: string }
        // se existir deve pegar o conteúdo
        if (prodList.status) {
            // transformando em json
            const jsonData = JSON.parse(prodList.content)
            // criando um objeto para salvar as informações de cada it
            const postInfos: HashStore = {}
            const posts: string[] = []
            jsonData.map((row: { it: string, page: string, post: string }, i: number) => {
                if (i > 0) {
                    if (!postInfos[row.post]) {
                        postInfos[row.post] = []
                        postInfos[row.post].push({it: row.it, page: Number(row.page)})
                        posts.push(String(row.post))
                    } else {
                        postInfos[row.post].push({it: row.it, page: Number(row.page)})
                    }
                }
            })
            res.status(200).json({ postInfos, posts })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}