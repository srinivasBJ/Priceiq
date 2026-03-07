import { prisma } from '../../config/database'

export const ruleService = {
  async getAll(organizationId: string) {
    return prisma.pricingRule.findMany({
      where: { organizationId },
      orderBy: { priority: 'desc' },
    })
  },

  async create(organizationId: string, data: any) {
    return prisma.pricingRule.create({
      data: { ...data, organizationId },
    })
  },

  async update(id: string, organizationId: string, data: any) {
    const rule = await prisma.pricingRule.findFirst({ where: { id, organizationId } })
    if (!rule) throw { status: 404, message: 'Rule not found' }
    return prisma.pricingRule.update({ where: { id }, data })
  },

  async toggle(id: string, organizationId: string) {
    const rule = await prisma.pricingRule.findFirst({ where: { id, organizationId } })
    if (!rule) throw { status: 404, message: 'Rule not found' }
    return prisma.pricingRule.update({
      where: { id },
      data: { isActive: !rule.isActive },
    })
  },

  async delete(id: string, organizationId: string) {
    const rule = await prisma.pricingRule.findFirst({ where: { id, organizationId } })
    if (!rule) throw { status: 404, message: 'Rule not found' }
    await prisma.pricingRule.delete({ where: { id } })
    return { message: 'Rule deleted' }
  },
}