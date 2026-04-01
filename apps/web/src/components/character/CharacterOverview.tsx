"use client";
import { useQuery } from "@tanstack/react-query";
import type { Character } from "@/lib/types";

export function CharacterOverview({ slug }: { slug: string }) {
  const { data: character } = useQuery<Character>({
    queryKey: ["character", slug],
    queryFn: () => fetch(`/api/characters/${slug}`).then((r) => r.json()),
  });

  if (!character) return null;

  return (
    <div className="max-w-2xl space-y-6">
      {character.bio && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest opacity-40 mb-2">
            Bio
          </h2>
          <p className="leading-relaxed opacity-80">{character.bio}</p>
        </section>
      )}
      {character.personality && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest opacity-40 mb-2">
            Personality
          </h2>
          <p className="leading-relaxed opacity-80">{character.personality}</p>
        </section>
      )}
      {character.tags.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest opacity-40 mb-2">
            Tags
          </h2>
          <ul className="flex flex-wrap gap-2">
            {character.tags.map((tag) => (
              <li
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-white/10 opacity-70"
              >
                {tag}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
