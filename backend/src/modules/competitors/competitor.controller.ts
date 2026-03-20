import { Response, NextFunction } from 'express'
import { competitorService } from './competitor.service'

export const competitorController = {
  async getAll(req: any, res: Response, next: NextFunction) {
    try {
      const data = await competitorService.getAll(req.organizationId)
      res.json({ success: true, data })
    } catch (err) { next(err) }
  },

  async create(req: any, res: Response, next: NextFunction) {
    try {
      const data = await competitorService.create(req.organizationId, req.body)
      res.status(201).json({ success: true, data })
    } catch (err) { next(err) }
  },

  async sync(req: any, res: Response, next: NextFunction) {
    try {
      const result = await competitorService.sync(req.organizationId)
      res.json({ success: true, data: result })
    } catch (err) { next(err) }
  },
}