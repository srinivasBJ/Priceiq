import { prisma } from '../../config/database'

export const alertService = {
  async getAll(organizationId: string) {
    return prisma.alert.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    })
  },

  async resolve(id: string, organizationId: string) {
    const alert = await prisma.alert.findFirst({ where: { id, organizationId } })
    if (!alert) throw { status: 404, message: 'Alert not found' }
    return prisma.alert.update({
      where: { id },
      data: { isResolved: true, resolvedAt: new Date() },
    })
  },

  async create(organizationId: string, type: string, message: string) {
    return prisma.alert.create({
      data: { organizationId, type, message },
    })
  },
}