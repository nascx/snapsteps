import multer from 'multer'

import path from 'node:path'

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

// para salvar as listas de engenharia
const storageEngineeringList = multer.diskStorage({
    destination: (req, file, callback) => {
        const filePath: string = path.join(__dirname, '../files/_production_its')
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
        const filePath: string = path.join(__dirname, '../files/production_its')
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
        const filePath: string = path.join(__dirname, '../files/its')
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
        console.log('chamado')
        const filePath: string = path.join(__dirname, '../files/quality')
        callback(null, filePath)
    },
    filename: function (req, file, callback) {
        const fileName = file.originalname    
        callback(null, `${fileName}`)
    },
})  

export const uploadQualityFile = multer({ storage: storageQualityFile })      
