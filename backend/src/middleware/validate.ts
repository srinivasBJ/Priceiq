import { Request, Response, NextFunction } from 'express'
import { AnyZodObject } from 'zod'

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: result.error.flatten().fieldErrors,
      })
    }
    req.body = result.data
    next()
  }