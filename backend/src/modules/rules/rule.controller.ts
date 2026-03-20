import { Response, NextFunction } from 'express'
import { ruleService } from './rule.service'

export const ruleController = {
  async getAll(req: any, res: Response, next: NextFunction) {
    try {
      const rules = await ruleService.getAll(req.organizationId)
      res.json({ success: true, data: rules })
    } catch (err) { next(err) }
  },

  async create(req: any, res: Response, next: NextFunction) {
    try {
      const rule = await ruleService.create(req.organizationId, req.body)
      res.status(201).json({ success: true, data: rule })
    } catch (err) { next(err) }
  },

  async update(req: any, res: Response, next: NextFunction) {
    try {
      const rule = await ruleService.update(req.params.id, req.organizationId, req.body)
      res.json({ success: true, data: rule })
    } catch (err) { next(err) }
  },

  async toggle(req: any, res: Response, next: NextFunction) {
    try {
      const rule = await ruleService.toggle(req.params.id, req.organizationId)
      res.json({ success: true, data: rule })
    } catch (err) { next(err) }
  },

  async delete(req: any, res: Response, next: NextFunction) {
    try {
      await ruleService.delete(req.params.id, req.organizationId)
      res.json({ success: true, message: 'Rule deleted' })
    } catch (err) { next(err) }
  },
}