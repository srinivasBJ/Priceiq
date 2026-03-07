import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../../config/env'

export const authenticate = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ success: false, message: 'No token' })

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as any
    req.userId = payload.userId
    req.organizationId = payload.organizationId
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' })
  }
}

export const authorize = (...roles: string[]) =>
  (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }
    next()
  }