import express from 'express'

import cors from 'cors'

import { config  } from 'dotenv'

import { uploadEngineeringLists, uploadIT, uploadProductionListsMulter, uploadQuality } from '../src/config/multer'

import { downloadList, getModelAndProductOptions, getModelProductOptionsAndLine, uploadProductionLists } from './controllers/producionCtrl'
import { handleUploadIT, handleUploadQualityFile } from './controllers/sgiCtrl'
import { sendPdf } from './views/sendCompletePdf'
import { sendPdfByPost } from './views/sendPDfByPost'
import { sendQAFilesOptions } from './controllers/qaCtrl'
import { sendQAFile } from './views/sendQAfile'
import { credentialCheck } from './controllers/authCtrl'

config()

const snapsteps = express()

snapsteps.use(express.json())

snapsteps.use(cors())

snapsteps.get('/auth', credentialCheck)

snapsteps.post('/eng/list-upload', uploadEngineeringLists.single('list'), uploadProductionLists )

snapsteps.get('/prod/download-list', downloadList)

snapsteps.get('/get-model-and-product-options', getModelAndProductOptions)

snapsteps.post('/production/upload-file', uploadProductionListsMulter.single('prod-list'), uploadProductionLists)

snapsteps.post('/sgi/upload-it', uploadIT.single('it'), handleUploadIT)

snapsteps.get('/production/get-options-to-pdf', getModelProductOptionsAndLine)

snapsteps.get('/pdf', sendPdf)

snapsteps.get('/pdf-by-post', sendPdfByPost)

snapsteps.post('/sgi/upload-quality-file', uploadQuality.single('quality'), handleUploadQualityFile)

snapsteps.get('/qa/get-files', sendQAFilesOptions)

snapsteps.get('/qa/view-it', sendQAFile)

const port = process.env.PORT || 4322

snapsteps.listen(port, () => {
    console.log('Server listen in ', port, 'port')
})