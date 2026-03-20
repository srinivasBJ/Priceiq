import { Request, Response, NextFunction } from 'express'
import { aiService } from './ai.service'
import { prisma } from '../../config/database'

export const aiController = {
  async chat(req: any, res: Response, next: NextFunction) {
    try {
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')

      const { messages } = req.body
      await aiService.chat(messages, res)
    } catch (err) { next(err) }
  },

  async getRecommendations(req: any, res: Response, next: NextFunction) {
    try {
      const products = await prisma.product.findMany({
        where: { organizationId: req.organizationId },
        take: 10,
      })
      const recommendations = await aiService.getRecommendations(products)
      res.json({ success: true, data: recommendations })
    } catch (err) { next(err) }
  },
}