import { prisma } from '../../config/database'

export const productService = {
  async getAll(organizationId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { organizationId },
        include: { priceHistory: { take: 5, orderBy: { createdAt: 'desc' } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where: { organizationId } }),
    ])
    return { products, total, page, limit, pages: Math.ceil(total / limit) }
  },

  async getById(id: string, organizationId: string) {
    const product = await prisma.product.findFirst({
      where: { id, organizationId },
      include: {
        priceHistory: { orderBy: { createdAt: 'desc' }, take: 20 },
        competitors: true,
      },
    })
    if (!product) throw { status: 404, message: 'Product not found' }
    return product
  },

  async create(organizationId: string, data: any) {
    const product = await prisma.product.create({
      data: { ...data, organizationId },
    })
    await prisma.priceHistory.create({
      data: { productId: product.id, price: product.currentPrice, reason: 'Initial price' },
    })
    return product
  },

  async update(id: string, organizationId: string, data: any) {
    const product = await prisma.product.findFirst({ where: { id, organizationId } })
    if (!product) throw { status: 404, message: 'Product not found' }

    const updated = await prisma.product.update({
      where: { id },
      data,
    })

    if (data.currentPrice && data.currentPrice !== product.currentPrice) {
      await prisma.priceHistory.create({
        data: { productId: id, price: data.currentPrice, reason: data.reason || 'Manual update' },
      })
    }
    return updated
  },

  async delete(id: string, organizationId: string) {
    const product = await prisma.product.findFirst({ where: { id, organizationId } })
    if (!product) throw { status: 404, message: 'Product not found' }
    await prisma.product.delete({ where: { id } })
    return { message: 'Product deleted' }
  },
}