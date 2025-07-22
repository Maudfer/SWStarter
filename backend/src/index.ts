import Fastify, { FastifyServerOptions } from 'fastify'
import cors from '@fastify/cors'
import searchRoutes from './routes/search'
import peopleRoutes from './routes/people'
import movieRoutes from './routes/movies'
import statsRoutes from './routes/stats'

async function build(opts: FastifyServerOptions = {}) {
  const app = Fastify({ logger: true, ...opts })
  await app.register(cors, { origin: '*' })

  app.register(searchRoutes, { prefix: '/search' })
  app.register(peopleRoutes, { prefix: '/people' })
  app.register(movieRoutes, { prefix: '/movies' })
  app.register(statsRoutes, { prefix: '/stats' })

  return app
}

async function start() {
  const app = await build()
  const port = Number(process.env.PORT ?? 4000)
  await app.listen({ port, host: '0.0.0.0' })
}

if (require.main === module) {
  start().catch(err => {
    console.error(err)
    process.exit(1)
  })
}

export default build
