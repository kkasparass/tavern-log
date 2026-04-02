"use client";
import { useQuery } from "@tanstack/react-query";
import type { Character } from "@/lib/types";
import { AudioPlayer } from "./AudioPlayer";

export function VoiceLinesList({ slug }: { slug: string }) {
  const { data: character } = useQuery<Character>({
    queryKey: ["character", slug],
    queryFn: () => fetch(`/api/characters/${slug}`).then((r) => r.json()),
  });

  if (!character) return null;
  if (character.voiceLines.length === 0) {
    return <p className="opacity-50">No voice lines yet.</p>;
  }

  return (
    <ul className="max-w-2xl space-y-6">
      {character.voiceLines.map((line) => (
        <li key={line.id} className="space-y-3">
          {line.context && (
            <p className="text-xs uppercase tracking-widest opacity-40">{line.context}</p>
          )}
          <AudioPlayer audioUrl={line.audioUrl} />
          <p className="text-sm italic leading-relaxed opacity-70">
            &ldquo;{line.transcript}&rdquo;
          </p>
        </li>
      ))}
    </ul>
  );
}
