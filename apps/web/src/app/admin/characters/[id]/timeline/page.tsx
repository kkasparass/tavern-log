"use client";
import { useState } from "react";
import { useTimelineAdmin } from "@/components/admin/useTimelineAdmin";
import { TimelineEventForm } from "@/components/admin/TimelineEventForm";
import { TimelineEventList } from "@/components/admin/TimelineEventList";

export default function TimelinePage({ params }: { params: { id: string } }) {
  const [showForm, setShowForm] = useState(false);
  const {
    events,
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
  } = useTimelineAdmin(params.id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Timeline</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
          >
            Add Event
          </button>
        )}
      </div>

      {showForm && (
        <TimelineEventForm
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
      {isError && <p className="text-red-400">Failed to load timeline.</p>}

      {events && (
        <TimelineEventList
          events={events}
          onMoveUp={moveUp}
          onMoveDown={moveDown}
          onDelete={remove}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
