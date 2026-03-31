import Fastify from 'fastify'

export function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      ...(process.env.NODE_ENV !== 'production' && {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true },
        },
      }),
    },
  })

  app.get('/healthz', async () => {
    return { status: 'ok' }
  })

  return app
}
