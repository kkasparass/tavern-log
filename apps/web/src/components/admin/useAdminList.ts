"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAdminList<
  TItem extends { id: string; order: number },
  TCreateData,
  TUpdateData,
>(config: {
  characterId: string;
  queryKey: string;
  listPath: string;
  itemPath: string;
}) {
  const { characterId, queryKey, listPath, itemPath } = config;
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingItem, setEditingItem] = useState<TItem | null>(null);

  const {
    data: items,
    isPending,
    isError,
  } = useQuery({
    queryKey: [queryKey, characterId],
    queryFn: async (): Promise<TItem[]> => {
      const res = await fetch(`/api/admin/characters/${characterId}/${listPath}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [queryKey, characterId] });

  const createMutation = useMutation({
    mutationFn: async (data: TCreateData) => {
      const res = await fetch(`/api/admin/characters/${characterId}/${listPath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create");
      return res.json();
    },
    onSuccess: () => {
      invalidate();
      setShowCreateForm(false);
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TUpdateData }) => {
      const res = await fetch(`/api/admin/${itemPath}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      invalidate();
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const res = await fetch(`/api/admin/${itemPath}/${itemId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: invalidate,
  });

  function openCreateForm() {
    setEditingItem(null);
    setShowCreateForm(true);
  }

  function cancelCreate() {
    setShowCreateForm(false);
  }

  function openEditForm(item: TItem) {
    setShowCreateForm(false);
    setEditingItem(item);
  }

  function cancelEdit() {
    setEditingItem(null);
  }

  async function updateOrder(itemId: string, order: number) {
    const res = await fetch(`/api/admin/${itemPath}/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order }),
    });
    if (!res.ok) throw new Error("Failed to update order");
  }

  async function moveUp(index: number) {
    if (!items || index === 0) return;
    const a = items[index];
    const b = items[index - 1];
    await updateOrder(a.id, b.order);
    await updateOrder(b.id, a.order);
    invalidate();
  }

  async function moveDown(index: number) {
    if (!items || index === items.length - 1) return;
    const a = items[index];
    const b = items[index + 1];
    await updateOrder(a.id, b.order);
    await updateOrder(b.id, a.order);
    invalidate();
  }

  return {
    items,
    isPending,
    isError,
    showCreateForm,
    editingItem,
    nextOrder: items?.length ?? 0,
    openCreateForm,
    cancelCreate,
    openEditForm,
    cancelEdit,
    create: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.isError,
    edit: (id: string, data: TUpdateData) => editMutation.mutate({ id, data }),
    isEditing: editMutation.isPending,
    editError: editMutation.isError,
    remove: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    moveUp,
    moveDown,
  };
}
