"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CharacterTimelineEvent } from "@/lib/types";

async function fetchTimeline(id: string): Promise<CharacterTimelineEvent[]> {
  const res = await fetch(`/api/admin/characters/${id}/timeline`);
  if (!res.ok) throw new Error("Failed to fetch timeline");
  return res.json();
}

async function createEvent(
  id: string,
  data: { title: string; description?: string; dateLabel?: string; order?: number }
) {
  const res = await fetch(`/api/admin/characters/${id}/timeline`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create event");
  return res.json();
}

async function updateEvent(
  eventId: string,
  data: { title?: string; description?: string; dateLabel?: string; order?: number }
) {
  const res = await fetch(`/api/admin/timeline/${eventId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update event");
  return res.json();
}

async function deleteEvent(eventId: string) {
  const res = await fetch(`/api/admin/timeline/${eventId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete event");
}

export function useTimelineAdmin(characterId: string) {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CharacterTimelineEvent | null>(null);

  const {
    data: events,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["admin-timeline", characterId],
    queryFn: () => fetchTimeline(characterId),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-timeline", characterId] });

  const createMutation = useMutation({
    mutationFn: (data: {
      title: string;
      description?: string;
      dateLabel?: string;
      order?: number;
    }) => createEvent(characterId, data),
    onSuccess: () => {
      invalidate();
      setShowCreateForm(false);
    },
  });

  const editMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { title?: string; description?: string; dateLabel?: string };
    }) => updateEvent(id, data),
    onSuccess: () => {
      invalidate();
      setEditingEvent(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (eventId: string) => deleteEvent(eventId),
    onSuccess: invalidate,
  });

  function openCreateForm() {
    setEditingEvent(null);
    setShowCreateForm(true);
  }

  function cancelCreate() {
    setShowCreateForm(false);
  }

  function openEditForm(event: CharacterTimelineEvent) {
    setShowCreateForm(false);
    setEditingEvent(event);
  }

  function cancelEdit() {
    setEditingEvent(null);
  }

  async function moveUp(index: number) {
    if (!events || index === 0) return;
    const a = events[index];
    const b = events[index - 1];
    await updateEvent(a.id, { order: b.order });
    await updateEvent(b.id, { order: a.order });
    invalidate();
  }

  async function moveDown(index: number) {
    if (!events || index === events.length - 1) return;
    const a = events[index];
    const b = events[index + 1];
    await updateEvent(a.id, { order: b.order });
    await updateEvent(b.id, { order: a.order });
    invalidate();
  }

  return {
    events,
    isPending,
    isError,
    showCreateForm,
    editingEvent,
    nextOrder: events?.length ?? 0,
    openCreateForm,
    cancelCreate,
    openEditForm,
    cancelEdit,
    create: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.isError,
    edit: (id: string, data: { title?: string; description?: string; dateLabel?: string }) =>
      editMutation.mutate({ id, data }),
    isEditing: editMutation.isPending,
    editError: editMutation.isError,
    remove: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    moveUp,
    moveDown,
  };
}
