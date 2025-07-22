export interface PersonSummary {
  uid: string
  name: string
}

export interface MovieSummary {
  uid: string
  title: string
}

export interface CharacterRef {
  id: string
  name: string
}

export interface MovieSummary {
  uid: string
  title: string
}

export interface MovieRef {
  id: string
  title: string
}

export interface Person {
  name: string
  films?: MovieRef[]
  species?: string[]
  starships?: string[]
  vehicles?: string[]
}

export interface Person {
  name: string
  height?: string
  mass?: string
  hair_color?: string
  skin_color?: string
  eye_color?: string
  birth_year?: string
  gender?: string
  homeworld?: string
  films?: MovieRef[]
  species?: string[]
  starships?: string[]
  vehicles?: string[]
  [key: string]: unknown
}

export interface Movie {
  title: string
  episode_id?: number
  director?: string
  producer?: string
  release_date?: string
  opening_crawl?: string
  characters?: CharacterRef[]
  planets?: string[]
  species?: string[]
  starships?: string[]
  vehicles?: string[]
  [key: string]: unknown
}
