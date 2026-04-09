"use client";
import { useState } from "react";
import { FileUpload } from "./FileUpload";
import { AdminFormWrapper } from "./AdminFormWrapper";
import { uploadFile } from "@/lib/upload";

interface ArtworkFormProps {
  initialValues?: { imageUrl?: string | null; title?: string | null; caption?: string | null; artistCredit?: string | null };
  onSubmit: (data: { imageUrl: string; title?: string; caption?: string; artistCredit?: string }) => void;
  onCancel: () => void;
  isPending: boolean;
  isError: boolean;
  inline?: boolean;
}

export function ArtworkForm({
  initialValues,
  onSubmit,
  onCancel,
  isPending,
  isError,
  inline = false,
}: ArtworkFormProps) {
  const existingImageUrl = initialValues?.imageUrl ?? "";
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [caption, setCaption] = useState(initialValues?.caption ?? "");
  const [artistCredit, setArtistCredit] = useState(initialValues?.artistCredit ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isEditing = !!initialValues;
  const hasImage = !!existingImageUrl || !!pendingFile;

  async function handleSubmit() {
    let imageUrl = existingImageUrl;
    if (pendingFile) {
      setIsUploading(true);
      setUploadError(null);
      try {
        imageUrl = await uploadFile(pendingFile);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }
    if (!imageUrl) return;
    onSubmit({
      imageUrl,
      title: title || undefined,
      caption: caption || undefined,
      artistCredit: artistCredit || undefined,
    });
  }

  return (
    <AdminFormWrapper
      inline={inline}
      isEditing={isEditing}
      itemName="Artwork"
      isPending={isPending || isUploading}
      isError={isError}
      isSubmitDisabled={!hasImage}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    >
      <div className="mb-3">
        <FileUpload
          accept="image/jpeg,image/png,image/webp,image/gif"
          onFileSelect={setPendingFile}
          label={isEditing ? "Replace Image (optional)" : "Image"}
          displayValue={initialValues?.imageUrl?.split("/").pop()}
          previewUrl={initialValues?.imageUrl ?? undefined}
        />
        {uploadError && <p className="mt-1 text-sm text-red-400">{uploadError}</p>}
      </div>
      <div className="mb-3">
        <label className="mb-1 block text-sm text-white/70">Title (optional)</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border border-white/10 bg-gray-800 px-3 py-2 text-white"
          placeholder="Artwork title"
        />
      </div>
      <div className="mb-3">
        <label className="mb-1 block text-sm text-white/70">Caption (optional)</label>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full rounded border border-white/10 bg-gray-800 px-3 py-2 text-white"
          placeholder="Short description"
        />
      </div>
      <div className="mb-4">
        <label className="mb-1 block text-sm text-white/70">Artist Credit (optional)</label>
        <input
          type="text"
          value={artistCredit}
          onChange={(e) => setArtistCredit(e.target.value)}
          className="w-full rounded border border-white/10 bg-gray-800 px-3 py-2 text-white"
          placeholder="Artist name or link"
        />
      </div>
    </AdminFormWrapper>
  );
}
