"use client";
import { useEffect, useRef, useState } from "react";

interface UseSelectOptions {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}

export function useSelect({ value, onChange, options, placeholder }: UseSelectOptions) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((prev) => !prev);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const allOptions = [{ value: "", label: placeholder }, ...options];
      const currentIndex = allOptions.findIndex((o) => o.value === value);
      const nextIndex =
        e.key === "ArrowDown"
          ? Math.min(currentIndex + 1, allOptions.length - 1)
          : Math.max(currentIndex - 1, 0);
      onChange(allOptions[nextIndex].value);
    }
  }

  function selectOption(optionValue: string) {
    onChange(optionValue);
    setOpen(false);
  }

  const selectedLabel = options.find((o) => o.value === value)?.label ?? placeholder;

  return { open, setOpen, containerRef, handleKeyDown, selectOption, selectedLabel };
}
