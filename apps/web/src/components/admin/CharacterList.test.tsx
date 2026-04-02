import { screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithQuery } from '@/test/utils'
import { mockCharacterListItem, naraCharacterListItem } from '@/test/fixtures'
import { CharacterList } from './CharacterList'

vi.mock('next/link')
vi.mock('next/image')

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

describe('CharacterList', () => {
  it('renders a card for each character', () => {
    renderWithQuery(<CharacterList />, [
      [['admin-characters'], [mockCharacterListItem, naraCharacterListItem]],
    ])
    expect(screen.getByText('Mira Ashveil')).toBeInTheDocument()
    expect(screen.getByText('Nara Solis')).toBeInTheDocument()
  })

  it('renders an Edit link per character pointing to the edit page', () => {
    renderWithQuery(<CharacterList />, [
      [['admin-characters'], [mockCharacterListItem, naraCharacterListItem]],
    ])
    const editLinks = screen.getAllByRole('link', { name: 'Edit' })
    expect(editLinks).toHaveLength(2)
    expect(editLinks[0]).toHaveAttribute('href', `/admin/characters/${mockCharacterListItem.id}/edit`)
    expect(editLinks[1]).toHaveAttribute('href', `/admin/characters/${naraCharacterListItem.id}/edit`)
  })

  it('renders an empty state with a create link when there are no characters', () => {
    renderWithQuery(<CharacterList />, [
      [['admin-characters'], []],
    ])
    expect(screen.getByText(/no characters yet/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /create your first one/i })).toHaveAttribute('href', '/admin/characters/new')
  })

  it('shows an error message when the fetch fails', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('', { status: 500 }))
    renderWithQuery(<CharacterList />, [])
    await waitFor(() =>
      expect(screen.getByText('Failed to load characters.')).toBeInTheDocument()
    )
  })
})
