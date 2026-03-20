import { Request, Response, NextFunction } from 'express'
import { logger } from '../config/logger'

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.message)
  const status = err.status || 500
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
  })
}