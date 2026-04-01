'use client'
import { useEffect } from 'react'
import type { CharacterArtwork } from '@/lib/types'

type LightboxProps = {
  artworks: CharacterArtwork[]
  index: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export function Lightbox({ artworks, index, onClose, onNavigate }: LightboxProps) {
  const artwork = artworks[index]
  const hasPrev = index > 0
  const hasNext = index < artworks.length - 1

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && hasPrev) onNavigate(index - 1)
      if (e.key === 'ArrowRight' && hasNext) onNavigate(index + 1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [index, hasPrev, hasNext, onClose, onNavigate])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full mx-4 flex flex-col items-center gap-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/60 hover:text-white text-sm"
          aria-label="Close"
        >
          ✕ Close
        </button>

        {/* Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={artwork.imageUrl}
          alt={artwork.title ?? ''}
          className="max-h-[75vh] w-auto mx-auto object-contain rounded"
        />

        {/* Metadata */}
        {(artwork.title || artwork.caption || artwork.artistCredit) && (
          <div className="text-center space-y-1">
            {artwork.title && <p className="font-semibold text-white">{artwork.title}</p>}
            {artwork.caption && <p className="text-sm text-white/60">{artwork.caption}</p>}
            {artwork.artistCredit && (
              <p className="text-xs text-white/40">Art by {artwork.artistCredit}</p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={() => onNavigate(index - 1)}
            disabled={!hasPrev}
            className="px-4 py-2 text-sm text-white/60 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Previous"
          >
            ← Prev
          </button>
          <span className="text-white/30 text-sm self-center">
            {index + 1} / {artworks.length}
          </span>
          <button
            onClick={() => onNavigate(index + 1)}
            disabled={!hasNext}
            className="px-4 py-2 text-sm text-white/60 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Next"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
