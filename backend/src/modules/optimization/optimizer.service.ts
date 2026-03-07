import { prisma } from '../../config/database'

export const optimizerService = {
  async runForOrganization(organizationId: string) {
    const run = await prisma.optimizationRun.create({
      data: { organizationId, status: 'running', productsCount: 0 },
    })

    try {
      const products = await prisma.product.findMany({
        where: { organizationId },
        include: { competitors: true, priceHistory: { take: 10, orderBy: { createdAt: 'desc' } } },
      })

      const rules = await prisma.pricingRule.findMany({
        where: { organizationId, isActive: true },
        orderBy: { priority: 'desc' },
      })

      let optimized = 0

      for (const product of products) {
        const newPrice = this.calculateOptimalPrice(product, rules)

        if (newPrice !== product.currentPrice) {
          await prisma.product.update({
            where: { id: product.id },
            data: { currentPrice: newPrice },
          })
          await prisma.priceHistory.create({
            data: { productId: product.id, price: newPrice, reason: 'AI optimization' },
          })
          optimized++
        }
      }

      await prisma.optimizationRun.update({
        where: { id: run.id },
        data: { status: 'completed', productsCount: optimized, completedAt: new Date() },
      })

      return { runId: run.id, optimized, total: products.length }
    } catch (error) {
      await prisma.optimizationRun.update({
        where: { id: run.id },
        data: { status: 'failed' },
      })
      throw error
    }
  },

  calculateOptimalPrice(product: any, rules: any[]) {
    let price = product.currentPrice

    // Apply competitor-based pricing
    if (product.competitors.length > 0) {
      const avgCompetitorPrice =
        product.competitors.reduce((sum: number, c: any) => sum + c.price, 0) /
        product.competitors.length
      price = avgCompetitorPrice * 0.98 // 2% below average
    }

    // Apply rules
    for (const rule of rules) {
      const action = rule.action as any
      if (action.type === 'discount') {
        price = price * (1 - action.value / 100)
      } else if (action.type === 'markup') {
        price = price * (1 + action.value / 100)
      } else if (action.type === 'fixed') {
        price = action.value
      }
    }

    // Enforce min/max bounds
    price = Math.max(product.minPrice, Math.min(product.maxPrice, price))

    return Math.round(price * 100) / 100
  },
}