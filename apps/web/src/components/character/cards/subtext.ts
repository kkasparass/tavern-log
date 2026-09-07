export function getCardSubtext(
  tagline: string | null,
  tags: string[]
): string | null {
  if (tagline) return tagline;
  return tags.length > 0 ? tags.slice(0, 3).join(" · ") : null;
}
