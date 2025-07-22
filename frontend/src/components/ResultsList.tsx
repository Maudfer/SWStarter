import Link from 'next/link'
import type { PersonSummary, MovieSummary } from '../types'

type Props = {
  results: (PersonSummary | MovieSummary)[]
  type: 'people' | 'movies'
  status: 'empty' | 'typing' | 'loading' | 'populated'
}

export default function ResultsList({ results, type, status }: Props) {
  let content: React.ReactNode

  if (status === 'empty') {
    content = (
      <p className="results-placeholder">
        There are zero matches.
        <br />
        Use the form to search for People or Movies.
      </p>
    )
  } else if (status === 'typing' || status === 'loading') {
    content = <p className="results-placeholder">Searching…</p>
  } else if (!results.length) {
    content = <p className="results-placeholder">No results found.</p>
  } else {
    content = (
      <ul className="results-list">
        {results.map(r => {
          const isPeople = type === 'people'
          const nameOrTitle = isPeople
            ? (r as PersonSummary).name
            : (r as MovieSummary).title
          const href = isPeople
            ? `/people/${(r as PersonSummary).uid}`
            : `/movies/${(r as MovieSummary).uid}`

          return (
            <li key={'uid' in r ? r.uid : ''} className="result-item">
              <span className="result-name">{nameOrTitle}</span>
              <Link href={href} className="details-button">
                SEE DETAILS
              </Link>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div className="card results-card">
      <div className="inner-card">
        <h2 className="card-title">Results</h2>
        <hr className="card-divider" />
        {content}
      </div>
    </div>
  )
}
