import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Baseline seed is intentionally minimal for local bootstrap.
  console.log('Seed completed: no baseline rows required.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
