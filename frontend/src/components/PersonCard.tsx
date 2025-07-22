import Link from 'next/link'
import type { Person } from '../types'

type Props = { person: Person }

export default function PersonCard({ person }: Props) {
  return (
    <div className="detail-card">
      <h1>{person.name}</h1>
      {person.films && person.films.length > 0 && (
        <div className="detail-section">
          <h2>Films</h2>
          <ul className="detail-list">
            {person.films.map(f => (
              <li key={f}>
                <Link href={`/movies/${f}`}>Episode {f}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
