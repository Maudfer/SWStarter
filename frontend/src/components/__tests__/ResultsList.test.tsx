import { render } from '@testing-library/react'
import ResultsList from '../ResultsList'
import type { PersonSummary } from '../../types'

describe('ResultsList', () => {
  test('shows loading text', () => {
    const { getByText } = render(
      <ResultsList results={[]} type="people" status="loading" />
    )
    // Matches both “Loading…” and “Loading...”
    expect(getByText(/Loading/i)).toBeInTheDocument()
  })

  test('renders results list', () => {
    const data: PersonSummary[] = [{ uid: '1', name: 'Luke' }]
    const { getByText } = render(
      <ResultsList results={data} type="people" status="populated" />
    )
    expect(getByText('Luke')).toBeInTheDocument()
  })
})
