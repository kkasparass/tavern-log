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
      <div className="mb-6 flex max-w-full gap-3 sm:max-w-xl">
        <Select
          value={systemFilter}
          onChange={setSystemFilter}
          placeholder="All systems"
          options={systems.map((s) => ({ value: s, label: s }))}
          className="flex-1"
        />
        <Select
          value={tagFilter}
          onChange={setTagFilter}
          placeholder="All tags"
          options={tags.map((t) => ({ value: t, label: t }))}
          className="flex-1"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((c) => (
          <CharacterCard key={c.id} {...c} />
        ))}
      </div>
    </div>
  );
}
