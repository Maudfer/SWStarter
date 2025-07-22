import { LRUCache } from 'lru-cache'
import Redis from 'ioredis'

const lru = new LRUCache<string, any>({ max: 500, ttl: 1000 * 60 * 30 })

let redis: Redis | null = null
if (process.env.USE_REDIS === 'true') {
  redis = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: Number(process.env.REDIS_PORT || 6379)
  })
}

export const cached = async <T>(key: string, fn: () => Promise<T>): Promise<T> => {
  if (redis) {
    const hit = await redis.get(key)
    if (hit) return JSON.parse(hit) as T
    const fresh = await fn()
    await redis.set(key, JSON.stringify(fresh), 'EX', 60 * 30)
    return fresh
  }

  const hit = lru.get(key)
  if (hit) return hit as T
  const fresh = await fn()
  lru.set(key, fresh)
  return fresh
}
