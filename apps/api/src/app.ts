import Fastify from "fastify";
import { authPlugin } from "./plugins/auth";
import { registerRoutes } from "./routes";

export function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      ...(process.env.NODE_ENV !== "production" && {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }),
    },
  });

  app.get("/healthz", async () => {
    return { status: "ok" };
  });

  app.register(authPlugin);
  registerRoutes(app);

  return app;
}
