"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CharacterCard } from "./CharacterCard";
import type { CharacterPreview } from "@/lib/types";

export function CharacterGrid() {
  const { data: characters = [] } = useQuery<CharacterPreview[]>({
    queryKey: ["characters"],
    queryFn: () => fetch("/api/characters").then((r) => r.json()),
  });

  const [systemFilter, setSystemFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  const systems = Array.from(new Set(characters.map((c) => c.system))).sort();
  const tags = Array.from(new Set(characters.flatMap((c) => c.tags))).sort();

  const filtered = characters.filter(
    (c) =>
      (!systemFilter || c.system === systemFilter) && (!tagFilter || c.tags.includes(tagFilter))
  );

  return (
    <div>
      <div className="mb-6 flex gap-3">
        <select
          value={systemFilter}
          onChange={(e) => setSystemFilter(e.target.value)}
          className="rounded bg-white/10 px-3 py-1.5 text-sm text-white"
        >
          <option value="">All systems</option>
          {systems.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="rounded bg-white/10 px-3 py-1.5 text-sm text-white"
        >
          <option value="">All tags</option>
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((c) => (
          <CharacterCard key={c.id} {...c} />
        ))}
      </div>
    </div>
  );
}
