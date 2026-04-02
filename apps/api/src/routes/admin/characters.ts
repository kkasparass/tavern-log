import { FastifyInstance } from 'fastify'
import { CharacterStatus, Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { authenticate } from '../../plugins/auth'
import { toSlug } from '../../utils/slug'

interface CreateCharacterBody {
  name: string
  system: string
  campaign?: string
  status?: CharacterStatus
  bio?: string
  personality?: string
  thumbnailUrl?: string
  isPublic?: boolean
  theme?: Prisma.InputJsonValue
  tags?: string[]
}

interface UpdateCharacterBody {
  name?: string
  system?: string
  campaign?: string
  status?: CharacterStatus
  bio?: string
  personality?: string
  thumbnailUrl?: string
  isPublic?: boolean
  theme?: Prisma.InputJsonValue
  tags?: string[]
}

export async function adminCharacterRoutes(app: FastifyInstance) {
  app.get('/characters', { preHandler: authenticate }, async () => {
    return prisma.character.findMany({
      include: { tags: { select: { tag: true } } },
      orderBy: { name: 'asc' },
    })
  })

  app.post<{ Body: CreateCharacterBody }>(
    '/characters',
    {
      preHandler: authenticate,
      schema: {
        body: {
          type: 'object',
          required: ['name', 'system'],
          properties: {
            name: { type: 'string' },
            system: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const { tags, ...rest } = request.body
      const character = await prisma.character.create({
        data: {
          ...rest,
          createdById: request.user.userId,
          slug: toSlug(rest.name),
          ...(tags && tags.length > 0 && {
            tags: { create: tags.map((tag) => ({ tag })) },
          }),
        },
        include: { tags: { select: { tag: true } } },
      })
      return reply.code(201).send(character)
    }
  )

  app.get<{ Params: { id: string } }>(
    '/characters/:id',
    { preHandler: authenticate },
    async (request, reply) => {
      const character = await prisma.character.findUnique({
        where: { id: request.params.id },
        include: { tags: { select: { tag: true } } },
      })
      if (!character) return reply.code(404).send({ error: 'Not found' })
      return character
    }
  )

  app.put<{ Params: { id: string }; Body: UpdateCharacterBody }>(
    '/characters/:id',
    { preHandler: authenticate },
    async (request, reply) => {
      const { id } = request.params
      const { tags, ...rest } = request.body

      const existing = await prisma.character.findUnique({ where: { id } })
      if (!existing) return reply.code(404).send({ error: 'Not found' })

      if (tags !== undefined) {
        await prisma.characterTag.deleteMany({ where: { characterId: id } })
        if (tags.length > 0) {
          await prisma.characterTag.createMany({
            data: tags.map((tag) => ({ characterId: id, tag })),
          })
        }
      }

      const character = await prisma.character.update({
        where: { id },
        data: rest,
        include: { tags: { select: { tag: true } } },
      })
      return character
    }
  )

  app.delete<{ Params: { id: string } }>(
    '/characters/:id',
    { preHandler: authenticate },
    async (request, reply) => {
      const { id } = request.params
      const existing = await prisma.character.findUnique({ where: { id } })
      if (!existing) return reply.code(404).send({ error: 'Not found' })
      await prisma.character.delete({ where: { id } })
      return reply.code(204).send()
    }
  )
}
