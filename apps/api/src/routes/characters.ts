import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function characterRoutes(app: FastifyInstance) {
  app.get<{ Querystring: { system?: string; tag?: string } }>('/', async (request, reply) => {
    const { system, tag } = request.query

    const characters = await prisma.character.findMany({
      where: {
        isPublic: true,
        ...(system && { system: { equals: system, mode: 'insensitive' } }),
        ...(tag && { tags: { some: { tag: { equals: tag, mode: 'insensitive' } } } }),
      },
      include: {
        tags: { select: { tag: true } },
      },
      orderBy: { name: 'asc' },
    })

    return characters.map(({ tags, ...rest }) => ({
      id: rest.id,
      slug: rest.slug,
      name: rest.name,
      system: rest.system,
      thumbnailUrl: rest.thumbnailUrl,
      tags: tags.map((t) => t.tag),
    }))
  })

  app.get<{ Params: { slug: string } }>('/:slug', async (request, reply) => {
    const { slug } = request.params

    const character = await prisma.character.findFirst({
      where: { slug, isPublic: true },
      include: {
        tags: { select: { tag: true } },
        stories: {
          where: { isDraft: false },
          orderBy: { publishedAt: 'desc' },
          select: { id: true, slug: true, title: true, publishedAt: true },
        },
        voiceLines: { orderBy: { order: 'asc' } },
        artworks: { orderBy: { order: 'asc' } },
        timeline: { orderBy: { order: 'asc' } },
      },
    })

    if (!character) {
      return reply.code(404).send({ error: 'Character not found' })
    }

    return {
      ...character,
      tags: character.tags.map((t) => t.tag),
    }
  })
}
