"use client";
import { useGalleryAdmin } from "@/components/admin/useGalleryAdmin";
import { ArtworkForm } from "@/components/admin/ArtworkForm";
import { ArtworkList } from "@/components/admin/ArtworkList";
import { AdminResourcePage } from "@/components/admin/AdminResourcePage";

export default function GalleryPage({ params }: { params: { id: string } }) {
  const admin = useGalleryAdmin(params.id);

  return (
    <AdminResourcePage
      title="Gallery"
      addLabel="Add Artwork"
      loadError="Failed to load artworks."
      showCreateForm={admin.showCreateForm}
      isPending={admin.isPending}
      isError={admin.isError}
      openCreateForm={admin.openCreateForm}
      createForm={
        <ArtworkForm
          onSubmit={(data) => admin.create({ ...data, order: admin.nextOrder })}
          onCancel={admin.cancelCreate}
          isPending={admin.isCreating}
          isError={admin.createError}
        />
      }
    >
      {admin.artworks && (
        <ArtworkList
          artworks={admin.artworks}
          editingArtwork={admin.editingArtwork}
          onEdit={admin.openEditForm}
          onSaveEdit={admin.edit}
          onCancelEdit={admin.cancelEdit}
          isSavingEdit={admin.isEditing}
          saveEditError={admin.editError}
          onMoveUp={admin.moveUp}
          onMoveDown={admin.moveDown}
          onDelete={admin.remove}
          isDeleting={admin.isDeleting}
        />
      )}
    </AdminResourcePage>
  );
}
