import { Router } from 'express'
import { productController } from './product.controller'
import { authenticate } from '../auth/auth.middleware'

const router = Router()

router.use(authenticate)

router.get('/', productController.getAll)
router.get('/:id', productController.getById)
router.post('/', productController.create)
router.patch('/:id', productController.update)
router.delete('/:id', productController.delete)

export default router