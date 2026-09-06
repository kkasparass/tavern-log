import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function tagRoutes(app: FastifyInstance) {
  app.get<{ Querystring: { q?: string } }>("/", async (request) => {
    const q = request.query.q?.trim() ?? "";

    const grouped = await prisma.characterTag.groupBy({
      by: ["tag"],
      where: {
        ...(q && { tag: { startsWith: q, mode: "insensitive" } }),
        character: { isPublic: true },
      },
      _count: { tag: true },
      orderBy: [{ _count: { tag: "desc" } }, { tag: "asc" }],
      take: 10,
    });

    return {
      tags: grouped.map(({ tag, _count }) => ({ tag, count: _count.tag })),
    };
  });
}
