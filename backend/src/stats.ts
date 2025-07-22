import Redis from 'ioredis'

export interface QueryLog {
  q: string
  type: 'people' | 'movies'
  duration: number
  timestamp: number
}

export interface Stats {
  topQueries: { query: string; count: number; percentage: number }[]
  averageDuration: number
  mostPopularHour: number
}

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: Number(process.env.REDIS_PORT || 6379)
})

export async function logQuery(log: QueryLog) {
  await redis.lpush('query_logs', JSON.stringify(log))
}

export async function computeStats(): Promise<Stats> {
  const logsRaw = await redis.lrange('query_logs', 0, -1)
  const logs: QueryLog[] = logsRaw.map(l => JSON.parse(l))
  const total = logs.length
  const counts: Record<string, number> = {}
  const hourCounts = new Array(24).fill(0)
  let durationSum = 0

  for (const l of logs) {
    counts[l.q] = (counts[l.q] || 0) + 1
    const h = new Date(l.timestamp).getHours()
    hourCounts[h]++
    durationSum += l.duration
  }

  const topQueries = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([query, count]) => ({
      query,
      count,
      percentage: total ? (count / total) * 100 : 0
    }))

  const averageDuration = total ? durationSum / total : 0
  const mostPopularHour = hourCounts.reduce((acc, cur, idx) => (cur > hourCounts[acc] ? idx : acc), 0)

  const stats: Stats = { topQueries, averageDuration, mostPopularHour }
  await redis.set('stats:latest', JSON.stringify(stats))
  return stats
}

export async function getLatestStats(): Promise<Stats | null> {
  const hit = await redis.get('stats:latest')
  return hit ? (JSON.parse(hit) as Stats) : null
}

