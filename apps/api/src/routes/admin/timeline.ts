import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { authenticate } from "../../plugins/auth";

interface CreateTimelineEventBody {
  title: string;
  description?: string;
  dateLabel?: string;
  order?: number;
}

interface UpdateTimelineEventBody {
  title?: string;
  description?: string;
  dateLabel?: string;
  order?: number;
}

export async function adminTimelineRoutes(app: FastifyInstance) {
  app.get<{ Params: { id: string } }>(
    "/characters/:id/timeline",
    { preHandler: authenticate },
    async (request, reply) => {
      const character = await prisma.character.findUnique({ where: { id: request.params.id } });
      if (!character) return reply.code(404).send({ error: "Not found" });
      if (character.createdById !== request.user.userId)
        return reply.code(403).send({ error: "Forbidden" });
      return prisma.timelineEvent.findMany({
        where: { characterId: request.params.id },
        orderBy: { order: "asc" },
      });
    }
  );

  app.post<{ Params: { id: string }; Body: CreateTimelineEventBody }>(
    "/characters/:id/timeline",
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
      const event = await prisma.timelineEvent.create({
        data: { ...request.body, characterId: request.params.id },
      });
      return reply.code(201).send(event);
    }
  );

  app.put<{ Params: { eventId: string }; Body: UpdateTimelineEventBody }>(
    "/timeline/:eventId",
    { preHandler: authenticate },
    async (request, reply) => {
      const { eventId } = request.params;
      const existing = await prisma.timelineEvent.findUnique({
        where: { id: eventId },
        include: { character: { select: { createdById: true } } },
      });
      if (!existing) return reply.code(404).send({ error: "Not found" });
      if (existing.character.createdById !== request.user.userId)
        return reply.code(403).send({ error: "Forbidden" });
      const event = await prisma.timelineEvent.update({
        where: { id: eventId },
        data: request.body,
      });
      return event;
    }
  );

  app.delete<{ Params: { eventId: string } }>(
    "/timeline/:eventId",
    { preHandler: authenticate },
    async (request, reply) => {
      const { eventId } = request.params;
      const existing = await prisma.timelineEvent.findUnique({
        where: { id: eventId },
        include: { character: { select: { createdById: true } } },
      });
      if (!existing) return reply.code(404).send({ error: "Not found" });
      if (existing.character.createdById !== request.user.userId)
        return reply.code(403).send({ error: "Forbidden" });
      await prisma.timelineEvent.delete({ where: { id: eventId } });
      return reply.code(204).send();
    }
  );
}
