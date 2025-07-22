import Link from 'next/link'
import type { Movie } from '../types'

type Props = { movie: Movie }

export default function MovieCard({ movie }: Props) {
  /* split crawl into paragraphs */
  const paragraphs = movie.opening_crawl
    ? movie.opening_crawl.split(/\n\n+/)
    : []

  return (
    <div className="card movie-card">
      <h1 className="movie-title">{movie.title}</h1>

      <div className="movie-grid">
        {/* ───── Opening Crawl ───── */}
        {paragraphs.length > 0 && (
          <div className="movie-col">
            <h2 className="section-title">Opening Crawl</h2>
            <hr className="section-divider" />
            {paragraphs.map((p, idx) => (
              <p key={idx} className="crawl-paragraph">
                {p}
              </p>
            ))}
          </div>
        )}

        {/* ───── Characters ───── */}
        {!!movie.characters?.length && (
          <div className="movie-col">
            <h2 className="section-title">Characters</h2>
            <hr className="section-divider" />
            <ul className="detail-list">
              {movie.characters.map(c => (
                <li key={c.id}>
                  <Link href={`/people/${c.id}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Link href="/" className="back-button">
        BACK TO SEARCH
      </Link>
    </div>
  )
}
