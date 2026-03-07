import { Response, NextFunction } from 'express'
import { analyticsService } from './analytics.service'

export const analyticsController = {
  async getDashboard(req: any, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getDashboard(req.organizationId)
      res.json({ success: true, data })
    } catch (err) { next(err) }
  },

  async getRevenue(req: any, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getRevenue(req.organizationId)
      res.json({ success: true, data })
    } catch (err) { next(err) }
  },
}