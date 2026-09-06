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

  const [tagFilter, setTagFilter] = useState("");

  const tags = Array.from(new Set(characters.flatMap((c) => c.tags))).sort();

  const filtered = characters.filter((c) => !tagFilter || c.tags.includes(tagFilter));

  return (
    <div>
      <div className="mb-6 flex gap-3">
        <Select
          value={tagFilter}
          onChange={setTagFilter}
          placeholder="All tags"
          options={tags.map((t) => ({ value: t, label: t }))}
          className="flex-1"
        />
      </div>
      <div className="flex flex-col gap-6">
        {filtered.map((c) => (
          <CharacterCard key={c.id} {...c} />
        ))}
      </div>
    </div>
  );
}
