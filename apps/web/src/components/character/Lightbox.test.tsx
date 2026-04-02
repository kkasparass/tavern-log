import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Lightbox } from './Lightbox'
import { mockCharacter } from '@/test/fixtures'

const artworks = mockCharacter.artworks
const onClose = vi.fn()
const onNavigate = vi.fn()

function renderLightbox(index = 0) {
  return render(
    <Lightbox
      artworks={artworks}
      index={index}
      onClose={onClose}
      onNavigate={onNavigate}
    />,
  )
}

beforeEach(() => {
  onClose.mockClear()
  onNavigate.mockClear()
})

describe('Lightbox', () => {
  it('renders the image and metadata for the current artwork', () => {
    renderLightbox(0)
    expect(screen.getByRole('img', { name: 'Mira in the Ashwood' })).toBeInTheDocument()
    expect(screen.getByText('Mira in the Ashwood')).toBeInTheDocument()
    expect(screen.getByText('Portrait commission for The Shattered Crown campaign.')).toBeInTheDocument()
    expect(screen.getByText('Art by Placeholder Artist')).toBeInTheDocument()
  })

  it('omits metadata block when all fields are null', () => {
    const noMeta = [{ ...artworks[0], title: null, caption: null, artistCredit: null }]
    render(
      <Lightbox artworks={noMeta} index={0} onClose={onClose} onNavigate={onNavigate} />,
    )
    expect(screen.queryByText(/Art by/)).not.toBeInTheDocument()
  })

  it('close button calls onClose', () => {
    renderLightbox()
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('clicking the backdrop calls onClose', () => {
    const { container } = renderLightbox()
    fireEvent.click(container.firstChild as Element)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('clicking inside the content area does not call onClose', () => {
    renderLightbox()
    fireEvent.click(screen.getByRole('img', { name: 'Mira in the Ashwood' }))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('Escape key calls onClose', () => {
    renderLightbox()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('ArrowLeft calls onNavigate with index - 1', () => {
    renderLightbox(1)
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(onNavigate).toHaveBeenCalledWith(0)
  })

  it('ArrowRight calls onNavigate with index + 1', () => {
    renderLightbox(0)
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(onNavigate).toHaveBeenCalledWith(1)
  })

  it('ArrowLeft does nothing at the first item', () => {
    renderLightbox(0)
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(onNavigate).not.toHaveBeenCalled()
  })

  it('ArrowRight does nothing at the last item', () => {
    renderLightbox(artworks.length - 1)
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(onNavigate).not.toHaveBeenCalled()
  })

  it('Prev button is disabled at index 0', () => {
    renderLightbox(0)
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()
  })

  it('Next button is disabled at the last index', () => {
    renderLightbox(artworks.length - 1)
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
  })

  it('Prev and Next buttons are enabled in the middle', () => {
    const three = [...artworks, { ...artworks[1], id: 'cuid-art-3', order: 2 }]
    render(
      <Lightbox artworks={three} index={1} onClose={onClose} onNavigate={onNavigate} />,
    )
    expect(screen.getByRole('button', { name: 'Previous' })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled()
  })

  it('counter shows current position out of total', () => {
    renderLightbox(1)
    expect(screen.getByText(`2 / ${artworks.length}`)).toBeInTheDocument()
  })
})
