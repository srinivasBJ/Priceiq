import { Request, Response, NextFunction } from 'express'
import { authService } from './auth.service'

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name, orgName } = req.body
      const result = await authService.register(email, password, name, orgName)
      res.status(201).json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      const result = await authService.login(email, password)
      res.json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body
      const tokens = await authService.refresh(refreshToken)
      res.json({ success: true, data: tokens })
    } catch (err) {
      next(err)
    }
  },

  async logout(req: Request, res: Response) {
    res.json({ success: true, message: 'Logged out' })
  },
}