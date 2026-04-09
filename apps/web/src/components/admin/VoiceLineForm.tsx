"use client";
import { useState } from "react";
import { FileUpload } from "./FileUpload";
import { AdminFormWrapper } from "./AdminFormWrapper";

interface VoiceLineFormProps {
  initialValues?: { audioUrl?: string | null; transcript?: string | null; context?: string | null };
  onSubmit: (data: { audioUrl: string; transcript: string; context?: string }) => void;
  onCancel: () => void;
  isPending: boolean;
  isError: boolean;
  inline?: boolean;
}

export function VoiceLineForm({
  initialValues,
  onSubmit,
  onCancel,
  isPending,
  isError,
  inline = false,
}: VoiceLineFormProps) {
  const [audioUrl, setAudioUrl] = useState(initialValues?.audioUrl ?? "");
  const [transcript, setTranscript] = useState(initialValues?.transcript ?? "");
  const [context, setContext] = useState(initialValues?.context ?? "");

  const isEditing = !!initialValues;

  function handleSubmit() {
    if (!audioUrl.trim() || !transcript.trim()) return;
    onSubmit({ audioUrl, transcript, context: context || undefined });
  }

  return (
    <AdminFormWrapper
      inline={inline}
      isEditing={isEditing}
      itemName="Voice Line"
      isPending={isPending}
      isError={isError}
      isSubmitDisabled={!audioUrl.trim() || !transcript.trim()}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    >
      <div className="mb-3">
        <FileUpload
          accept="audio/mpeg,audio/wav,audio/ogg,audio/aac"
          onUpload={(url) => setAudioUrl(url)}
          label={isEditing ? "Replace Audio (optional)" : "Audio"}
          displayValue={initialValues?.audioUrl?.split("/").pop()}
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
    </AdminFormWrapper>
  );
}
