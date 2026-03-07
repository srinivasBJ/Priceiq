import rateLimit from 'express-rate-limit'
import { env } from '../config/env'

export const rateLimiter = rateLimit({
  windowMs: Number(env.RATE_LIMIT_WINDOW_MS),
  max: Number(env.RATE_LIMIT_MAX),
  message: { success: false, message: 'Too many requests' },
})