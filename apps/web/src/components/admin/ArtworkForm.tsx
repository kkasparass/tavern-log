"use client";
import { useState } from "react";
import { FileUpload } from "./FileUpload";
import { AdminFormWrapper } from "./AdminFormWrapper";

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
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl ?? "");
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [caption, setCaption] = useState(initialValues?.caption ?? "");
  const [artistCredit, setArtistCredit] = useState(initialValues?.artistCredit ?? "");

  const isEditing = !!initialValues;

  function handleSubmit() {
    if (!imageUrl.trim()) return;
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
      isPending={isPending}
      isError={isError}
      isSubmitDisabled={!imageUrl.trim()}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    >
      <div className="mb-3">
        <FileUpload
          accept="image/jpeg,image/png,image/webp,image/gif"
          onUpload={(url) => setImageUrl(url)}
          label={isEditing ? "Replace Image (optional)" : "Image"}
          displayValue={initialValues?.imageUrl?.split("/").pop()}
          previewUrl={initialValues?.imageUrl ?? undefined}
        />
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
