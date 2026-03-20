import { Router } from 'express'
import { authenticate } from '../auth/auth.middleware'
import { optimizerService } from './optimizer.service'

const router = Router()

router.use(authenticate)

router.post('/run', async (req: any, res, next) => {
  try {
    const result = await optimizerService.runForOrganization(req.organizationId)
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
})

router.get('/runs', async (req: any, res, next) => {
  try {
    const { prisma } = await import('../../config/database')
    const runs = await prisma.optimizationRun.findMany({
      where: { organizationId: req.organizationId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    res.json({ success: true, data: runs })
  } catch (err) { next(err) }
})

export default router