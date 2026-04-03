import { FastifyInstance } from "fastify";
import { authenticate } from "../../plugins/auth";
import { presignPutUrl } from "../../lib/s3";
import { randomUUID } from "crypto";
import path from "path";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/aac",
]);

interface PresignBody {
  filename: string;
  contentType: string;
}

export async function adminUploadRoutes(app: FastifyInstance) {
  app.post<{ Body: PresignBody }>(
    "/upload/presign",
    {
      preHandler: authenticate,
      schema: {
        body: {
          type: "object",
          required: ["filename", "contentType"],
          properties: {
            filename: { type: "string" },
            contentType: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      const { filename, contentType } = request.body;

      if (!ALLOWED_MIME_TYPES.has(contentType)) {
        return reply.code(400).send({ error: "Unsupported file type" });
      }

      const ext = path.extname(filename);
      const key = `uploads/${randomUUID()}${ext}`;

      const { uploadUrl, objectUrl } = await presignPutUrl(key, contentType);

      return { uploadUrl, objectUrl };
    },
  );
}
