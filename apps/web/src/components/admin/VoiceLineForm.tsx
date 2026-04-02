"use client";
import { useState } from "react";

interface VoiceLineFormProps {
  onSubmit: (data: {
    audioUrl: string;
    transcript: string;
    context?: string;
    order: number;
  }) => void;
  onCancel: () => void;
  nextOrder: number;
  isPending: boolean;
  isError: boolean;
}

export function VoiceLineForm({
  onSubmit,
  onCancel,
  nextOrder,
  isPending,
  isError,
}: VoiceLineFormProps) {
  const [audioUrl, setAudioUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [context, setContext] = useState("");

  function handleSubmit() {
    if (!audioUrl.trim() || !transcript.trim()) return;
    onSubmit({ audioUrl, transcript, context: context || undefined, order: nextOrder });
  }

  return (
    <div className="mb-6 rounded border border-white/10 bg-gray-900 p-4">
      <h2 className="mb-4 text-sm font-semibold text-white/70">New Voice Line</h2>
      <div className="mb-3">
        <label className="mb-1 block text-sm text-white/70">Audio URL</label>
        <input
          type="text"
          value={audioUrl}
          onChange={(e) => setAudioUrl(e.target.value)}
          className="w-full rounded border border-white/10 bg-gray-800 px-3 py-2 text-white"
          placeholder="https://..."
        />
      </div>
      <div className="mb-3">
        <label className="mb-1 block text-sm text-white/70">Transcript</label>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={3}
          className="w-full rounded border border-white/10 bg-gray-800 px-3 py-2 text-white"
          placeholder="What is said in this voice line"
        />
      </div>
      <div className="mb-4">
        <label className="mb-1 block text-sm text-white/70">Context (optional)</label>
        <input
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          className="w-full rounded border border-white/10 bg-gray-800 px-3 py-2 text-white"
          placeholder="e.g. Battle cry, greeting, etc."
        />
      </div>
      {isError && <p className="mb-3 text-sm text-red-400">Failed to create voice line.</p>}
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={isPending || !audioUrl.trim() || !transcript.trim()}
          className="rounded bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
        <button
          onClick={onCancel}
          className="rounded px-4 py-2 text-sm text-white/50 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
