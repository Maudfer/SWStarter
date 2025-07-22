import { FastifyPluginAsync } from 'fastify'
import { searchPeople, searchMovies } from '../swapi'
import { logQuery } from '../stats'

const route: FastifyPluginAsync = async (app) => {
  app.get('/', async (req, res) => {
    const { type = 'people', q = '' } = req.query as Record<string, string>
    if (!q) return res.code(400).send({ error: 'q required' })
    const start = Date.now()
    const data = type === 'movies'
      ? await searchMovies(q)
      : await searchPeople(q)
    const duration = Date.now() - start
    await logQuery({ q, type: type as any, duration, timestamp: Date.now() })
    return { results: data }
  })
}

export default route
