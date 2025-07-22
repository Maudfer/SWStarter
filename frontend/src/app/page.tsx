'use client'
import { useEffect, useState } from 'react'
import SearchForm from '../components/SearchForm'
import ResultsList from '../components/ResultsList'
import type { PersonSummary, MovieSummary } from '../types'
import { search } from '../lib/api'

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<(PersonSummary | MovieSummary)[]>([])
  const [type, setType] = useState<'people' | 'movies'>('people')
  const [status, setStatus] = useState<
    'empty' | 'typing' | 'loading' | 'populated'
  >('empty')

  const runSearch = async (q: string, t: 'people' | 'movies') => {
    setType(t)
    setStatus('loading')
    const res = await search(q, t)
    setResults(res)
    setStatus('populated')
  }

  /* debounced search after 1s of idle typing */
  useEffect(() => {
    if (query.trim() === '') {
      setStatus('empty')
      setResults([])
      return
    }

    setStatus('typing')
    const id = setTimeout(async () => {
      setStatus('loading')
      const res = await search(query, type)
      setResults(res)
      setStatus('populated')
    }, 1000)

    return () => clearTimeout(id)
  }, [query, type]) // rerun when query or search‑type changes

  const handleQueryChange = (v: string) => setQuery(v)

  return (
    <div className="search-results-grid">
      <SearchForm
        status={status}
        type={type}
        onSubmit={runSearch}
        onQueryChange={handleQueryChange}
        onTypeChange={setType}
      />
      <ResultsList results={results} type={type} status={status} />
    </div>
  )
}
