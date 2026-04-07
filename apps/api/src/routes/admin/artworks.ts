import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { authenticate } from "../../plugins/auth";
import { deleteS3Object } from "../../lib/s3";

interface CreateArtworkBody {
  imageUrl: string;
  title?: string;
  caption?: string;
  artistCredit?: string;
  order?: number;
}

interface UpdateArtworkBody {
  imageUrl?: string;
  title?: string;
  caption?: string;
  artistCredit?: string;
  order?: number;
}

export async function adminArtworkRoutes(app: FastifyInstance) {
  app.get<{ Params: { id: string } }>(
    "/characters/:id/artworks",
    { preHandler: authenticate },
    async (request, reply) => {
      const character = await prisma.character.findUnique({
        where: { id: request.params.id },
      });
      if (!character) return reply.code(404).send({ error: "Not found" });
      if (character.createdById !== request.user.userId)
        return reply.code(403).send({ error: "Forbidden" });
      return prisma.artwork.findMany({
        where: { characterId: request.params.id },
        orderBy: { order: "asc" },
      });
    }
  );

  app.post<{ Params: { id: string }; Body: CreateArtworkBody }>(
    "/characters/:id/artworks",
    {
      preHandler: authenticate,
      schema: {
        body: {
          type: "object",
          required: ["imageUrl"],
          properties: { imageUrl: { type: "string" } },
        },
      },
    },
    async (request, reply) => {
      const character = await prisma.character.findUnique({
        where: { id: request.params.id },
      });
      if (!character) return reply.code(404).send({ error: "Not found" });
      if (character.createdById !== request.user.userId)
        return reply.code(403).send({ error: "Forbidden" });
      const artwork = await prisma.artwork.create({
        data: { ...request.body, characterId: request.params.id },
      });
      return reply.code(201).send(artwork);
    }
  );

  app.put<{ Params: { artworkId: string }; Body: UpdateArtworkBody }>(
    "/artworks/:artworkId",
    { preHandler: authenticate },
    async (request, reply) => {
      const { artworkId } = request.params;
      const existing = await prisma.artwork.findUnique({
        where: { id: artworkId },
        include: { character: { select: { createdById: true } } },
      });
      if (!existing) return reply.code(404).send({ error: "Not found" });
      if (existing.character.createdById !== request.user.userId)
        return reply.code(403).send({ error: "Forbidden" });
      const artwork = await prisma.artwork.update({
        where: { id: artworkId },
        data: request.body,
      });
      return artwork;
    }
  );

  app.delete<{ Params: { artworkId: string } }>(
    "/artworks/:artworkId",
    { preHandler: authenticate },
    async (request, reply) => {
      const { artworkId } = request.params;
      const existing = await prisma.artwork.findUnique({
        where: { id: artworkId },
        include: { character: { select: { createdById: true } } },
      });
      if (!existing) return reply.code(404).send({ error: "Not found" });
      if (existing.character.createdById !== request.user.userId)
        return reply.code(403).send({ error: "Forbidden" });
      try {
        await deleteS3Object(existing.imageUrl);
      } catch (err) {
        request.log.warn({ err, artworkId }, "S3 delete failed for artwork, proceeding with DB delete");
      }
      await prisma.artwork.delete({ where: { id: artworkId } });
      return reply.code(204).send();
    }
  );
}
