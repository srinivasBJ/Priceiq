import { prisma } from '../../config/database'

export const userService = {
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    })
    if (!user) throw { status: 404, message: 'User not found' }
    const { password, ...rest } = user
    return rest
  },

  async getAll(organizationId: string) {
    return prisma.user.findMany({
      where: { organizationId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
  },
}