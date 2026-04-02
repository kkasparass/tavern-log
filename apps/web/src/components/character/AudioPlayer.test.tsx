import { screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render } from '@testing-library/react'
import { AudioPlayer } from './AudioPlayer'

// jsdom does not implement HTMLMediaElement.play/pause
beforeAll(() => {
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
  window.HTMLMediaElement.prototype.pause = vi.fn()
})

describe('AudioPlayer', () => {
  it('renders a play button initially', () => {
    render(<AudioPlayer audioUrl="https://example.com/audio.mp3" />)
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
  })

  it('toggles to pause button when clicked', () => {
    render(<AudioPlayer audioUrl="https://example.com/audio.mp3" />)
    fireEvent.click(screen.getByRole('button', { name: 'Play' }))
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument()
  })

  it('toggles back to play button when clicked again', () => {
    render(<AudioPlayer audioUrl="https://example.com/audio.mp3" />)
    fireEvent.click(screen.getByRole('button', { name: 'Play' }))
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }))
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
  })
})
