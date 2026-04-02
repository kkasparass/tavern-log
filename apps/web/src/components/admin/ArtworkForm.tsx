"use client";
import { useState } from "react";

interface ArtworkFormProps {
  onSubmit: (data: {
    imageUrl: string;
    title?: string;
    caption?: string;
    artistCredit?: string;
    order: number;
  }) => void;
  onCancel: () => void;
  nextOrder: number;
  isPending: boolean;
  isError: boolean;
}

export function ArtworkForm({
  onSubmit,
  onCancel,
  nextOrder,
  isPending,
  isError,
}: ArtworkFormProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [artistCredit, setArtistCredit] = useState("");

  function handleSubmit() {
    if (!imageUrl.trim()) return;
    onSubmit({
      imageUrl,
      title: title || undefined,
      caption: caption || undefined,
      artistCredit: artistCredit || undefined,
      order: nextOrder,
    });
  }

  return (
    <div className="mb-6 rounded border border-white/10 bg-gray-900 p-4">
      <h2 className="mb-4 text-sm font-semibold text-white/70">New Artwork</h2>
      <div className="mb-3">
        <label className="mb-1 block text-sm text-white/70">Image URL</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full rounded border border-white/10 bg-gray-800 px-3 py-2 text-white"
          placeholder="https://..."
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
      {isError && <p className="mb-3 text-sm text-red-400">Failed to create artwork.</p>}
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
    </div>
  );
}
