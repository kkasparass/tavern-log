"use client";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import type { StoryEntry } from "@/lib/types";

export function StoryContent({ slug, storySlug }: { slug: string; storySlug: string }) {
  const { data: story } = useQuery<StoryEntry>({
    queryKey: ["story", slug, storySlug],
    queryFn: () => fetch(`/api/characters/${slug}/stories/${storySlug}`).then((r) => r.json()),
  });

  if (!story) return null;

  const sanitised =
    typeof window !== "undefined" ? DOMPurify.sanitize(story.content) : story.content;

  return (
    <article className="max-w-2xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">{story.title}</h1>
        {story.publishedAt && (
          <time className="text-sm opacity-50">
            {new Date(story.publishedAt).toLocaleDateString()}
          </time>
        )}
      </header>
      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitised }}
      />
    </article>
  );
}
