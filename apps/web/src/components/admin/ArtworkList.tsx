"use client";
import { useState } from "react";
import type { CharacterArtwork } from "@/lib/types";
import { AdminResourceList, type EditFormProps } from "./AdminResourceList";
import { ArtworkForm } from "./ArtworkForm";
import { Lightbox } from "@/components/ui/Lightbox";

interface ArtworkListProps {
  artworks: CharacterArtwork[];
  editingArtwork: CharacterArtwork | null;
  onEdit: (artwork: CharacterArtwork) => void;
  onSaveEdit: (id: string, data: { imageUrl?: string; title?: string; caption?: string; artistCredit?: string }) => void;
  onCancelEdit: () => void;
  isSavingEdit: boolean;
  saveEditError: boolean;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function ArtworkList({
  artworks,
  editingArtwork,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  isSavingEdit,
  saveEditError,
  onMoveUp,
  onMoveDown,
  onDelete,
  isDeleting,
}: ArtworkListProps) {
  const [expandedUrl, setExpandedUrl] = useState<string | null>(null);

  return (
    <>
      <AdminResourceList
        items={artworks}
        editingItem={editingArtwork}
        emptyMessage="No artworks yet."
        renderItem={(artwork) => (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
            <button
              type="button"
              onClick={() => setExpandedUrl(artwork.imageUrl)}
              className="shrink-0 cursor-zoom-in"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={artwork.imageUrl}
                alt={artwork.title ?? ""}
                className="h-40 w-full rounded object-cover sm:h-14 sm:w-14"
              />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm text-white/50">{artwork.imageUrl.split("/").pop()}</p>
              {artwork.title && <p className="mt-0.5 font-medium text-white">{artwork.title}</p>}
              {artwork.caption && <p className="mt-0.5 text-sm text-white/50">{artwork.caption}</p>}
              {artwork.artistCredit && (
                <p className="mt-0.5 text-sm text-white/40">Art by {artwork.artistCredit}</p>
              )}
            </div>
          </div>
        )}
        renderEditForm={(artwork, p: EditFormProps<{ imageUrl?: string; title?: string; caption?: string; artistCredit?: string }>) => (
          <ArtworkForm
            inline
            initialValues={artwork}
            onSubmit={(data) => p.onSaveEdit(artwork.id, data)}
            onCancel={p.onCancelEdit}
            isPending={p.isSavingEdit}
            isError={p.saveEditError}
          />
        )}
        onEdit={onEdit}
        onSaveEdit={onSaveEdit}
        onCancelEdit={onCancelEdit}
        isSavingEdit={isSavingEdit}
        saveEditError={saveEditError}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDelete={onDelete}
        isDeleting={isDeleting}
      />
      {expandedUrl && (
        <Lightbox
          src={expandedUrl}
          onClose={() => setExpandedUrl(null)}
          altText={artworks.find((a) => a.imageUrl === expandedUrl)?.title ?? ""}
        />
      )}
    </>
  );
}
