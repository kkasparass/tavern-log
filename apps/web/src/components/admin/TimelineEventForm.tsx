"use client";
import { useState } from "react";
import { AdminFormWrapper } from "./AdminFormWrapper";

interface TimelineEventFormProps {
  initialValues?: { title?: string | null; description?: string | null; dateLabel?: string | null };
  onSubmit: (data: { title: string; description?: string; dateLabel?: string }) => void;
  onCancel: () => void;
  isPending: boolean;
  isError: boolean;
  inline?: boolean;
}

export function TimelineEventForm({
  initialValues,
  onSubmit,
  onCancel,
  isPending,
  isError,
  inline = false,
}: TimelineEventFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [dateLabel, setDateLabel] = useState(initialValues?.dateLabel ?? "");

  const isEditing = !!initialValues;

  function handleSubmit() {
    if (!title.trim()) return;
    onSubmit({
      title,
      description: description || undefined,
      dateLabel: dateLabel || undefined,
    });
  }

  return (
    <AdminFormWrapper
      inline={inline}
      isEditing={isEditing}
      itemName="Event"
      isPending={isPending}
      isError={isError}
      isSubmitDisabled={!title.trim()}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    >
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
    </AdminFormWrapper>
  );
}
