import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { authenticate } from "../../plugins/auth";
import { toSlug } from "../../utils/slug";

interface CreateStoryBody {
  title: string;
  content?: string;
}

interface UpdateStoryBody {
  title?: string;
  content?: string;
  isDraft?: boolean;
}

export async function adminStoryRoutes(app: FastifyInstance) {
  app.get<{ Params: { id: string } }>(
    "/characters/:id/stories",
    { preHandler: authenticate },
    async (request, reply) => {
      const character = await prisma.character.findUnique({ where: { id: request.params.id } });
      if (!character) return reply.code(404).send({ error: "Not found" });
      if (character.createdById !== request.user.userId)
        return reply.code(403).send({ error: "Forbidden" });
      return prisma.story.findMany({
        where: { characterId: request.params.id },
        orderBy: { createdAt: "desc" },
      });
    }
  );

  app.post<{ Params: { id: string }; Body: CreateStoryBody }>(
    "/characters/:id/stories",
    {
      preHandler: authenticate,
      schema: {
        body: {
          type: "object",
          required: ["title"],
          properties: { title: { type: "string" } },
        },
      },
    },
    async (request, reply) => {
      const character = await prisma.character.findUnique({ where: { id: request.params.id } });
      if (!character) return reply.code(404).send({ error: "Not found" });
      if (character.createdById !== request.user.userId)
        return reply.code(403).send({ error: "Forbidden" });
      const story = await prisma.story.create({
        data: {
          characterId: request.params.id,
          title: request.body.title,
          slug: toSlug(request.body.title),
          content: request.body.content ?? "",
          isDraft: true,
        },
      });
      return reply.code(201).send(story);
    }
  );

  app.put<{ Params: { storyId: string }; Body: UpdateStoryBody }>(
    "/stories/:storyId",
    { preHandler: authenticate },
    async (request, reply) => {
      const { storyId } = request.params;
      const { isDraft, ...rest } = request.body;

      const existing = await prisma.story.findUnique({
        where: { id: storyId },
        include: { character: { select: { createdById: true } } },
      });
      if (!existing) return reply.code(404).send({ error: "Not found" });
      if (existing.character.createdById !== request.user.userId)
        return reply.code(403).send({ error: "Forbidden" });

      const publishedAt =
        isDraft === false && existing.isDraft === true
          ? new Date()
          : isDraft === true && existing.isDraft === false
            ? null
            : undefined;

      const story = await prisma.story.update({
        where: { id: storyId },
        data: {
          ...rest,
          ...(isDraft !== undefined && { isDraft }),
          ...(publishedAt !== undefined && { publishedAt }),
        },
      });
      return story;
    }
  );

  app.delete<{ Params: { storyId: string } }>(
    "/stories/:storyId",
    { preHandler: authenticate },
    async (request, reply) => {
      const { storyId } = request.params;
      const existing = await prisma.story.findUnique({
        where: { id: storyId },
        include: { character: { select: { createdById: true } } },
      });
      if (!existing) return reply.code(404).send({ error: "Not found" });
      if (existing.character.createdById !== request.user.userId)
        return reply.code(403).send({ error: "Forbidden" });
      await prisma.story.delete({ where: { id: storyId } });
      return reply.code(204).send();
    }
  );
}
