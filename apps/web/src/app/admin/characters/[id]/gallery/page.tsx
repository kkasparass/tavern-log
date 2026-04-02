"use client";
import { useState } from "react";
import { useGalleryAdmin } from "@/components/admin/useGalleryAdmin";
import { ArtworkForm } from "@/components/admin/ArtworkForm";
import { ArtworkList } from "@/components/admin/ArtworkList";

export default function GalleryPage({ params }: { params: { id: string } }) {
  const [showForm, setShowForm] = useState(false);
  const {
    artworks,
    isPending,
    isError,
    nextOrder,
    create,
    isCreating,
    createError,
    remove,
    isDeleting,
    moveUp,
    moveDown,
  } = useGalleryAdmin(params.id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Gallery</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
          >
            Add Artwork
          </button>
        )}
      </div>

      {showForm && (
        <ArtworkForm
          onSubmit={(data) => {
            create(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
          nextOrder={nextOrder}
          isPending={isCreating}
          isError={createError}
        />
      )}

      {isPending && <p className="text-white/40">Loading…</p>}
      {isError && <p className="text-red-400">Failed to load artworks.</p>}

      {artworks && (
        <ArtworkList
          artworks={artworks}
          onMoveUp={moveUp}
          onMoveDown={moveDown}
          onDelete={remove}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
