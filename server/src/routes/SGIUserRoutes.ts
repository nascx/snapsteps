// importações
import { Router } from 'express' // para criar o roteador
import { SGIUserController } from '@src/controllers/SGIUserController'
import { Multer } from '@src/config/multer'

// criação do roteador
const SGIUserRouter = Router()

// pegando a configuração do multer para salvar o arquivo
const uploadQualityFile = Multer.getUploadMiddleware()

// rora para salvar o arquivo da qualidade
SGIUserRouter.post(
    '/sgi/upload/qualityfile',
    uploadQualityFile.single('quality-file'),
    SGIUserController.saveFile
)

// exportando a rota
export default SGIUserRouter