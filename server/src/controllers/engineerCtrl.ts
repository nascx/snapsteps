import { Request, Response } from "express";

import { convertExcelToJson, convertExcelToJsonWithoutAlterLine } from '../services/convertExcelToJson'

import path from 'node:path'

import fs from 'node:fs'

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
    exsitsThisListIEngineeringLists,
    exsitsListsWithThisModelAndProductInProductionLists,
    insertListInEngineeringLists,
    updateContentInProductionLists,
    updateListInEngineeringLists
} from "../models/engineer";

// para engenharia criar a listas
export const createList = async (req: Request, res: Response) => {
    try {
        // prgando o caminho do arquivo que foi enviado
        const filePath: string = path.resolve(__dirname, `../files/production_its/${req.file?.originalname}`)
        // convertendo o conteúdo do arquivo em json
        const jsonData = convertExcelToJsonWithoutAlterLine(filePath)
        // pegando o modelo desse conteúdo
        const model: string = jsonData?.model ?? ''
        // pegando o produto desse conteúdo
        const product: string = jsonData?.product ?? ''
        // pegando o conteúdo de instruções
        const content: string = jsonData?.content ?? ''
        //pegando o conteúdo da linha
        const line: string = jsonData?.line ?? ''
        // procurando se existe uma lista na tabela de listas de engenharia com esse modelo e produto
        const existListEng = await exsitsThisListIEngineeringLists(model as string, product as string)
        if (existListEng) {
            // se já existir deve ser atualizada
            await updateListInEngineeringLists( model, product, content, line)
        } else {
            // se não deve ser inserida
            await insertListInEngineeringLists( model, product, content, line)
        }
        // procurando se existe já existe uma lista na tabela de lista de produção com modelo e produto
        const existListProd = await exsitsListsWithThisModelAndProductInProductionLists(model, product) as { status: boolean, content: { line: string }[] }
        // se exitir atualiza cada um dessas listas
        if (existListProd.status) {
            existListProd.content.forEach((list: { line: string }) => {
                const json = convertExcelToJson(filePath, list.line)
                updateContentInProductionLists(json?.content as string, model, product, list.line)
            })
        } else {
            console.log(existListProd)
        }
        fs.unlink(filePath, (err) => {
            if (err) {
                console.log('Erro ao excluir o arquivo!')
            }
            console.log('Arquivo excluído com sucesso!')
        })
        res.status(200).json('Operação concluída com sucesso!')
    } catch (error) {
        res.status(500).json(error)
    }
}
