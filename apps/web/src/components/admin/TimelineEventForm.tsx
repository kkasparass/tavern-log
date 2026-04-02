"use client";
import { useState } from "react";

interface TimelineEventFormProps {
  onSubmit: (data: {
    title: string;
    description?: string;
    dateLabel?: string;
    order: number;
  }) => void;
  onCancel: () => void;
  nextOrder: number;
  isPending: boolean;
  isError: boolean;
}

export function TimelineEventForm({
  onSubmit,
  onCancel,
  nextOrder,
  isPending,
  isError,
}: TimelineEventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateLabel, setDateLabel] = useState("");

  function handleSubmit() {
    if (!title.trim()) return;
    onSubmit({
      title,
      description: description || undefined,
      dateLabel: dateLabel || undefined,
      order: nextOrder,
    });
  }

  return (
    <div className="mb-6 rounded border border-white/10 bg-gray-900 p-4">
      <h2 className="mb-4 text-sm font-semibold text-white/70">New Event</h2>
      <div className="mb-3">
        <label className="mb-1 block text-sm text-white/70">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border border-white/10 bg-gray-800 px-3 py-2 text-white"
          placeholder="Event title"
        />
      </div>
      <div className="mb-3">
        <label className="mb-1 block text-sm text-white/70">Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded border border-white/10 bg-gray-800 px-3 py-2 text-white"
          placeholder="What happened?"
        />
      </div>
      <div className="mb-4">
        <label className="mb-1 block text-sm text-white/70">Date Label (optional)</label>
        <input
          type="text"
          value={dateLabel}
          onChange={(e) => setDateLabel(e.target.value)}
          className="w-full rounded border border-white/10 bg-gray-800 px-3 py-2 text-white"
          placeholder="e.g. Year 412, Session 3, Spring"
        />
      </div>
      {isError && <p className="mb-3 text-sm text-red-400">Failed to create event.</p>}
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={isPending || !title.trim()}
          className="rounded bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
        <button
          onClick={onCancel}
          className="rounded px-4 py-2 text-sm text-white/50 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
