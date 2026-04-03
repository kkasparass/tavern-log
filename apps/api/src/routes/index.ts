import { FastifyInstance } from "fastify";
import { authRoutes } from "./auth";
import { characterRoutes } from "./characters";
import { adminCharacterRoutes } from "./admin/characters";
import { adminStoryRoutes } from "./admin/stories";
import { adminVoiceLineRoutes } from "./admin/voice-lines";
import { adminArtworkRoutes } from "./admin/artworks";
import { adminTimelineRoutes } from "./admin/timeline";
import { adminUploadRoutes } from "./admin/upload";

export async function registerRoutes(app: FastifyInstance) {
  await app.register(authRoutes, { prefix: "/auth" });
  await app.register(characterRoutes, { prefix: "/characters" });
  await app.register(adminCharacterRoutes, { prefix: "/admin" });
  await app.register(adminStoryRoutes, { prefix: "/admin" });
  await app.register(adminVoiceLineRoutes, { prefix: "/admin" });
  await app.register(adminArtworkRoutes, { prefix: "/admin" });
  await app.register(adminTimelineRoutes, { prefix: "/admin" });
  await app.register(adminUploadRoutes, { prefix: "/admin" });
}
