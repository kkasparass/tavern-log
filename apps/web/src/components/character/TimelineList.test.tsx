import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TimelineList } from './TimelineList'
import { renderWithQuery } from '@/test/utils'
import { mockCharacter } from '@/test/fixtures'

const slug = 'mira-ashveil'

describe('TimelineList', () => {
  it('renders timeline event titles, dates and descriptions', () => {
    renderWithQuery(<TimelineList slug={slug} />, [[['character', slug], mockCharacter]])
    expect(screen.getByText('Appointed Court Mage of Valdenmoor')).toBeInTheDocument()
    expect(screen.getByText('Year 412 of the Compact')).toBeInTheDocument()
    expect(screen.getByText('The Siege of Valdenmoor')).toBeInTheDocument()
    expect(screen.getByText('Retired to the Ashwood')).toBeInTheDocument()
  })

  it('shows empty state when character has no timeline events', () => {
    const data = { ...mockCharacter, timeline: [] }
    renderWithQuery(<TimelineList slug={slug} />, [[['character', slug], data]])
    expect(screen.getByText('No timeline events yet.')).toBeInTheDocument()
  })

  it('renders nothing when data is not in cache', () => {
    const { container } = renderWithQuery(<TimelineList slug={slug} />, [])
    expect(container).toBeEmptyDOMElement()
  })
})
