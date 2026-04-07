"use client";
import { useState } from "react";
import { FileUpload } from "./FileUpload";

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

  const fields = (
    <>
      {!inline && (
        <h2 className="mb-4 text-sm font-semibold text-white/70">
          {isEditing ? "Edit Artwork" : "New Artwork"}
        </h2>
      )}
      <div className="mb-3">
        {isEditing && initialValues?.imageUrl && (
          <p className="mb-1 text-xs text-white/40">
            Current: {initialValues.imageUrl.split("/").pop()}
          </p>
        )}
        <FileUpload
          accept="image/jpeg,image/png,image/webp,image/gif"
          onUpload={(url) => setImageUrl(url)}
          label={isEditing ? "Replace Image (optional)" : "Image"}
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
      {isError && (
        <p className="mb-3 text-sm text-red-400">
          Failed to {isEditing ? "update" : "create"} artwork.
        </p>
      )}
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={isPending || !imageUrl.trim()}
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
    </>
  );

  if (inline) return <div className="w-full">{fields}</div>;

  return (
    <div className="mb-6 rounded border border-white/10 bg-gray-900 p-4">{fields}</div>
  );
}
