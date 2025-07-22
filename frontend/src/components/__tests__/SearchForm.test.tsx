import { render, fireEvent } from '@testing-library/react'
import SearchForm from '../SearchForm'

describe('SearchForm', () => {
  test('calls onSubmit with query and default type', () => {
    const onSubmit = jest.fn()
    const { getByRole } = render(
      <SearchForm
        status="empty"
        type="people"
        onSubmit={onSubmit}
      />
    )

    fireEvent.change(getByRole('textbox'), { target: { value: 'luke' } })
    fireEvent.click(getByRole('button', { name: /search/i }))

    expect(onSubmit).toHaveBeenCalledWith('luke', 'people')
  })

  test('submits with movie type', () => {
    const onSubmit = jest.fn()
    const { getByRole } = render(
      <SearchForm status="empty" type="movies" onSubmit={onSubmit} />
    )

    fireEvent.change(getByRole('textbox'), { target: { value: 'hope' } })
    fireEvent.click(getByRole('button', { name: /search/i }))

    expect(onSubmit).toHaveBeenCalledWith('hope', 'movies')
  })
})
