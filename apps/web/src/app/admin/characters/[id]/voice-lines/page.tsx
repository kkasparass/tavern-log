"use client";
import { useVoiceLinesAdmin } from "@/components/admin/useVoiceLinesAdmin";
import { VoiceLineForm } from "@/components/admin/VoiceLineForm";
import { VoiceLineList } from "@/components/admin/VoiceLineList";
import { AdminResourcePage } from "@/components/admin/AdminResourcePage";

export default function VoiceLinesPage({ params }: { params: { id: string } }) {
  const admin = useVoiceLinesAdmin(params.id);

  return (
    <AdminResourcePage
      title="Voice Lines"
      addLabel="Add Voice Line"
      loadError="Failed to load voice lines."
      showCreateForm={admin.showCreateForm}
      isPending={admin.isPending}
      isError={admin.isError}
      openCreateForm={admin.openCreateForm}
      createForm={
        <VoiceLineForm
          onSubmit={(data) => admin.create({ ...data, order: admin.nextOrder })}
          onCancel={admin.cancelCreate}
          isPending={admin.isCreating}
          isError={admin.createError}
        />
      }
    >
      {admin.voiceLines && (
        <VoiceLineList
          voiceLines={admin.voiceLines}
          editingVoiceLine={admin.editingVoiceLine}
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
