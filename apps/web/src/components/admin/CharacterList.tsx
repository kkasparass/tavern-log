"use client";
import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CharacterPreview } from "@/lib/types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

async function fetchAdminCharacters(): Promise<CharacterPreview[]> {
  const res = await fetch("/api/admin/characters");
  if (!res.ok) throw new Error("Failed to fetch characters");
  return res.json();
}

async function deleteCharacter(id: string): Promise<void> {
  const res = await fetch(`/api/admin/characters/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete character");
}

export function CharacterList() {
  const queryClient = useQueryClient();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const {
    data: characters,
    isPending,
    isError,
  } = useQuery<CharacterPreview[]>({
    queryKey: ["admin-characters"],
    queryFn: fetchAdminCharacters,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCharacter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-characters"] });
    },
  });

  if (isPending) {
    return <p className="text-white/40">Loading…</p>;
  }

  if (isError) {
    return <p className="text-red-400">Failed to load characters.</p>;
  }

  if (characters.length === 0) {
    return (
      <p className="text-white/40">
        No characters yet.{" "}
        <Link
          href="/admin/characters/new"
          className="text-white/70 underline transition-colors hover:text-white"
        >
          Create your first one.
        </Link>
      </p>
    );
  }

  return (
    <>
      <ul className="divide-y divide-white/10 rounded border border-white/10">
        {characters.map((c) => (
          <li
            key={c.id}
            className="flex flex-col px-4 py-3 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <span className="font-medium text-white">{c.name}</span>
              <span className="ml-2 text-sm text-white/40">{c.system}</span>
            </div>
            <div className="ml-3 flex flex-wrap items-center gap-1 text-sm sm:ml-0">
              <Link
                href={`/admin/characters/${c.id}/edit`}
                className="rounded px-3 py-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                Edit
              </Link>
              <span className="text-white/20">·</span>
              <Link
                href={`/admin/characters/${c.id}/stories`}
                className="rounded px-3 py-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                Stories
              </Link>
              <Link
                href={`/admin/characters/${c.id}/voice-lines`}
                className="rounded px-3 py-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                Voice Lines
              </Link>
              <Link
                href={`/admin/characters/${c.id}/gallery`}
                className="rounded px-3 py-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                Gallery
              </Link>
              <Link
                href={`/admin/characters/${c.id}/timeline`}
                className="rounded px-3 py-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                Timeline
              </Link>
              <span className="text-white/20">·</span>
              <button
                onClick={() => setPendingDeleteId(c.id)}
                disabled={deleteMutation.isPending}
                className="rounded px-3 py-1 text-red-400/70 transition-colors hover:bg-red-900/20 hover:text-red-400 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <ConfirmDialog
        isOpen={pendingDeleteId !== null}
        title="Delete character?"
        message="This will permanently delete the character and all associated data. This cannot be undone."
        confirmLabel="Delete"
        isDangerous
        onConfirm={() => {
          if (pendingDeleteId) {
            deleteMutation.mutate(pendingDeleteId);
          }
          setPendingDeleteId(null);
        }}
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  );
}
