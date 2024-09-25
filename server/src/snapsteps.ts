import express from 'express'

import cors from 'cors'

import { config  } from 'dotenv'
  
import { uploadEngineeringLists, uploadIT, uploadProductionListsMulter } from '../src/config/multer'

import { ProdUserController, } from './controllers/ProdUserController'
import { handleUploadIT } from './controllers/sgiCtrl'
import { sendPdfByPost } from './views/sendPDfByPost'
import { sendQAFile } from './views/sendQAfile'
import { Auth } from './controllers/Auth'
import { uploadQualityFile } from '../src/config/multer'
import { SGIUserController } from './controllers/SGIUserController'
import { ProdUserViews } from './views/ProdUserViews'
config()

const snapsteps = express()

snapsteps.use(express.json())

snapsteps.use(cors())

snapsteps.get('/auth', Auth.credentialCheck)

snapsteps.post('/eng/list-upload', uploadEngineeringLists.single('list'), ProdUserController.uploadProductionLists )

snapsteps.get('/prod/download-list', ProdUserController.downloadList)

snapsteps.get('/get-model-and-product-options', ProdUserController.getModelAndProductOptions)

snapsteps.post('/production/upload-file', uploadProductionListsMulter.single('prod-list'), ProdUserController.uploadProductionLists)

snapsteps.post('/sgi/upload-it', uploadIT.single('it'), handleUploadIT)

snapsteps.get('/production/get-options-to-pdf', ProdUserController.getModelProductOptionsAndLine)

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

// para as opções
snapsteps.get('/options/models', ProdUserViews.getModelOptions)
snapsteps.get('/options/products', ProdUserViews.getProductOptionsByModel)
snapsteps.get('/options/lines', ProdUserViews.getLinesOptionsByModelAndProduct)

// para gerar a it de produção com paralelismo 
snapsteps.get('/prod/get-production-it', ProdUserViews.sendProductionIT)

const port = process.env.PORT || 8200

snapsteps.listen(port, () => {
    console.log('Server listen in ', port, 'port')
})