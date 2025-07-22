import { Queue, Worker } from 'bullmq'
import { computeStats } from './stats'

const connection = {
  host: process.env.REDIS_HOST || 'redis',
  port: Number(process.env.REDIS_PORT || 6379)
}

const queue = new Queue('stats', { connection })

async function init() {
  // schedule repeating job if not already scheduled
  await queue.add('compute', {}, { repeat: { every: 1000 * 60 * 5 } })
}

const worker = new Worker(
  'stats',
  async () => {
    await computeStats()
  },
  { connection }
)

worker.on('failed', (job, err) => {
  console.error('stats job failed', job?.id, err)
})

init().catch(err => {
  console.error(err)
  process.exit(1)
})
