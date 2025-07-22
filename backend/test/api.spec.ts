const mockRequest = jest.fn(async (url: string) => {
  if (url.includes('/people/1')) {
    return { statusCode: 200, body: { json: async () => ({ result: { properties: { name: 'Luke', films: [] } } }) } }
  }
  if (url.includes('/films/1')) {
    return { statusCode: 200, body: { json: async () => ({ result: { properties: { title: 'A New Hope' } } }) } }
  }
  return { statusCode: 200, body: { json: async () => ({ result: [] }) } }
})
jest.mock('undici', () => ({ request: (url: string) => mockRequest(url) }))
jest.mock('ioredis', () => require('ioredis-mock'))
import build from '../src/index'
import supertest from 'supertest'
import { computeStats, logQuery } from '../src/stats'

let app: Awaited<ReturnType<typeof build>>

beforeAll(async () => {
  app = await build({ logger: false })
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

test('search people', async () => {
  const res = await supertest(app.server).get('/search').query({ q: 'r2' })
  expect(res.status).toBe(200)
  expect(Array.isArray(res.body.results)).toBe(true)
})

test('get person caches result', async () => {
  mockRequest.mockClear()
  const res1 = await supertest(app.server).get('/people/1')
  expect(res1.status).toBe(200)
  expect(res1.body.name).toBe('Luke')

  const res2 = await supertest(app.server).get('/people/1')
  expect(res2.status).toBe(200)
  expect(mockRequest).toHaveBeenCalledTimes(1)
})

test('get movie', async () => {
  const res = await supertest(app.server).get('/movies/1')
  expect(res.status).toBe(200)
  expect(res.body.title).toBe('A New Hope')
})

test('stats endpoint returns computed data', async () => {
  await logQuery({ q: 'luke', type: 'people', duration: 50, timestamp: Date.now() })
  await computeStats()
  const res = await supertest(app.server).get('/stats')
  expect(res.status).toBe(200)
  expect(Array.isArray(res.body.topQueries)).toBe(true)
})
