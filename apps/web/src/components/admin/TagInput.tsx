"use client";
import { useTagSuggestions } from "./useTagSuggestions";

type TagInputProps = {
  value: string;
  onValueChange: (value: string) => void;
  tags: string[];
  onAdd: (tag?: string) => void;
  onRemove: (tag: string) => void;
  inputClassName?: string;
};

const labelClass = "text-sm text-white/70";

export function TagInput({
  value,
  onValueChange,
  tags,
  onAdd,
  onRemove,
  inputClassName,
}: TagInputProps) {
  const { suggestions, highlightIndex, isOpen: suggestionsOpen, moveHighlight, dismiss } =
    useTagSuggestions(value, tags);

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (suggestionsOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      moveHighlight(e.key === "ArrowDown" ? 1 : -1);
      return;
    }
    if (suggestionsOpen && e.key === "Escape") {
      e.preventDefault();
      dismiss();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestionsOpen && highlightIndex >= 0) {
        onAdd(suggestions[highlightIndex].tag);
        dismiss();
        return;
      }
      onAdd();
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className={labelClass}>Tags</span>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={dismiss}
            placeholder="Add a tag…"
            className={inputClassName}
            aria-label="Tag input"
            role="combobox"
            aria-expanded={suggestionsOpen}
            aria-controls="tag-suggestions"
            aria-autocomplete="list"
            aria-activedescendant={
              suggestionsOpen && highlightIndex >= 0 ? `tag-suggestion-${highlightIndex}` : undefined
            }
          />
          {suggestionsOpen && (
            <ul
              id="tag-suggestions"
              role="listbox"
              aria-label="Tag suggestions"
              className="absolute z-10 mt-1 w-full overflow-hidden rounded border border-white/10 bg-gray-800 shadow-lg"
            >
              {suggestions.map((s, i) => (
                <li
                  key={s.tag}
                  id={`tag-suggestion-${i}`}
                  role="option"
                  aria-selected={i === highlightIndex}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onAdd(s.tag);
                    dismiss();
                  }}
                  className={`flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors ${
                    i === highlightIndex
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{s.tag}</span>
                  <span className="text-xs text-white/40">{s.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="button"
          onClick={() => onAdd()}
          className="rounded border border-white/20 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/40 hover:text-white"
        >
          Add
        </button>
      </div>
      {tags.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-sm text-white/80"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemove(tag)}
                aria-label={`Remove tag ${tag}`}
                className="leading-none text-white/40 transition-colors hover:text-white"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
