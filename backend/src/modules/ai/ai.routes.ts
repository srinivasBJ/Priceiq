import { Router } from 'express'
import { aiController } from './ai.controller'
import { authenticate } from '../auth/auth.middleware'

const router = Router()

router.use(authenticate)
router.post('/chat', aiController.chat)
router.get('/recommendations', aiController.getRecommendations)

export default router