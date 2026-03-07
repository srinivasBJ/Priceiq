import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env'

// Routes
import authRoutes from './modules/auth/auth.routes'
import userRoutes from './modules/users/user.routes'
import productRoutes from './modules/products/product.routes'
import ruleRoutes from './modules/rules/rule.routes'
import analyticsRoutes from './modules/analytics/analytics.routes'
import competitorRoutes from './modules/competitors/competitor.routes'
import alertRoutes from './modules/alerts/alert.routes'
import optimizationRoutes from './modules/optimization/optimization.routes'
import aiRoutes from './modules/ai/ai.routes'

// Middleware
import { errorHandler } from './middleware/errorHandler'
import { rateLimiter } from './middleware/rateLimiter'

const app = express()

// Core middleware
app.use(helmet())
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(rateLimiter)

// Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/rules', ruleRoutes)
app.use('/api/v1/analytics', analyticsRoutes)
app.use('/api/v1/competitors', competitorRoutes)
app.use('/api/v1/alerts', alertRoutes)
app.use('/api/v1/optimization', optimizationRoutes)
app.use('/api/v1/ai', aiRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: env.NODE_ENV })
})

// Error handler
app.use(errorHandler)

export default app