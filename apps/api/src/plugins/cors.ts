import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

export async function corsPlugin(app: FastifyInstance) {
  const origin =
    process.env.NODE_ENV === "production" ? process.env.CORS_ORIGIN : "http://localhost:3000";

  if (process.env.NODE_ENV === "production" && !origin) {
    throw new Error("CORS_ORIGIN environment variable is required in production");
  }

  app.register(cors, {
    origin,
    credentials: true,
  });
}
