// importação das dependencias
import Tesseract from 'tesseract.js' // para pegar texto da imagem
import fs from "node:fs"; //manipular arquivos 
import { pdf } from "pdf-to-img"; //para transformar pdf em imagem
import { Request, Response } from "express"; // para obter os tipos de req e res do express
import { SGIUser } from '@src/models/SGIUser'; // classe que têm as interações com o banco de dados
import path from 'node:path' // para trabalhar com caminhos
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class SGIUserController {

    static removeExtensionFromFilename = (filename: string): string => {
        // expressão regular para identificar a extensão
        const containExtension = /.[a-z]/gm
        // removanedo a extensão do nome do arquivo
        const filenameWithoutExtension = filename.replace(containExtension, '')
        // retornando o nome do arquivo sem a extensão
        return filenameWithoutExtension
    }

    static convertPdf2Image = async (filePath: string, imageName: string) => {
        try {
            // transformando o pdf em imagem
            const document = await pdf(filePath, { scale: 4 });
            // pegando apenas a primeira página
            const page1buffer = await document.getPage(1)
            // definindo o caminho aonde a imagem será salva
            const imagePath: string = path.join(__dirname, `../_quality/${imageName}.png`)
            // salvando a imagem no disco rígido
            await fs.writeFileSync(imagePath, page1buffer);
            // retornando o caminho da imagem
            return imagePath
        } catch (error) {
            console.log(error)
        }
    }

    static getTitle = async (imagePath: string) => {
        // obtendo os dados da imagem
        const result = await Tesseract.recognize(imagePath, 'por', {
        })
        // separando o array por quebra de linha 
        const textFromImage = await result.data.text.split('\n')
        // achando o indice aonde vêm a palavra título: 
        // obs.: na sequência vem o título
        const titleIndex = await textFromImage.findIndex((text: string, i) => {
            const regex = /TÍTULO:|TITULO:/gmi
            if (text.match(regex)) {
                return i
            }
        })

        console.log(textFromImage)

        if (textFromImage[titleIndex + 1] === '') {
            return textFromImage[titleIndex + 2]
        }
        
        // retornando o título do arquivo
        return textFromImage[titleIndex + 1]
    }

    static saveFile = async (req: Request, res: Response) => {
        try {
            // pegando o nome do arquivo
            const filename = req.file?.originalname
            // pegando a informação do código que é como o arquivo é nomeado
            // para isso se remove apenas a extensão
            const code = this.removeExtensionFromFilename(filename as string)

            // transformar o pdf em imagem
            // definindo caminho do arquivo
            const filePath = path.resolve(__dirname, `../_quality/${filename}`)

            await this.convertPdf2Image(filePath, code)
            // obtendo o título do arquivo
            // definindo o caminho aonde a imagem será salva
            const imagePath = path.resolve(__dirname, `../_quality/${code}.png`)

            const title = await this.getTitle(imagePath)

            console.log(title)

            // checando se esse arquivo já têm na base de dados
            if (await SGIUser.findQualityFileByCode(code)) {
                // se existir deve enviar uma resposta de salvo com sucesso depois de atualizar o título e o caminho
                // obs.: O arquivo em si já vai estar salvo no disco rigído
                if (await SGIUser.updateFileData(code, title, filePath)) {
                    res.status(200).json('Arquivo salvo com sucesso!')
                }
            } else {
                // caso não exista deve salvar na base de dados
                // salvando os dados na base de dados
                if (await SGIUser.insertFileData(code, title, filePath)) {
                    res.status(200).json('Arquivo salvo com sucesso!')
                }
            }
            fs.unlinkSync(imagePath)
        } catch (error) {
            res.status(500).json({ message: 'Erro ao salvar o arquivo', errorDescription: error })
            console.log(error)
        }
    }

    static sendQualityFilesOptions = async (req: Request, res: Response) => {
        try {
            // aqui value é o valor enviado e by é se é código ou pelo titulo a pesquisa.
            const { value } = req.query

            const result = await SGIUser.searchQulityFilesByTitleOrCode(value as string) as []

            if (result.length > 0) {
                res.status(200).json(result)
            } else {
                res.status(404).json(result)
            }
        } catch (error) {
            res.status(500).json(error)
        }

    }
}