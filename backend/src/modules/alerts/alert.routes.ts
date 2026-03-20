import { Router } from 'express'
import { alertController } from './alert.controller'
import { authenticate } from '../auth/auth.middleware'

const router = Router()

router.use(authenticate)
router.get('/', alertController.getAll)
router.patch('/:id/resolve', alertController.resolve)

export default router