"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CharacterArtwork } from "@/lib/types";

async function fetchArtworks(id: string): Promise<CharacterArtwork[]> {
  const res = await fetch(`/api/admin/characters/${id}/artworks`);
  if (!res.ok) throw new Error("Failed to fetch artworks");
  return res.json();
}

async function createArtwork(
  id: string,
  data: {
    imageUrl: string;
    title?: string;
    caption?: string;
    artistCredit?: string;
    order?: number;
  }
) {
  const res = await fetch(`/api/admin/characters/${id}/artworks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create artwork");
  return res.json();
}

async function updateArtwork(
  artworkId: string,
  data: { imageUrl?: string; title?: string; caption?: string; artistCredit?: string; order?: number }
) {
  const res = await fetch(`/api/admin/artworks/${artworkId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update artwork");
  return res.json();
}

async function deleteArtwork(artworkId: string) {
  const res = await fetch(`/api/admin/artworks/${artworkId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete artwork");
}

export function useGalleryAdmin(characterId: string) {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<CharacterArtwork | null>(null);

  const {
    data: artworks,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["admin-artworks", characterId],
    queryFn: () => fetchArtworks(characterId),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-artworks", characterId] });

  const createMutation = useMutation({
    mutationFn: (data: {
      imageUrl: string;
      title?: string;
      caption?: string;
      artistCredit?: string;
      order?: number;
    }) => createArtwork(characterId, data),
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
      data: { imageUrl?: string; title?: string; caption?: string; artistCredit?: string };
    }) => updateArtwork(id, data),
    onSuccess: () => {
      invalidate();
      setEditingArtwork(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (artworkId: string) => deleteArtwork(artworkId),
    onSuccess: invalidate,
  });

  function openCreateForm() {
    setEditingArtwork(null);
    setShowCreateForm(true);
  }

  function cancelCreate() {
    setShowCreateForm(false);
  }

  function openEditForm(artwork: CharacterArtwork) {
    setShowCreateForm(false);
    setEditingArtwork(artwork);
  }

  function cancelEdit() {
    setEditingArtwork(null);
  }

  async function moveUp(index: number) {
    if (!artworks || index === 0) return;
    const a = artworks[index];
    const b = artworks[index - 1];
    await updateArtwork(a.id, { order: b.order });
    await updateArtwork(b.id, { order: a.order });
    invalidate();
  }

  async function moveDown(index: number) {
    if (!artworks || index === artworks.length - 1) return;
    const a = artworks[index];
    const b = artworks[index + 1];
    await updateArtwork(a.id, { order: b.order });
    await updateArtwork(b.id, { order: a.order });
    invalidate();
  }

  return {
    artworks,
    isPending,
    isError,
    showCreateForm,
    editingArtwork,
    nextOrder: artworks?.length ?? 0,
    openCreateForm,
    cancelCreate,
    openEditForm,
    cancelEdit,
    create: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.isError,
    edit: (id: string, data: { imageUrl?: string; title?: string; caption?: string; artistCredit?: string }) =>
      editMutation.mutate({ id, data }),
    isEditing: editMutation.isPending,
    editError: editMutation.isError,
    remove: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    moveUp,
    moveDown,
  };
}
