"use client";
import type { CharacterArtwork } from "@/lib/types";

interface ArtworkListProps {
  artworks: CharacterArtwork[];
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function ArtworkList({
  artworks,
  onMoveUp,
  onMoveDown,
  onDelete,
  isDeleting,
}: ArtworkListProps) {
  if (artworks.length === 0) return <p className="text-white/40">No artworks yet.</p>;

  return (
    <ul className="space-y-2">
      {artworks.map((artwork, index) => (
        <li
          key={artwork.id}
          className="flex items-start justify-between rounded border border-white/10 bg-gray-900 px-4 py-3"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-white/50">{artwork.imageUrl}</p>
            {artwork.title && <p className="mt-0.5 font-medium text-white">{artwork.title}</p>}
            {artwork.caption && <p className="mt-0.5 text-sm text-white/50">{artwork.caption}</p>}
            {artwork.artistCredit && (
              <p className="mt-0.5 text-sm text-white/40">Art by {artwork.artistCredit}</p>
            )}
          </div>
          <div className="ml-4 flex shrink-0 items-center gap-1">
            <button
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              className="rounded px-2 py-1 text-sm text-white/40 hover:bg-white/10 hover:text-white disabled:opacity-20"
              aria-label="Move up"
            >
              ↑
            </button>
            <button
              onClick={() => onMoveDown(index)}
              disabled={index === artworks.length - 1}
              className="rounded px-2 py-1 text-sm text-white/40 hover:bg-white/10 hover:text-white disabled:opacity-20"
              aria-label="Move down"
            >
              ↓
            </button>
            <button
              onClick={() => onDelete(artwork.id)}
              disabled={isDeleting}
              className="rounded px-3 py-1 text-sm text-red-400/70 hover:bg-red-900/20 hover:text-red-400 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
