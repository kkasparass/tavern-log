"use client";
import type { StoryEntry } from "@/lib/types";
import { RichTextEditor } from "./RichTextEditor";

interface StoryFormProps {
  editingStory: StoryEntry | null;
  title: string;
  setTitle: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSaving: boolean;
  saveError: boolean;
}

export function StoryForm({
  editingStory,
  title,
  setTitle,
  content,
  setContent,
  onSubmit,
  onCancel,
  isSaving,
  saveError,
}: StoryFormProps) {
  return (
    <div className="mb-6 rounded border border-white/10 bg-gray-900 p-4">
      <h2 className="mb-4 text-sm font-semibold text-white/70">
        {editingStory ? "Edit Story" : "New Story"}
      </h2>
      <div className="mb-3">
        <label className="mb-1 block text-sm text-white/70">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border border-white/10 bg-gray-800 px-3 py-2 text-white"
          placeholder="Story title"
        />
      </div>
      <div className="mb-4">
        <label className="mb-1 block text-sm text-white/70">Content</label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>
      {saveError && <p className="mb-3 text-sm text-red-400">Failed to save story.</p>}
      <div className="flex gap-2">
        <button
          onClick={onSubmit}
          disabled={isSaving || !title.trim()}
          className="rounded bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 disabled:opacity-50"
        >
          {isSaving ? "Saving…" : "Save"}
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
