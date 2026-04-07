import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { authenticate } from "../../plugins/auth";
import { deleteS3Object } from "../../lib/s3";

interface CreateVoiceLineBody {
  audioUrl: string;
  transcript: string;
  context?: string;
  order?: number;
}

interface UpdateVoiceLineBody {
  audioUrl?: string;
  transcript?: string;
  context?: string;
  order?: number;
}

export async function adminVoiceLineRoutes(app: FastifyInstance) {
  app.get<{ Params: { id: string } }>(
    "/characters/:id/voice-lines",
    { preHandler: authenticate },
    async (request, reply) => {
      const character = await prisma.character.findUnique({ where: { id: request.params.id } });
      if (!character) return reply.code(404).send({ error: "Not found" });
      if (character.createdById !== request.user.userId)
        return reply.code(403).send({ error: "Forbidden" });
      return prisma.voiceLine.findMany({
        where: { characterId: request.params.id },
        orderBy: { order: "asc" },
      });
    }
  );

  app.post<{ Params: { id: string }; Body: CreateVoiceLineBody }>(
    "/characters/:id/voice-lines",
    {
      preHandler: authenticate,
      schema: {
        body: {
          type: "object",
          required: ["audioUrl", "transcript"],
          properties: {
            audioUrl: { type: "string" },
            transcript: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      const character = await prisma.character.findUnique({ where: { id: request.params.id } });
      if (!character) return reply.code(404).send({ error: "Not found" });
      if (character.createdById !== request.user.userId)
        return reply.code(403).send({ error: "Forbidden" });
      const voiceLine = await prisma.voiceLine.create({
        data: { ...request.body, characterId: request.params.id },
      });
      return reply.code(201).send(voiceLine);
    }
  );

  app.put<{ Params: { voiceLineId: string }; Body: UpdateVoiceLineBody }>(
    "/voice-lines/:voiceLineId",
    { preHandler: authenticate },
    async (request, reply) => {
      const { voiceLineId } = request.params;
      const existing = await prisma.voiceLine.findUnique({
        where: { id: voiceLineId },
        include: { character: { select: { createdById: true } } },
      });
      if (!existing) return reply.code(404).send({ error: "Not found" });
      if (existing.character.createdById !== request.user.userId)
        return reply.code(403).send({ error: "Forbidden" });
      const voiceLine = await prisma.voiceLine.update({
        where: { id: voiceLineId },
        data: request.body,
      });
      return voiceLine;
    }
  );

  app.delete<{ Params: { voiceLineId: string } }>(
    "/voice-lines/:voiceLineId",
    { preHandler: authenticate },
    async (request, reply) => {
      const { voiceLineId } = request.params;
      const existing = await prisma.voiceLine.findUnique({
        where: { id: voiceLineId },
        include: { character: { select: { createdById: true } } },
      });
      if (!existing) return reply.code(404).send({ error: "Not found" });
      if (existing.character.createdById !== request.user.userId)
        return reply.code(403).send({ error: "Forbidden" });
      try {
        await deleteS3Object(existing.audioUrl);
      } catch (err) {
        request.log.warn({ err, voiceLineId }, "S3 delete failed for voice line, proceeding with DB delete");
      }
      await prisma.voiceLine.delete({ where: { id: voiceLineId } });
      return reply.code(204).send();
    }
  );
}
