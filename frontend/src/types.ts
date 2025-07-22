export interface PersonSummary {
  uid: string;
  name: string;
}

export interface MovieSummary {
  uid: string;
  title: string;
}

export interface Person {
  name: string;
  height?: string;
  mass?: string;
  hair_color?: string;
  skin_color?: string;
  eye_color?: string;
  birth_year?: string;
  gender?: string;
  homeworld?: string;
  films?: string[];
  [key: string]: unknown;
}

export interface Movie {
  title: string;
  director?: string;
  producer?: string;
  release_date?: string;
  opening_crawl?: string;
  characters?: string[];
  [key: string]: unknown;
}
