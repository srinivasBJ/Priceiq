import { Router } from 'express'
import { competitorController } from './competitor.controller'
import { authenticate } from '../auth/auth.middleware'

const router = Router()

router.use(authenticate)
router.get('/', competitorController.getAll)
router.post('/', competitorController.create)
router.post('/sync', competitorController.sync)

export default router