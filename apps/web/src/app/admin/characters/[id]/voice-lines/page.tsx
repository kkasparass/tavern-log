"use client";
import { useVoiceLinesAdmin } from "@/components/admin/useVoiceLinesAdmin";
import { VoiceLineForm } from "@/components/admin/VoiceLineForm";
import { VoiceLineList } from "@/components/admin/VoiceLineList";

export default function VoiceLinesPage({ params }: { params: { id: string } }) {
  const {
    voiceLines,
    isPending,
    isError,
    showCreateForm,
    editingVoiceLine,
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
  } = useVoiceLinesAdmin(params.id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Voice Lines</h1>
        {!showCreateForm && (
          <button
            onClick={openCreateForm}
            className="rounded bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
          >
            Add Voice Line
          </button>
        )}
      </div>

      {showCreateForm && (
        <VoiceLineForm
          onSubmit={(data) => create({ ...data, order: nextOrder })}
          onCancel={cancelCreate}
          isPending={isCreating}
          isError={createError}
        />
      )}

      {isPending && <p className="text-white/40">Loading…</p>}
      {isError && <p className="text-red-400">Failed to load voice lines.</p>}

      {voiceLines && (
        <VoiceLineList
          voiceLines={voiceLines}
          editingVoiceLine={editingVoiceLine}
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
