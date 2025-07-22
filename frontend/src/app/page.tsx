'use client'
import { useState } from 'react'
import SearchForm from '../components/SearchForm'
import ResultsList from '../components/ResultsList'
import type { PersonSummary, MovieSummary } from '../types'
import { search } from '../lib/api'

export default function Home() {
  const [results, setResults] = useState<(PersonSummary | MovieSummary)[]>([])
  const [type, setType] = useState<'people' | 'movies'>('people')
  const [status, setStatus] = useState<'empty' | 'typing' | 'loading' | 'populated'>('empty')

  const handleSearch = async (q: string, t: 'people' | 'movies') => {
    setType(t)
    setStatus('loading')
    const res = await search(q, t)
    setResults(res)
    setStatus('populated')
  }

  const handleQueryChange = (v: string) => setStatus(v ? 'typing' : 'empty')

  return (
    <div className="search-results-grid">
      <SearchForm onSubmit={handleSearch} onQueryChange={handleQueryChange} />
      <ResultsList results={results} type={type} status={status} />
    </div>
  )
}
