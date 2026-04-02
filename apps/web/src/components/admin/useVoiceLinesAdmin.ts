"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CharacterVoiceLine } from "@/lib/types";

async function fetchVoiceLines(id: string): Promise<CharacterVoiceLine[]> {
  const res = await fetch(`/api/admin/characters/${id}/voice-lines`);
  if (!res.ok) throw new Error("Failed to fetch voice lines");
  return res.json();
}

async function createVoiceLine(
  id: string,
  data: { audioUrl: string; transcript: string; context?: string; order?: number }
) {
  const res = await fetch(`/api/admin/characters/${id}/voice-lines`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create voice line");
  return res.json();
}

async function updateVoiceLine(voiceLineId: string, data: { order?: number }) {
  const res = await fetch(`/api/admin/voice-lines/${voiceLineId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update voice line");
  return res.json();
}

async function deleteVoiceLine(voiceLineId: string) {
  const res = await fetch(`/api/admin/voice-lines/${voiceLineId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete voice line");
}

export function useVoiceLinesAdmin(characterId: string) {
  const queryClient = useQueryClient();

  const {
    data: voiceLines,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["admin-voice-lines", characterId],
    queryFn: () => fetchVoiceLines(characterId),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-voice-lines", characterId] });

  const createMutation = useMutation({
    mutationFn: (data: {
      audioUrl: string;
      transcript: string;
      context?: string;
      order?: number;
    }) => createVoiceLine(characterId, data),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (voiceLineId: string) => deleteVoiceLine(voiceLineId),
    onSuccess: invalidate,
  });

  async function moveUp(index: number) {
    if (!voiceLines || index === 0) return;
    const a = voiceLines[index];
    const b = voiceLines[index - 1];
    await updateVoiceLine(a.id, { order: b.order });
    await updateVoiceLine(b.id, { order: a.order });
    invalidate();
  }

  async function moveDown(index: number) {
    if (!voiceLines || index === voiceLines.length - 1) return;
    const a = voiceLines[index];
    const b = voiceLines[index + 1];
    await updateVoiceLine(a.id, { order: b.order });
    await updateVoiceLine(b.id, { order: a.order });
    invalidate();
  }

  return {
    voiceLines,
    isPending,
    isError,
    nextOrder: voiceLines?.length ?? 0,
    create: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.isError,
    remove: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    moveUp,
    moveDown,
  };
}
