import { Router } from 'express'
import { analyticsController } from './analytics.controller'
import { authenticate } from '../auth/auth.middleware'

const router = Router()

router.use(authenticate)
router.get('/dashboard', analyticsController.getDashboard)
router.get('/revenue', analyticsController.getRevenue)

export default router