import { Router } from 'express'
import { ruleController } from './rule.controller'
import { authenticate } from '../auth/auth.middleware'

const router = Router()

router.use(authenticate)

router.get('/', ruleController.getAll)
router.post('/', ruleController.create)
router.patch('/:id', ruleController.update)
router.post('/:id/toggle', ruleController.toggle)
router.delete('/:id', ruleController.delete)

export default router