import { request } from 'undici'
import { cached } from './cache'

const BASE = 'https://swapi.tech/api'

function normalizePeopleUrl(url: string) {
  return url.replace(/^https:\/\/(www\.)?swapi\.tech\/api\/people\//, '')
}

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

    // TODO: 
    // swapi.tech no longer returns the `films` array under /people/:id,
    // even though its documentation says it does, and it used to (I checked it with https://web.archive.org/).
    // I couldn't find out if this is a recent bug or design change in the API.
    // As a temporary workaround, we hydrate the films list manually by:
    // - Fetching all films
    // - Checking which ones list this person in their `characters` array

    const normalize = (url: string) =>
      url.replace(/^https:\/\/(www\.)?swapi\.tech\/api\/people\//, '')

    const filmsData = await fetchJson(`${BASE}/films`)
    const allFilms = Array.isArray(filmsData.result) ? filmsData.result : []

    const filmUrls: string[] = allFilms
      .filter((film: any) =>
        film.properties?.characters?.some((url: string) => normalize(url) === id)
      )
      .map((film: any) => film.properties.url)

    props.films = filmUrls
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
