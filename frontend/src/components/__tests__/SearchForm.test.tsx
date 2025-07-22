import { render, fireEvent } from '@testing-library/react'
import SearchForm from '../SearchForm'

describe('SearchForm', () => {
  test('calls onSubmit with query and default type', () => {
    const onSubmit = jest.fn()
    const { getByRole } = render(<SearchForm onSubmit={onSubmit} />)

    const input = getByRole('textbox')                       //  ✅ agnostic to placeholder text
    const button = getByRole('button', { name: /search/i })   //  ✅ matches “SEARCH” or “Search”

    fireEvent.change(input, { target: { value: 'luke' } })
    fireEvent.click(button)

    expect(onSubmit).toHaveBeenCalledWith('luke', 'people')
  })

  test('allows selecting movie type', () => {
    const onSubmit = jest.fn()
    const { getByLabelText, getByRole } = render(<SearchForm onSubmit={onSubmit} />)

    fireEvent.click(getByLabelText('Movies'))
    fireEvent.change(getByRole('textbox'), { target: { value: 'hope' } })
    fireEvent.click(getByRole('button', { name: /search/i }))

    expect(onSubmit).toHaveBeenCalledWith('hope', 'movies')
  })
})
