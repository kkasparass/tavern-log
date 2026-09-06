import { useCallback, useEffect, useRef, useState } from "react";

export type TagSuggestion = { tag: string; count: number };

const DEBOUNCE_MS = 250;

export function useTagSuggestions(query: string, exclude: string[]) {
  const [suggestions, setSuggestions] = useState<TagSuggestion[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const requestIdRef = useRef(0);
  const suggestionsRef = useRef<TagSuggestion[]>([]);
  suggestionsRef.current = suggestions;
  const excludeRef = useRef(exclude);
  excludeRef.current = exclude;
  const excludeKey = exclude.map((t) => t.toLowerCase()).join("|");

  const isOpen = query.trim().length > 0 && suggestions.length > 0;

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions([]);
      setHighlightIndex(-1);
      return;
    }
    const requestId = ++requestIdRef.current;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/tags?q=${encodeURIComponent(trimmed)}`);
        if (!res.ok) return;
        const data = (await res.json()) as { tags: TagSuggestion[] };
        if (requestId !== requestIdRef.current) return;
        const excluded = new Set(excludeRef.current.map((t) => t.toLowerCase()));
        setSuggestions(data.tags.filter((s) => !excluded.has(s.tag.toLowerCase())));
        setHighlightIndex(-1);
      } catch {
        setSuggestions([]);
        setHighlightIndex(-1);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, excludeKey]);

  const moveHighlight = useCallback((delta: number) => {
    setHighlightIndex((prev) => {
      const count = suggestionsRef.current.length;
      if (count === 0) return -1;
      const next = prev + delta;
      if (next < 0) return count - 1;
      if (next >= count) return 0;
      return next;
    });
  }, []);

  const dismiss = useCallback(() => {
    setSuggestions([]);
    setHighlightIndex(-1);
  }, []);

  return { suggestions, highlightIndex, isOpen, moveHighlight, dismiss };
}
