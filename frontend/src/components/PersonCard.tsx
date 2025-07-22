import Link from 'next/link'
import type { Person } from '../types'

type Props = { person: Person }

/* helper to render label and value */
const Row = ({ label, value }: { label: string; value?: string }) =>
  value ? (
    <li>
      <strong>{label}: </strong>
      {value}
    </li>
  ) : null

export default function PersonCard({ person }: Props) {
  return (
    <div className="card person-card">
      <h1 className="person-name">{person.name}</h1>

      <div className="person-grid">
        {/* ───── Details column ───── */}
        <div className="person-col">
          <h2 className="section-title">Details</h2>
          <hr className="section-divider" />
          <ul className="detail-list">
            <Row label="Birth Year" value={person.birth_year} />
            <Row label="Gender" value={person.gender} />
            <Row label="Eye Color" value={person.eye_color} />
            <Row label="Hair Color" value={person.hair_color} />
            <Row label="Height" value={person.height} />
            <Row label="Mass" value={person.mass} />
          </ul>
        </div>

        {/* ───── Movies column ───── */}
        {!!person.films?.length && (
          <div className="person-col">
            <h2 className="section-title">Movies</h2>
            <hr className="section-divider" />
            <ul className="detail-list">
              {person.films.map(f => (
                <li key={f.id}>
                  <Link href={`/movies/${f.id}`}>{f.title}</Link>
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
