"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Character } from "@/lib/types";
import { Lightbox } from "./Lightbox";

export function GalleryGrid({ slug }: { slug: string }) {
  const { data: character } = useQuery<Character>({
    queryKey: ["character", slug],
    queryFn: () => fetch(`/api/characters/${slug}`).then((r) => r.json()),
  });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!character) return null;
  if (character.artworks.length === 0) {
    return <p className="opacity-50">No artwork yet.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {character.artworks.map((artwork, i) => (
          <button
            key={artwork.id}
            onClick={() => setSelectedIndex(i)}
            className="group aspect-square overflow-hidden rounded bg-white/5 transition-opacity hover:opacity-90"
            aria-label={artwork.title ?? `Artwork ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artwork.imageUrl}
              alt={artwork.title ?? ""}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <Lightbox
          artworks={character.artworks}
          index={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNavigate={setSelectedIndex}
        />
      )}
    </>
  );
}
