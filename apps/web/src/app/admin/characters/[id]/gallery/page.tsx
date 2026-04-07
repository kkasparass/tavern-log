"use client";
import { useGalleryAdmin } from "@/components/admin/useGalleryAdmin";
import { ArtworkForm } from "@/components/admin/ArtworkForm";
import { ArtworkList } from "@/components/admin/ArtworkList";

export default function GalleryPage({ params }: { params: { id: string } }) {
  const {
    artworks,
    isPending,
    isError,
    showCreateForm,
    editingArtwork,
    nextOrder,
    openCreateForm,
    cancelCreate,
    openEditForm,
    cancelEdit,
    create,
    isCreating,
    createError,
    edit,
    isEditing,
    editError,
    remove,
    isDeleting,
    moveUp,
    moveDown,
  } = useGalleryAdmin(params.id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Gallery</h1>
        {!showCreateForm && (
          <button
            onClick={openCreateForm}
            className="rounded bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
          >
            Add Artwork
          </button>
        )}
      </div>

      {showCreateForm && (
        <ArtworkForm
          onSubmit={(data) => create({ ...data, order: nextOrder })}
          onCancel={cancelCreate}
          isPending={isCreating}
          isError={createError}
        />
      )}

      {isPending && <p className="text-white/40">Loading…</p>}
      {isError && <p className="text-red-400">Failed to load artworks.</p>}

      {artworks && (
        <ArtworkList
          artworks={artworks}
          editingArtwork={editingArtwork}
          onEdit={openEditForm}
          onSaveEdit={edit}
          onCancelEdit={cancelEdit}
          isSavingEdit={isEditing}
          saveEditError={editError}
          onMoveUp={moveUp}
          onMoveDown={moveDown}
          onDelete={remove}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
