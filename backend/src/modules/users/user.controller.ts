import { Response, NextFunction } from 'express'
import { userService } from './user.service'

export const userController = {
  async getMe(req: any, res: Response, next: NextFunction) {
    try {
      const user = await userService.getMe(req.userId)
      res.json({ success: true, data: user })
    } catch (err) { next(err) }
  },

  async getAll(req: any, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAll(req.organizationId)
      res.json({ success: true, data: users })
    } catch (err) { next(err) }
  },
}