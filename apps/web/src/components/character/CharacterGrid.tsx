"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CharacterCard } from "./CharacterCard";
import { Select } from "@/components/ui/Select";
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
        <Select
          value={systemFilter}
          onChange={setSystemFilter}
          placeholder="All systems"
          options={systems.map((s) => ({ value: s, label: s }))}
        />
        <Select
          value={tagFilter}
          onChange={setTagFilter}
          placeholder="All tags"
          options={tags.map((t) => ({ value: t, label: t }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((c) => (
          <CharacterCard key={c.id} {...c} />
        ))}
      </div>
    </div>
  );
}
