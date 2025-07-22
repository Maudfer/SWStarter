import type { PersonSummary, MovieSummary, Person, Movie } from '../types'

const PUBLIC_BASE = process.env.NEXT_PUBLIC_API_URL!
const INTERNAL_BASE = process.env.INTERNAL_API_URL || PUBLIC_BASE
const BASE = typeof window === 'undefined' ? INTERNAL_BASE : PUBLIC_BASE

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

const extractId = (url: string) => url.replace(/\/$/, '').split('/').pop()!

/* ─────  Search  ───── */
export async function search(
  q: string,
  type: 'people' | 'movies'
): Promise<(PersonSummary | MovieSummary)[]> {
  const data = await fetchJSON<{ results: (PersonSummary | MovieSummary)[] }>(
    `${BASE}/search?type=${type}&q=${encodeURIComponent(q)}`
  )
  return data.results
}

/* ─────  People  ───── */
export async function getPerson(id: string): Promise<Person | null> {
  const data = await fetchJSON(`${BASE}/people/${id}`)

  if (!data) return null
  const personPayload = data as Record<string, any>

  /* ids of every film the person appears in */
  const filmIds = Array.isArray(personPayload.films) ? personPayload.films.map(extractId) : []

  /* fetch each film title in parallel */
  const films = await Promise.all(
    filmIds.map(async fid => {
      const r = await fetchJSON<{ title: string }>(`${BASE}/movies/${fid}`)
      return { id: fid, title: r.title }
    })
  )

  return {
    name: personPayload.name,
    height: personPayload.height,
    mass: personPayload.mass,
    hair_color: personPayload.hair_color,
    skin_color: personPayload.skin_color,
    eye_color: personPayload.eye_color,
    birth_year: personPayload.birth_year,
    gender: personPayload.gender,
    homeworld: personPayload.homeworld,
    films,
    species: Array.isArray(personPayload.species) ? personPayload.species.map(extractId) : [],
    starships: Array.isArray(personPayload.starships) ? personPayload.starships.map(extractId) : [],
    vehicles: Array.isArray(personPayload.vehicles) ? personPayload.vehicles.map(extractId) : [],
  }
}

/* ─────  Movies  ───── */
export async function getMovie(id: string): Promise<Movie | null> {
  const data = await fetchJSON(`${BASE}/movies/${id}`)

  if (!data) return null
  const moviePayload = data as Record<string, any>

  // ids for linked resources
  const charIds = Array.isArray(moviePayload.characters) ? moviePayload.characters.map(extractId) : []

  // fetch every character name in parallel
  const characters = await Promise.all(
    charIds.map(async pid => {
      const r = await fetchJSON<{ name: string }>(`${BASE}/people/${pid}`)

      return { id: pid, name: r.name }
    })
  )

  return {
    title: moviePayload.title,
    episode_id: moviePayload.episode_id,
    director: moviePayload.director,
    producer: moviePayload.producer,
    release_date: moviePayload.release_date,
    opening_crawl: moviePayload.opening_crawl,
    characters: characters,
    planets: Array.isArray(moviePayload.planets) ? moviePayload.planets.map(extractId) : [],
    species: Array.isArray(moviePayload.species) ? moviePayload.species.map(extractId) : [],
    starships: Array.isArray(moviePayload.starships) ? moviePayload.starships.map(extractId) : [],
    vehicles: Array.isArray(moviePayload.vehicles) ? moviePayload.vehicles.map(extractId) : [],
  }
}
