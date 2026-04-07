import { FastifyInstance } from "fastify";
import { CharacterStatus, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { authenticate } from "../../plugins/auth";
import { toSlug } from "../../utils/slug";
import { deleteS3Object } from "../../lib/s3";

interface CreateCharacterBody {
  name: string;
  system: string;
  campaign?: string;
  status?: CharacterStatus;
  bio?: string;
  personality?: string;
  thumbnailUrl?: string;
  isPublic?: boolean;
  theme?: Prisma.InputJsonValue;
  tags?: string[];
}

interface UpdateCharacterBody {
  name?: string;
  system?: string;
  campaign?: string;
  status?: CharacterStatus;
  bio?: string;
  personality?: string;
  thumbnailUrl?: string;
  isPublic?: boolean;
  theme?: Prisma.InputJsonValue;
  tags?: string[];
}

export async function adminCharacterRoutes(app: FastifyInstance) {
  app.get("/characters", { preHandler: authenticate }, async (request) => {
    const characters = await prisma.character.findMany({
      where: { createdById: request.user.userId },
      include: { tags: { select: { tag: true } } },
      orderBy: { name: "asc" },
    });
    return characters.map((c) => ({ ...c, tags: c.tags.map((t) => t.tag) }));
  });

  app.post<{ Body: CreateCharacterBody }>(
    "/characters",
    {
      preHandler: authenticate,
      schema: {
        body: {
          type: "object",
          required: ["name", "system"],
          properties: {
            name: { type: "string" },
            system: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      const { tags, ...rest } = request.body;
      const character = await prisma.character.create({
        data: {
          ...rest,
          createdById: request.user.userId,
          slug: toSlug(rest.name),
          ...(tags &&
            tags.length > 0 && {
              tags: { create: tags.map((tag) => ({ tag })) },
            }),
        },
        include: { tags: { select: { tag: true } } },
      });
      return reply.code(201).send(character);
    }
  );

  app.get<{ Params: { id: string } }>(
    "/characters/:id",
    { preHandler: authenticate },
    async (request, reply) => {
      const character = await prisma.character.findUnique({
        where: { id: request.params.id },
        include: { tags: { select: { tag: true } } },
      });
      if (!character) return reply.code(404).send({ error: "Not found" });
      if (character.createdById !== request.user.userId)
        return reply.code(403).send({ error: "Forbidden" });
      return { ...character, tags: character.tags.map((t) => t.tag) };
    }
  );

  app.put<{ Params: { id: string }; Body: UpdateCharacterBody }>(
    "/characters/:id",
    { preHandler: authenticate },
    async (request, reply) => {
      const { id } = request.params;
      const { tags, ...rest } = request.body;

      const existing = await prisma.character.findUnique({ where: { id } });
      if (!existing) return reply.code(404).send({ error: "Not found" });
      if (existing.createdById !== request.user.userId)
        return reply.code(403).send({ error: "Forbidden" });

      if (rest.thumbnailUrl && existing.thumbnailUrl && rest.thumbnailUrl !== existing.thumbnailUrl) {
        try {
          await deleteS3Object(existing.thumbnailUrl);
        } catch (err) {
          request.log.warn({ err, characterId: id }, "S3 delete failed for old character thumbnail, proceeding with update");
        }
      }

      if (tags !== undefined) {
        await prisma.characterTag.deleteMany({ where: { characterId: id } });
        if (tags.length > 0) {
          await prisma.characterTag.createMany({
            data: tags.map((tag) => ({ characterId: id, tag })),
          });
        }
      }

      const character = await prisma.character.update({
        where: { id },
        data: rest,
        include: { tags: { select: { tag: true } } },
      });
      return character;
    }
  );

  app.delete<{ Params: { id: string } }>(
    "/characters/:id",
    { preHandler: authenticate },
    async (request, reply) => {
      const { id } = request.params;
      const existing = await prisma.character.findUnique({
        where: { id },
        include: {
          artworks: { select: { imageUrl: true } },
          voiceLines: { select: { audioUrl: true } },
        },
      });
      if (!existing) return reply.code(404).send({ error: "Not found" });
      if (existing.createdById !== request.user.userId)
        return reply.code(403).send({ error: "Forbidden" });

      const s3Urls = [
        ...(existing.thumbnailUrl ? [existing.thumbnailUrl] : []),
        ...existing.artworks.map((a) => a.imageUrl),
        ...existing.voiceLines.map((v) => v.audioUrl),
      ];
      const results = await Promise.allSettled(s3Urls.map((url) => deleteS3Object(url)));
      results.forEach((result, i) => {
        if (result.status === "rejected") {
          request.log.warn({ err: result.reason, url: s3Urls[i] }, "S3 delete failed during character deletion");
        }
      });

      await prisma.character.delete({ where: { id } });
      return reply.code(204).send();
    }
  );
}
