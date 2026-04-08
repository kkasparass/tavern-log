"use client";
import type { CharacterTimelineEvent } from "@/lib/types";
import { useAdminList } from "./useAdminList";

type EventCreateData = { title: string; description?: string; dateLabel?: string; order?: number };
type EventUpdateData = { title?: string; description?: string; dateLabel?: string };

export function useTimelineAdmin(characterId: string) {
  const { items, editingItem, ...rest } = useAdminList<
    CharacterTimelineEvent,
    EventCreateData,
    EventUpdateData
  >({
    characterId,
    queryKey: "admin-timeline",
    listPath: "timeline",
    itemPath: "timeline",
  });

  return {
    events: items,
    editingEvent: editingItem,
    ...rest,
  };
}
