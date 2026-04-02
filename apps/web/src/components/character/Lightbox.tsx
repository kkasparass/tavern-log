"use client";
import { useEffect } from "react";
import type { CharacterArtwork } from "@/lib/types";

type LightboxProps = {
  artworks: CharacterArtwork[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function Lightbox({ artworks, index, onClose, onNavigate }: LightboxProps) {
  const artwork = artworks[index];
  const hasPrev = index > 0;
  const hasNext = index < artworks.length - 1;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onNavigate(index - 1);
      if (e.key === "ArrowRight" && hasNext) onNavigate(index + 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, hasPrev, hasNext, onClose, onNavigate]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <div
        className="relative mx-4 flex w-full max-w-4xl flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-sm text-white/60 hover:text-white"
          aria-label="Close"
        >
          ✕ Close
        </button>

        {/* Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={artwork.imageUrl}
          alt={artwork.title ?? ""}
          className="mx-auto max-h-[75vh] w-auto rounded object-contain"
        />

        {/* Metadata */}
        {(artwork.title || artwork.caption || artwork.artistCredit) && (
          <div className="space-y-1 text-center">
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
            className="px-4 py-2 text-sm text-white/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
            aria-label="Previous"
          >
            ← Prev
          </button>
          <span className="self-center text-sm text-white/30">
            {index + 1} / {artworks.length}
          </span>
          <button
            onClick={() => onNavigate(index + 1)}
            disabled={!hasNext}
            className="px-4 py-2 text-sm text-white/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
            aria-label="Next"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
