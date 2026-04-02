"use client";
import { useQuery } from "@tanstack/react-query";
import type { Character } from "@/lib/types";

export function TimelineList({ slug }: { slug: string }) {
  const { data: character } = useQuery<Character>({
    queryKey: ["character", slug],
    queryFn: () => fetch(`/api/characters/${slug}`).then((r) => r.json()),
  });

  if (!character) return null;
  if (character.timeline.length === 0) {
    return <p className="opacity-50">No timeline events yet.</p>;
  }

  return (
    <ol className="relative max-w-2xl space-y-8 border-l border-white/10">
      {character.timeline.map((event) => (
        <li key={event.id} className="ml-6">
          <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-[var(--theme-accent)]" />
          {event.dateLabel && (
            <p className="mb-1 text-xs uppercase tracking-widest opacity-40">{event.dateLabel}</p>
          )}
          <h3 className="font-semibold">{event.title}</h3>
          {event.description && (
            <p className="mt-1 text-sm leading-relaxed opacity-70">{event.description}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
