"use client";
import type { CharacterArtwork } from "@/lib/types";
import { useAdminList } from "./useAdminList";

type ArtworkCreateData = { imageUrl: string; title?: string; caption?: string; artistCredit?: string; order?: number };
type ArtworkUpdateData = { imageUrl?: string; title?: string; caption?: string; artistCredit?: string };

export function useGalleryAdmin(characterId: string) {
  const { items, editingItem, ...rest } = useAdminList<
    CharacterArtwork,
    ArtworkCreateData,
    ArtworkUpdateData
  >({
    characterId,
    queryKey: "admin-artworks",
    listPath: "artworks",
    itemPath: "artworks",
  });

  return {
    artworks: items,
    editingArtwork: editingItem,
    ...rest,
  };
}
