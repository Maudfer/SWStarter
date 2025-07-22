'use client'
import { useState } from 'react'

type Props = {
  onSubmit: (q: string, type: 'people' | 'movies') => void
  onQueryChange?: (v: string) => void
}

export default function SearchForm({ onSubmit, onQueryChange }: Props) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<'people' | 'movies'>('people')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    onSubmit(query.trim(), type)
  }

  const isDisabled = query.trim() === ''

  return (
    <div className="card search-card">
      <h2 className="card-title">What are you searching for?</h2>

      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-type">
          <label className="search-option">
            <input
              type="radio"
              name="type"
              value="people"
              checked={type === 'people'}
              onChange={() => setType('people')}
            />
            People
          </label>
          <label className="search-option">
            <input
              type="radio"
              name="type"
              value="movies"
              checked={type === 'movies'}
              onChange={() => setType('movies')}
            />
            Movies
          </label>
        </div>

        <input
          className="query-input"
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            onQueryChange?.(e.target.value)
          }}
          placeholder="e.g. Chewbacca, Yoda, Boba Fett"
        />

        <button
          type="submit"
          className="search-button"
          disabled={isDisabled}
        >
          SEARCH
        </button>
      </form>
    </div>
  )
}
