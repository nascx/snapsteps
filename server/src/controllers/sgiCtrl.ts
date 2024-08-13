import { Request, Response } from "express";
import path from 'node:path'
import { existsThisIT, existsThisQAFile, insertIT, insertQAFile } from "../models/sgi";
import fs from 'node:fs'

//importação da biblioteca para converter pdf para excel
const pdf2excel = require('pdf-to-excel')

//importação da biblioteca para converter excel em json
const excel2json = require('convert-excel-to-json')

function removeFileExtension(filename: string) {
    return filename.replace(/\.[^/.]+$/, "");
}

export const handleUploadIT = async (req: Request, res: Response) => {
    try {
        //pegando o caminho da IT
        const name = removeFileExtension(req?.file?.filename as string)
        const filePath: string = path.join(__dirname, `../_its/${req.file?.originalname}`)
        //pesquisando se já existe esse arquivo salvo na base de dados
        const it = await existsThisIT(filePath) as { status: boolean }
        // se não exsitir deve inserir
        if (!it.status) {
            await insertIT(filePath, name)
        } else {
            console.log('Arquivo já está salvo na base de dados!')
        }
        res.status(200).json('Dados salvos!')
    } catch (error) {
        res.status(500).json(error)
    }
}

const getInfosFromQAFile = async (filePath: string, excelPath: string) => {
    try {

        //criando o arquivo excel
        await pdf2excel.genXlsx(filePath, excelPath)

        //convertendo o excel em json
        const json = await excel2json({ sourceFile: excelPath, header: { rows: 1 } })

        //obtendo as informções do json
        const jsonInfos: { A: string }[] = json.Sheet1

        // pegando o objeto aonde estão as informações de título
        const titleJson: { [key: string]: string } = jsonInfos[1]

        // criando a variável para armazenar a string que contem o conteúdo do título
        let title = ''

        // criando um contador para obter aumentar ao percorrer o objeto e encontrar o indice certo
        let count = 0

        // percorrendo o objeto até pegar o conteúdo do titulo
        for (let key in titleJson) {
            if (count > 2) {
                title += titleJson[key];
            }
            count++
        }

        // pegando o objeto aonde está as informações do código
        const codeJson: { [key: string]: string } = jsonInfos[5]

        // criando variável para armazenar o valor do código
        let code = ''

        // criando um contador para achar o indice certo
        let i = 0

        // percorrendo o objeto até achar o valor correto
        for (let key in codeJson) {
            if (codeJson[key] === 'CÓDIGO:') {
                let index = 0
                for (let key in codeJson) {
                    if (index === i + 2) {
                        code = codeJson[key]
                    }
                    index++
                }
            }
            i++
        }

        return { code, title }

    } catch (error) {
        console.log(error)
    }
}

export const handleUploadQualityFile = async (req: Request, res: Response) => {
    try {

        const orginalPath: string = path.join(__dirname, `../../_quality/${req.file?.originalname}`)

        const excelPath: string = path.join(__dirname, `../../_excels/${'at.xlsx'}`)

        const { code, title } = await getInfosFromQAFile(orginalPath, excelPath) as { code: string, title: string }

        console.log('------------------')
        console.log('code: ', code)
        console.log('------------------')
        console.log('title: ', title, code)

        /* const qaFile = await existsThisQAFile(code) as {status: boolean} */

        /* const filePath: string = path.join(__dirname, `../../_quality/${code}.pdf`) */

        /* fs.renameSync(orginalPath, filePath) */

        /* if (qaFile.status) {
            console.log('Já existe IT do QA com esse código')
        } else {
           
        } */

        /* await insertQAFile(code, title, filePath) */


        /* fs.unlinkSync(excelPath) */

        res.status(200).json({ code, title })
    } catch (error) {
        res.status(500).json(error)
    }
}