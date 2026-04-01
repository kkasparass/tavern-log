import { FastifyInstance } from 'fastify'
import { characterRoutes } from './characters'

export async function registerRoutes(app: FastifyInstance) {
  await app.register(characterRoutes, { prefix: '/characters' })
}
