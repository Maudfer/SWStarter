import { request } from 'undici'
import { cached } from './cache'

const BASE = 'https://swapi.tech/api'

async function fetchJson(url: string, attempt = 0): Promise<any> {
  const res = await request(url)
  if (res.statusCode === 429 && attempt < 3) {
    const delay = Math.pow(2, attempt) * 1000
    await new Promise(r => setTimeout(r, delay))
    return fetchJson(url, attempt + 1)
  }
  const { body } = res
  return body.json()
}

export async function searchPeople(q: string) {
  return cached(`people:${q}`, async () => {
    const url = `${BASE}/people/?name=${encodeURIComponent(q)}`
    const data = await fetchJson(url)
    const results = Array.isArray(data.result) ? data.result : []
    return results.map((r: any) => ({
      uid: r.uid,
      name: r.properties?.name
    }))
  })
}

export async function searchMovies(q: string) {
  return cached(`movies:${q}`, async () => {
    const url = `${BASE}/films/?title=${encodeURIComponent(q)}`
    const data = await fetchJson(url)
    const results = Array.isArray(data.result) ? data.result : []
    return results.map((r: any) => ({
      uid: r.uid,
      title: r.properties?.title
    }))
  })
}

export async function getPerson(id: string) {
  return cached(`person:${id}`, async () => {
    const url = `${BASE}/people/${id}`
    const data = await fetchJson(url)
    const props = data.result?.properties
    if (!props) return null
    if (Array.isArray(props.films)) {
      props.films = props.films.map((f: string) => f.split('/').filter(Boolean).pop())
    }
    return props
  })
}

export async function getMovie(id: string) {
  return cached(`movie:${id}`, async () => {
    const url = `${BASE}/films/${id}`
    const data = await fetchJson(url)
    return data.result?.properties
  })
}
