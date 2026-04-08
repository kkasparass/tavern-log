"use client";
import type { CharacterTimelineEvent } from "@/lib/types";
import { AdminResourceList, type EditFormProps } from "./AdminResourceList";
import { TimelineEventForm } from "./TimelineEventForm";

interface TimelineEventListProps {
  events: CharacterTimelineEvent[];
  editingEvent: CharacterTimelineEvent | null;
  onEdit: (event: CharacterTimelineEvent) => void;
  onSaveEdit: (id: string, data: { title?: string; description?: string; dateLabel?: string }) => void;
  onCancelEdit: () => void;
  isSavingEdit: boolean;
  saveEditError: boolean;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function TimelineEventList({
  events,
  editingEvent,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  isSavingEdit,
  saveEditError,
  onMoveUp,
  onMoveDown,
  onDelete,
  isDeleting,
}: TimelineEventListProps) {
  return (
    <AdminResourceList
      items={events}
      editingItem={editingEvent}
      emptyMessage="No events yet."
      renderItem={(event) => (
        <>
          {event.dateLabel && <p className="text-sm text-white/40">{event.dateLabel}</p>}
          <p className="font-medium text-white">{event.title}</p>
          {event.description && (
            <p className="mt-0.5 text-sm text-white/60">{event.description}</p>
          )}
        </>
      )}
      renderEditForm={(event, p: EditFormProps<{ title?: string; description?: string; dateLabel?: string }>) => (
        <TimelineEventForm
          inline
          initialValues={event}
          onSubmit={(data) => p.onSaveEdit(event.id, data)}
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
