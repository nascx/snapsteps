import multer from 'multer'

import path from 'node:path'

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

// para salvar as listas de engenharia
const storageEngineeringList = multer.diskStorage({
    destination: (req, file, callback) => {
        const filePath: string = path.join(__dirname, '../00_production_lists')
        console.log('Função chamada!')
        callback(null, filePath)
    },
    filename: function (req, file, callback) {
        const fileName = file.originalname
        callback(null, `${fileName}`)
    },
})

export const uploadEngineeringLists = multer({ storage: storageEngineeringList })

// para salvar as listas de produção
const storageProductionList = multer.diskStorage({
    destination: (req, file, callback) => {
        const filePath: string = path.join(__dirname, '../00_production_lists')
        console.log('Chamado no multer: ', filePath)
        callback(null, filePath)
    },
    filename: function (req, file, callback) {
        const fileName = file.originalname
        callback(null, `${fileName}`)
    },
})

export const uploadProductionListsMulter = multer({ storage: storageProductionList })

// para salvar as IT'S
const storageIT = multer.diskStorage({

    destination: (req, file, callback) => {
        const filePath: string = path.join(__dirname, '../_its')
        callback(null, filePath)
    },
    filename: function (req, file, callback) {
        const fileName = file.originalname
        callback(null, `${fileName}`)
    },
})

export const uploadIT = multer({ storage: storageIT })

const storageQualityFile = multer.diskStorage({
    destination: (req, file, callback) => {
        const filePath: string = path.join(__dirname, '../../_quality')
        callback(null, filePath)
    },
    filename: function (req, file, callback) {
        const fileName = file.originalname    
        callback(null, `${fileName}`)
    },
})  

export const uploadQualityFile = multer({ storage: storageQualityFile })      

// Para salvar os arquivos da qualidade



export class Multer {

    private static storageQualityFile: multer.StorageEngine

    constructor() {

        Multer.storageQualityFile = multer.diskStorage({
            destination: (req, file, callback) => {
                console.log('Foi chamado')
                const filePath: string = path.join(__dirname, '../../_quality')
                callback(null, filePath)
            },
            filename: function (req, file, callback) {
                const fileName = file.originalname
                callback(null, `${fileName}`)
            },
        })
    }

    static getUploadMiddleware() : multer.Multer {
        return multer({ storage: Multer.storageQualityFile });
    }

}