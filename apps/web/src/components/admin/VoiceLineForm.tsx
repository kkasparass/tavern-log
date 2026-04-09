"use client";
import { useState } from "react";
import { FileUpload } from "./FileUpload";
import { AdminFormWrapper } from "./AdminFormWrapper";
import { uploadFile } from "@/lib/upload";

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
  const existingAudioUrl = initialValues?.audioUrl ?? "";
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState(initialValues?.transcript ?? "");
  const [context, setContext] = useState(initialValues?.context ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isEditing = !!initialValues;
  const hasAudio = !!existingAudioUrl || !!pendingFile;

  async function handleSubmit() {
    let audioUrl = existingAudioUrl;
    if (pendingFile) {
      setIsUploading(true);
      setUploadError(null);
      try {
        audioUrl = await uploadFile(pendingFile);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }
    if (!audioUrl || !transcript.trim()) return;
    onSubmit({ audioUrl, transcript, context: context || undefined });
  }

  return (
    <AdminFormWrapper
      inline={inline}
      isEditing={isEditing}
      itemName="Voice Line"
      isPending={isPending || isUploading}
      isError={isError}
      isSubmitDisabled={!hasAudio || !transcript.trim()}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    >
      <div className="mb-3">
        <FileUpload
          accept="audio/mpeg,audio/wav,audio/ogg,audio/aac"
          onFileSelect={setPendingFile}
          label={isEditing ? "Replace Audio (optional)" : "Audio"}
          displayValue={initialValues?.audioUrl?.split("/").pop()}
        />
        {uploadError && <p className="mt-1 text-sm text-red-400">{uploadError}</p>}
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
