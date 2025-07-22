import { FastifyPluginAsync } from 'fastify'
import { getLatestStats } from '../stats'

const route: FastifyPluginAsync = async (app) => {
  app.get('/', async (req, res) => {
    const stats = await getLatestStats()
    if (!stats) return res.code(503).send({ error: 'Stats not ready' })
    return stats
  })
}

export default route
