import express from 'express'

import cors from 'cors'

import { config  } from 'dotenv'
  
import { uploadEngineeringLists, uploadIT, uploadProductionListsMulter } from '../src/config/multer'

import { downloadList, getModelAndProductOptions, getModelProductOptionsAndLine, uploadProductionLists } from './controllers/producionCtrl'
import { handleUploadIT } from './controllers/sgiCtrl'
import { sendPdf } from './views/sendCompletePdf'
import { sendPdfByPost } from './views/sendPDfByPost'
import { sendQAFile } from './views/sendQAfile'
import { Auth } from './controllers/Auth'
import { Multer, uploadQualityFile } from '../src/config/multer'
import { SGIUserController } from './controllers/SGIUserController'
config()

const snapsteps = express()

snapsteps.use(express.json())

snapsteps.use(cors())

snapsteps.get('/auth', Auth.credentialCheck)

snapsteps.post('/eng/list-upload', uploadEngineeringLists.single('list'), uploadProductionLists )

snapsteps.get('/prod/download-list', downloadList)

snapsteps.get('/get-model-and-product-options', getModelAndProductOptions)

snapsteps.post('/production/upload-file', uploadProductionListsMulter.single('prod-list'), uploadProductionLists)

snapsteps.post('/sgi/upload-it', uploadIT.single('it'), handleUploadIT)

snapsteps.get('/production/get-options-to-pdf', getModelProductOptionsAndLine)

snapsteps.get('/pdf', sendPdf)

snapsteps.get('/pdf-by-post', sendPdfByPost)


// rota para salvar o arquivo da qualidade
snapsteps.post(
    '/sgi/upload/qualityfile',
    uploadQualityFile.single('quality-file'),
    SGIUserController.saveFile
)

// rota para obter as opções de arquivos da qualidade
snapsteps.get('/qa/get-qa-file-options', SGIUserController.sendQualityFilesOptions)

snapsteps.get('/qa/view-it', sendQAFile)

const port = process.env.PORT || 4322

snapsteps.listen(port, () => {
    console.log('Server listen in ', port, 'port')
})