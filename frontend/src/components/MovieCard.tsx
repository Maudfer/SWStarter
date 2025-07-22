import Link from 'next/link'
import type { Movie } from '../types'

type Props = { movie: Movie }

export default function MovieCard({ movie }: Props) {
  return (
    <div className="detail-card">
      <h1>{movie.title}</h1>
      {movie.characters && movie.characters.length > 0 && (
        <div className="detail-section">
          <h2>Characters</h2>
          <ul className="detail-list">
            {movie.characters.map(c => (
              <li key={c}>
                <Link href={`/people/${c}`}>Person {c}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
