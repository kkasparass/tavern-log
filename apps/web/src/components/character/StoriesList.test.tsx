import { screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { StoriesList } from './StoriesList'
import { renderWithQuery } from '@/test/utils'
import { mockCharacter } from '@/test/fixtures'

vi.mock('next/link')

const slug = 'mira-ashveil'

describe('StoriesList', () => {
  it('renders story titles and links to correct URLs', () => {
    renderWithQuery(<StoriesList slug={slug} />, [[['character', slug], mockCharacter]])
    const link = screen.getByRole('link', { name: /The Last Spell/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/characters/mira-ashveil/stories/the-last-spell')
  })

  it('shows empty state when character has no stories', () => {
    const data = { ...mockCharacter, stories: [] }
    renderWithQuery(<StoriesList slug={slug} />, [[['character', slug], data]])
    expect(screen.getByText('No stories yet.')).toBeInTheDocument()
  })

  it('renders nothing when data is not in cache', () => {
    const { container } = renderWithQuery(<StoriesList slug={slug} />, [])
    expect(container).toBeEmptyDOMElement()
  })
})
