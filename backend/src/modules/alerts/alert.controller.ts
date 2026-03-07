import { Response, NextFunction } from 'express'
import { alertService } from './alert.service'

export const alertController = {
  async getAll(req: any, res: Response, next: NextFunction) {
    try {
      const alerts = await alertService.getAll(req.organizationId)
      res.json({ success: true, data: alerts })
    } catch (err) { next(err) }
  },

  async resolve(req: any, res: Response, next: NextFunction) {
    try {
      const alert = await alertService.resolve(req.params.id, req.organizationId)
      res.json({ success: true, data: alert })
    } catch (err) { next(err) }
  },
}