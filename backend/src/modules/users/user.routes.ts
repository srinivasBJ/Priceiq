import { Router } from 'express'
import { userController } from './user.controller'
import { authenticate } from '../auth/auth.middleware'

const router = Router()

router.use(authenticate)
router.get('/me', userController.getMe)
router.get('/', userController.getAll)

export default router