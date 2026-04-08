"use client";
import type { CharacterArtwork } from "@/lib/types";
import { AdminResourceList, type EditFormProps } from "./AdminResourceList";
import { ArtworkForm } from "./ArtworkForm";

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
  return (
    <AdminResourceList
      items={artworks}
      editingItem={editingArtwork}
      emptyMessage="No artworks yet."
      renderItem={(artwork) => (
        <>
          <p className="truncate text-sm text-white/50">{artwork.imageUrl.split("/").pop()}</p>
          {artwork.title && <p className="mt-0.5 font-medium text-white">{artwork.title}</p>}
          {artwork.caption && <p className="mt-0.5 text-sm text-white/50">{artwork.caption}</p>}
          {artwork.artistCredit && (
            <p className="mt-0.5 text-sm text-white/40">Art by {artwork.artistCredit}</p>
          )}
        </>
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
  );
}
