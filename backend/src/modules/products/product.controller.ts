import { Request, Response, NextFunction } from 'express'
import { productService } from './product.service'

export const productController = {
  async getAll(req: any, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query
      const result = await productService.getAll(
        req.organizationId,
        Number(page) || 1,
        Number(limit) || 20
      )
      res.json({ success: true, data: result })
    } catch (err) { next(err) }
  },

  async getById(req: any, res: Response, next: NextFunction) {
    try {
      const product = await productService.getById(req.params.id, req.organizationId)
      res.json({ success: true, data: product })
    } catch (err) { next(err) }
  },

  async create(req: any, res: Response, next: NextFunction) {
    try {
      const product = await productService.create(req.organizationId, req.body)
      res.status(201).json({ success: true, data: product })
    } catch (err) { next(err) }
  },

  async update(req: any, res: Response, next: NextFunction) {
    try {
      const product = await productService.update(req.params.id, req.organizationId, req.body)
      res.json({ success: true, data: product })
    } catch (err) { next(err) }
  },

  async delete(req: any, res: Response, next: NextFunction) {
    try {
      await productService.delete(req.params.id, req.organizationId)
      res.json({ success: true, message: 'Product deleted' })
    } catch (err) { next(err) }
  },
}