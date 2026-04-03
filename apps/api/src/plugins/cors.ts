import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

export async function corsPlugin(app: FastifyInstance) {
  app.register(cors, {
    origin:
      process.env.NODE_ENV === "production"
        ? "https://tavernlog.kasparas.dev"
        : "http://localhost:3000",
    credentials: true,
  });
}
