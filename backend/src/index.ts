import 'dotenv/config'
import app from './app'
import { env } from './config/env'
import { prisma } from './config/database'

const PORT = Number(env.PORT) || 3001

async function main() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected')

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
      console.log(`📚 API available at http://localhost:${PORT}/api/v1`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

main()