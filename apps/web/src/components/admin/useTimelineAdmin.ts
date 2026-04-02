"use client";
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

async function updateEvent(eventId: string, data: { order?: number }) {
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
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (eventId: string) => deleteEvent(eventId),
    onSuccess: invalidate,
  });

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
    nextOrder: events?.length ?? 0,
    create: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.isError,
    remove: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    moveUp,
    moveDown,
  };
}
