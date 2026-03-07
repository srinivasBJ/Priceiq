import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../../config/database'
import { env } from '../../config/env'

export const authService = {
  async register(email: string, password: string, name: string, orgName: string) {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) throw { status: 409, message: 'Email already in use' }

    const hashed = await bcrypt.hash(password, 10)

    const org = await prisma.organization.create({
      data: {
        name: orgName,
        slug: orgName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      },
    })

    const user = await prisma.user.create({
      data: { email, password: hashed, name, role: 'OWNER', organizationId: org.id },
    })

    const tokens = generateTokens(user.id, org.id)
    return { user: sanitize(user), ...tokens }
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw { status: 401, message: 'Invalid credentials' }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw { status: 401, message: 'Invalid credentials' }

    const tokens = generateTokens(user.id, user.organizationId)
    return { user: sanitize(user), ...tokens }
  },

  async refresh(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as any
      const user = await prisma.user.findUnique({ where: { id: payload.userId } })
      if (!user) throw { status: 401, message: 'User not found' }

      const tokens = generateTokens(user.id, user.organizationId)
      return tokens
    } catch {
      throw { status: 401, message: 'Invalid refresh token' }
    }
  },
}

function generateTokens(userId: string, organizationId: string) {
  const accessToken = jwt.sign(
    { userId, organizationId },
    env.JWT_SECRET as string,
    { expiresIn: '15m' }
  )
  const refreshToken = jwt.sign(
    { userId, organizationId },
    env.JWT_REFRESH_SECRET as string,
    { expiresIn: '7d' }
  )
  return { accessToken, refreshToken }
}

function sanitize(user: any) {
  const { password, ...rest } = user
  return rest
}