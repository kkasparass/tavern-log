"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { CharacterPreview } from "@/lib/types";

async function fetchAdminCharacters(): Promise<CharacterPreview[]> {
  const res = await fetch("/api/admin/characters");
  if (!res.ok) throw new Error("Failed to fetch characters");
  return res.json();
}

export function CharacterList() {
  const {
    data: characters,
    isPending,
    isError,
  } = useQuery<CharacterPreview[]>({
    queryKey: ["admin-characters"],
    queryFn: fetchAdminCharacters,
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
    <ul className="divide-y divide-white/10 rounded border border-white/10">
      {characters.map((c) => (
        <li key={c.id} className="flex items-center justify-between px-4 py-3">
          <div>
            <span className="font-medium text-white">{c.name}</span>
            <span className="ml-2 text-sm text-white/40">{c.system}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
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
          </div>
        </li>
      ))}
    </ul>
  );
}
