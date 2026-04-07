"use client";
import { useTimelineAdmin } from "@/components/admin/useTimelineAdmin";
import { TimelineEventForm } from "@/components/admin/TimelineEventForm";
import { TimelineEventList } from "@/components/admin/TimelineEventList";

export default function TimelinePage({ params }: { params: { id: string } }) {
  const {
    events,
    isPending,
    isError,
    showCreateForm,
    editingEvent,
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
  } = useTimelineAdmin(params.id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Timeline</h1>
        {!showCreateForm && (
          <button
            onClick={openCreateForm}
            className="rounded bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
          >
            Add Event
          </button>
        )}
      </div>

      {showCreateForm && (
        <TimelineEventForm
          onSubmit={(data) => create({ ...data, order: nextOrder })}
          onCancel={cancelCreate}
          isPending={isCreating}
          isError={createError}
        />
      )}

      {isPending && <p className="text-white/40">Loading…</p>}
      {isError && <p className="text-red-400">Failed to load timeline.</p>}

      {events && (
        <TimelineEventList
          events={events}
          editingEvent={editingEvent}
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
