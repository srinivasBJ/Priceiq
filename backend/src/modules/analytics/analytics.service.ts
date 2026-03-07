import { prisma } from '../../config/database'

export const analyticsService = {
  async getDashboard(organizationId: string) {
    const [products, recentRuns, alerts] = await Promise.all([
      prisma.product.findMany({ where: { organizationId } }),
      prisma.optimizationRun.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.alert.count({
        where: { organizationId, isResolved: false },
      }),
    ])

    const totalRevenue = products.reduce((sum, p) => sum + p.currentPrice, 0)
    const avgMargin = products.reduce((sum, p) => sum + ((p.currentPrice - p.costPrice) / p.currentPrice) * 100, 0) / (products.length || 1)

    return {
      totalProducts: products.length,
      totalRevenue,
      avgMargin: Math.round(avgMargin * 100) / 100,
      unresolvedAlerts: alerts,
      recentRuns,
    }
  },

  async getRevenue(organizationId: string) {
    const snapshots = await prisma.analyticsSnapshot.findMany({
      where: { organizationId },
      orderBy: { date: 'asc' },
      take: 30,
    })
    return snapshots
  },
}