import { prisma } from '../../config/database'

export const competitorService = {
  async getAll(organizationId: string) {
    return prisma.competitorProduct.findMany({
      where: { organizationId },
      include: { product: true },
      orderBy: { updatedAt: 'desc' },
    })
  },

  async create(organizationId: string, data: any) {
    return prisma.competitorProduct.create({
      data: { ...data, organizationId },
    })
  },

  async sync(organizationId: string) {
    const competitors = await prisma.competitorProduct.findMany({
      where: { organizationId },
    })
    // Mock sync — replace with Playwright scraper later
    for (const c of competitors) {
      const mockPrice = c.price * (0.95 + Math.random() * 0.1)
      await prisma.competitorProduct.update({
        where: { id: c.id },
        data: { price: Math.round(mockPrice * 100) / 100, lastScrapedAt: new Date() },
      })
    }
    return { synced: competitors.length }
  },
}