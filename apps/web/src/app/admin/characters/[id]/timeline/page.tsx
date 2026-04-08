"use client";
import { useTimelineAdmin } from "@/components/admin/useTimelineAdmin";
import { TimelineEventForm } from "@/components/admin/TimelineEventForm";
import { TimelineEventList } from "@/components/admin/TimelineEventList";
import { AdminResourcePage } from "@/components/admin/AdminResourcePage";

export default function TimelinePage({ params }: { params: { id: string } }) {
  const admin = useTimelineAdmin(params.id);

  return (
    <AdminResourcePage
      title="Timeline"
      addLabel="Add Event"
      loadError="Failed to load timeline."
      showCreateForm={admin.showCreateForm}
      isPending={admin.isPending}
      isError={admin.isError}
      openCreateForm={admin.openCreateForm}
      createForm={
        <TimelineEventForm
          onSubmit={(data) => admin.create({ ...data, order: admin.nextOrder })}
          onCancel={admin.cancelCreate}
          isPending={admin.isCreating}
          isError={admin.createError}
        />
      }
    >
      {admin.events && (
        <TimelineEventList
          events={admin.events}
          editingEvent={admin.editingEvent}
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
