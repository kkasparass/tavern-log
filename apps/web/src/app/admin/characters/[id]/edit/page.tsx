"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CharacterForm, type CharacterFormData } from "@/components/admin/CharacterForm";
import type { AdminCharacterDetail } from "@/lib/types";

async function fetchCharacter(id: string): Promise<AdminCharacterDetail> {
  const res = await fetch(`/api/admin/characters/${id}`);
  if (!res.ok) throw new Error("Failed to fetch character");
  return res.json();
}

async function updateCharacter(id: string, data: CharacterFormData) {
  const res = await fetch(`/api/admin/characters/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      campaign: data.campaign || undefined,
      bio: data.bio || undefined,
      personality: data.personality || undefined,
      thumbnailUrl: data.thumbnailUrl || undefined,
    }),
  });
  if (!res.ok) throw new Error("Failed to update character");
  return res.json();
}

export default function EditCharacterPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const queryClient = useQueryClient();

  const { data: character, isPending: isLoading } = useQuery({
    queryKey: ["admin-character", id],
    queryFn: () => fetchCharacter(id),
  });

  const mutation = useMutation({
    mutationFn: (data: CharacterFormData) => updateCharacter(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-characters"] });
      queryClient.invalidateQueries({ queryKey: ["admin-character", id] });
      queryClient.invalidateQueries({ queryKey: ["characters"] });
    },
  });

  if (isLoading) {
    return <p className="text-white/40">Loading…</p>;
  }

  if (!character) {
    return <p className="text-red-400">Character not found.</p>;
  }

  const defaultValues: Partial<CharacterFormData> = {
    name: character.name,
    system: character.system,
    campaign: character.campaign ?? "",
    status: character.status,
    bio: character.bio ?? "",
    personality: character.personality ?? "",
    thumbnailUrl: character.thumbnailUrl ?? "",
    isPublic: character.isPublic,
    theme: character.theme,
    tags: character.tags,
  };

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-white">Edit — {character.name}</h1>
      <CharacterForm
        defaultValues={defaultValues}
        submitLabel="Save changes"
        onSubmit={(data) => {
          mutation.mutate(data);
        }}
        isPending={mutation.isPending}
        error={mutation.isError ? "Failed to save changes." : null}
      />
    </div>
  );
}
