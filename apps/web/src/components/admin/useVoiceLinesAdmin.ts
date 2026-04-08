"use client";
import type { CharacterVoiceLine } from "@/lib/types";
import { useAdminList } from "./useAdminList";

type VoiceLineCreateData = { audioUrl: string; transcript: string; context?: string; order?: number };
type VoiceLineUpdateData = { audioUrl?: string; transcript?: string; context?: string };

export function useVoiceLinesAdmin(characterId: string) {
  const { items, editingItem, ...rest } = useAdminList<
    CharacterVoiceLine,
    VoiceLineCreateData,
    VoiceLineUpdateData
  >({
    characterId,
    queryKey: "admin-voice-lines",
    listPath: "voice-lines",
    itemPath: "voice-lines",
  });

  return {
    voiceLines: items,
    editingVoiceLine: editingItem,
    ...rest,
  };
}
