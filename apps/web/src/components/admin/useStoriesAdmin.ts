"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { StoryEntry } from "@/lib/types";

async function fetchStories(id: string): Promise<StoryEntry[]> {
  const res = await fetch(`/api/admin/characters/${id}/stories`);
  if (!res.ok) throw new Error("Failed to fetch stories");
  return res.json();
}

async function createStory(id: string, data: { title: string; content: string }) {
  const res = await fetch(`/api/admin/characters/${id}/stories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create story");
  return res.json();
}

async function updateStory(
  storyId: string,
  data: { title?: string; content?: string; isDraft?: boolean }
) {
  const res = await fetch(`/api/admin/stories/${storyId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update story");
  return res.json();
}

async function deleteStory(storyId: string) {
  const res = await fetch(`/api/admin/stories/${storyId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete story");
}

export function useStoriesAdmin(characterId: string) {
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editingStory, setEditingStory] = useState<StoryEntry | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const {
    data: stories,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["admin-stories", characterId],
    queryFn: () => fetchStories(characterId),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-stories", characterId] });

  const createMutation = useMutation({
    mutationFn: (data: { title: string; content: string }) => createStory(characterId, data),
    onSuccess: () => {
      invalidate();
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      storyId,
      data,
    }: {
      storyId: string;
      data: { title?: string; content?: string };
    }) => updateStory(storyId, data),
    onSuccess: () => {
      invalidate();
      closeForm();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (story: StoryEntry) => updateStory(story.id, { isDraft: !story.isDraft }),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (storyId: string) => deleteStory(storyId),
    onSuccess: invalidate,
  });

  function openNewForm() {
    setEditingStory(null);
    setTitle("");
    setContent("");
    setShowForm(true);
  }

  function openEditForm(story: StoryEntry) {
    setEditingStory(story);
    setTitle(story.title);
    setContent(story.content);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingStory(null);
    setTitle("");
    setContent("");
  }

  function handleSubmit() {
    if (!title.trim()) return;
    if (editingStory) {
      updateMutation.mutate({ storyId: editingStory.id, data: { title, content } });
    } else {
      createMutation.mutate({ title, content });
    }
  }

  return {
    stories,
    isPending,
    isError,
    showForm,
    editingStory,
    title,
    setTitle,
    content,
    setContent,
    openNewForm,
    openEditForm,
    closeForm,
    handleSubmit,
    isSaving: createMutation.isPending || updateMutation.isPending,
    saveError: createMutation.isError || updateMutation.isError,
    toggleMutation,
    deleteMutation,
  };
}
