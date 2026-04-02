import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CharacterTabs } from './CharacterTabs'

vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

const mockUsePathname = vi.fn()
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

const slug = 'mira-ashveil'

describe('CharacterTabs', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders all 5 tab links with correct hrefs', () => {
    mockUsePathname.mockReturnValue('/characters/mira-ashveil')
    render(<CharacterTabs slug={slug} />)

    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('href', '/characters/mira-ashveil')
    expect(screen.getByRole('link', { name: 'Stories' })).toHaveAttribute('href', '/characters/mira-ashveil/stories')
    expect(screen.getByRole('link', { name: 'Voice Lines' })).toHaveAttribute('href', '/characters/mira-ashveil/voice-lines')
    expect(screen.getByRole('link', { name: 'Gallery' })).toHaveAttribute('href', '/characters/mira-ashveil/gallery')
    expect(screen.getByRole('link', { name: 'Timeline' })).toHaveAttribute('href', '/characters/mira-ashveil/timeline')
  })

  it('marks the matching tab active based on current pathname', () => {
    mockUsePathname.mockReturnValue('/characters/mira-ashveil/stories')
    render(<CharacterTabs slug={slug} />)

    const storiesLink = screen.getByRole('link', { name: 'Stories' })
    const overviewLink = screen.getByRole('link', { name: 'Overview' })

    expect(storiesLink.className).toContain('border-b-2')
    expect(overviewLink.className).not.toContain('border-b-2')
  })

  it('marks no tab active when pathname does not match any tab', () => {
    mockUsePathname.mockReturnValue('/characters/mira-ashveil/unknown')
    render(<CharacterTabs slug={slug} />)

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(5)
    links.forEach(link => expect(link.className).not.toContain('border-b-2'))
  })
})
