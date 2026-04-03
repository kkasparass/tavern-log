"use client";
import type { CharacterTimelineEvent } from "@/lib/types";

interface TimelineEventListProps {
  events: CharacterTimelineEvent[];
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function TimelineEventList({
  events,
  onMoveUp,
  onMoveDown,
  onDelete,
  isDeleting,
}: TimelineEventListProps) {
  if (events.length === 0) return <p className="text-white/40">No events yet.</p>;

  return (
    <ul className="space-y-2">
      {events.map((event, index) => (
        <li
          key={event.id}
          className="flex flex-col rounded border border-white/10 bg-gray-900 px-4 py-3 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="min-w-0 flex-1">
            {event.dateLabel && <p className="text-sm text-white/40">{event.dateLabel}</p>}
            <p className="font-medium text-white">{event.title}</p>
            {event.description && (
              <p className="mt-0.5 text-sm text-white/60">{event.description}</p>
            )}
          </div>
          <div className="mt-2 flex shrink-0 items-center gap-1 sm:ml-4 sm:mt-0">
            <button
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              className="rounded bg-white/5 px-2 py-1 text-sm text-white/40 hover:bg-white/10 hover:text-white disabled:opacity-20"
              aria-label="Move up"
            >
              ↑
            </button>
            <button
              onClick={() => onMoveDown(index)}
              disabled={index === events.length - 1}
              className="rounded bg-white/5 px-2 py-1 text-sm text-white/40 hover:bg-white/10 hover:text-white disabled:opacity-20"
              aria-label="Move down"
            >
              ↓
            </button>
            <button
              onClick={() => onDelete(event.id)}
              disabled={isDeleting}
              className="rounded px-3 py-1 text-sm text-red-400/70 hover:bg-red-900/20 hover:text-red-400 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
