"use client";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CharacterForm, type CharacterFormData } from "@/components/admin/CharacterForm";

async function createCharacter(data: CharacterFormData) {
  const res = await fetch("/api/admin/characters", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      campaign: data.campaign || undefined,
      bio: data.bio || undefined,
      personality: data.personality || undefined,
      thumbnailUrl: data.thumbnailUrl || undefined,
    }),
  });
  if (!res.ok) throw new Error("Failed to create character");
  return res.json();
}

export default function NewCharacterPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createCharacter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-characters"] });
      queryClient.invalidateQueries({ queryKey: ["characters"] });
      router.push("/admin");
    },
  });

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-white">New character</h1>
      <CharacterForm
        submitLabel="Create character"
        onSubmit={(data) => mutation.mutate(data)}
        isPending={mutation.isPending}
        error={mutation.isError ? "Failed to create character." : null}
      />
    </div>
  );
}
