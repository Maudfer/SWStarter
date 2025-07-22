import { FastifyPluginAsync } from 'fastify'
import { getPerson } from '../swapi'

const route: FastifyPluginAsync = async (app) => {
  app.get('/:id', async (req, res) => {
    const { id } = req.params as { id: string }
    const data = await getPerson(id)
    if (!data) return res.code(404).send({ error: 'Not found' })
    return data
  })
}

export default route
