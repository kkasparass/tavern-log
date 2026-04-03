"use client";
import type { CharacterVoiceLine } from "@/lib/types";

interface VoiceLineListProps {
  voiceLines: CharacterVoiceLine[];
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function VoiceLineList({
  voiceLines,
  onMoveUp,
  onMoveDown,
  onDelete,
  isDeleting,
}: VoiceLineListProps) {
  if (voiceLines.length === 0) return <p className="text-white/40">No voice lines yet.</p>;

  return (
    <ul className="space-y-2">
      {voiceLines.map((vl, index) => (
        <li
          key={vl.id}
          className="flex items-start justify-between rounded border border-white/10 bg-gray-900 px-4 py-3"
        >
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="truncate text-sm text-white/50">{vl.audioUrl.split("/").pop()}</p>
            <p className="mt-0.5 text-white">{vl.transcript}</p>
            {vl.context && <p className="mt-0.5 text-sm text-white/50">{vl.context}</p>}
          </div>
          <div className="ml-4 flex shrink-0 items-center gap-1">
            <button
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              className="rounded px-2 py-1 text-sm text-white/40 hover:bg-white/10 hover:text-white disabled:opacity-20"
              aria-label="Move up"
            >
              ↑
            </button>
            <button
              onClick={() => onMoveDown(index)}
              disabled={index === voiceLines.length - 1}
              className="rounded px-2 py-1 text-sm text-white/40 hover:bg-white/10 hover:text-white disabled:opacity-20"
              aria-label="Move down"
            >
              ↓
            </button>
            <button
              onClick={() => onDelete(vl.id)}
              disabled={isDeleting}
              className="rounded px-3 py-1 text-sm text-red-400/70 hover:bg-red-900/20 hover:text-red-400 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
