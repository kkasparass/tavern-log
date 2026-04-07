"use client";
import type { StoryEntry } from "@/lib/types";

interface StoryListProps {
  stories: StoryEntry[];
  onEdit: (story: StoryEntry) => void;
  onToggle: (story: StoryEntry) => void;
  onDelete: (storyId: string) => void;
  isToggling: boolean;
  isDeleting: boolean;
}

export function StoryList({
  stories,
  onEdit,
  onToggle,
  onDelete,
  isToggling,
  isDeleting,
}: StoryListProps) {
  if (stories.length === 0) return <p className="text-white/40">No stories yet.</p>;

  return (
    <ul className="space-y-2">
      {stories.map((story) => (
        <li
          key={story.id}
          className="flex flex-col rounded border border-white/10 bg-gray-900 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="text-white">{story.title}</span>
            <span
              className={`rounded px-2 py-0.5 text-xs ${
                story.isDraft ? "bg-gray-700 text-white/50" : "bg-green-900/40 text-green-400"
              }`}
            >
              {story.isDraft ? "Draft" : "Published"}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 sm:mt-0">
            <button
              onClick={() => onEdit(story)}
              className="rounded px-3 py-1 text-sm text-white/60 hover:bg-white/10 hover:text-white"
            >
              Edit
            </button>
            <button
              onClick={() => onToggle(story)}
              disabled={isToggling}
              className="rounded px-3 py-1 text-sm text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              {story.isDraft ? "Publish" : "Unpublish"}
            </button>
            <button
              onClick={() => onDelete(story.id)}
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
