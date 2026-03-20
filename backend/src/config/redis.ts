import { createClient } from 'redis'
import { env } from './env'

export const redis = createClient({
  url: env.REDIS_URL,
})

redis.on('error', (err) => console.error('❌ Redis error:', err))
redis.on('connect', () => console.log('✅ Redis connected'))

redis.connect()

export default redis