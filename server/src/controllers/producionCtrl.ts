import { Request, Response } from "express";
import {
    exsitsThisListInProductionListsByName,
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

// para fazer download da lista
export const downloadList = async (req: Request, res: Response) => {
    try {
        const { model, product, line } = req.query
        const productionList = await getContentFromProductionList(model as string, product as string, line as string) as { status: boolean, content: [], name: string }
        if (productionList.status) {
            const content = productionList.content
            const workbook = await convertJsonToExcel(content)
            const data = await workbook.xlsx.writeBuffer()
            res.setHeader('Content-Type', `${productionList.name}`);
            res.send(data)
        } else {
            res.status(400).json('Não existe lista com esse modelo e produto!')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// para pegas as opções de modelo e produto
export const getModelAndProductOptions = async (req: Request, res: Response) => {
    try {
        const options = await searchByModelAndProductOptionsAndLine()
        res.status(200).json(options)
    } catch (error) {
        res.status(500).json(error)
    }
}

// para pegar as opções de modelo, produto e linha
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
        const { name } = tranformName(filename as string)

        // 2. pegando o caminho do arquivo 
        const filePath: string = path.resolve(__dirname, `../../00_production_lists/${req.file?.originalname}`)

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

        // agora pesquisa se dentro dessas tem uma com a linha especifica.
        const existThisListProd = await exsitsThisListInProductionListsByName(name) as { status: boolean }
        if (existThisListProd.status) {
            console.log('Já exite lista com esse modelo e produto e linha')
            await updateListInProductionLists(name, model, product, line, content)
        } else {
            console.log('Ainda não existe lista com esse modelo produto e linha')
            await saveNewListInProductionLists(name, model, product, line, content)
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
    [key: string]: { it: string, page: number }[];
}

// para devolver a IT com base na lista
/* export const sendIT = async (req: Request, res: Response) => {
    try {
        // obtendo as informações da requisição
        const { model, product, line } = req.query
        // verificando se essa combinação de informações existe
        const prodList = await exsitsThisListInProductionLists(name as string, model as string, product as string, line as string) as { status: boolean, content: string }
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
                        postInfos[row.post].push({ it: row.it, page: Number(row.page) })
                        posts.push(String(row.post))
                    } else {
                        postInfos[row.post].push({ it: row.it, page: Number(row.page) })
                    }
                }
            })
            res.status(200).json({ postInfos, posts })
        }
    } catch (error) {
        res.status(500).json(error)
    }
} */