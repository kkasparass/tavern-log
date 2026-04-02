import { FastifyInstance } from 'fastify'
import { authRoutes } from './auth'
import { characterRoutes } from './characters'

export async function registerRoutes(app: FastifyInstance) {
  await app.register(authRoutes, { prefix: '/auth' })
  await app.register(characterRoutes, { prefix: '/characters' })
}
