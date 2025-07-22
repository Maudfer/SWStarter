import type { PersonSummary, MovieSummary, Person, Movie } from '../types'

const PUBLIC_BASE = process.env.NEXT_PUBLIC_API_URL!
const INTERNAL_BASE = process.env.INTERNAL_API_URL || PUBLIC_BASE
const BASE = typeof window === 'undefined' ? INTERNAL_BASE : PUBLIC_BASE

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

export async function search(q: string, type: 'people' | 'movies'): Promise<(PersonSummary | MovieSummary)[]> {
  const url = `${BASE}/search?type=${type}&q=${encodeURIComponent(q)}`
  const data = await fetchJSON<{ results: (PersonSummary | MovieSummary)[] }>(url)
  return data.results
}

export async function getPerson(id: string): Promise<Person | null> {
  const url = `${BASE}/people/${id}`
  return fetchJSON<Person | null>(url)
}

export async function getMovie(id: string): Promise<Movie | null> {
  const url = `${BASE}/movies/${id}`
  return fetchJSON<Movie | null>(url)
}

