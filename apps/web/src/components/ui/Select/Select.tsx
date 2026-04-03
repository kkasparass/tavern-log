"use client";
import { SelectTrigger } from "./SelectTrigger";
import { SelectDropdown } from "./SelectDropdown";
import { useSelect } from "./useSelect";
import type { SelectOption } from "./types";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className,
}: SelectProps) {
  const { open, setOpen, containerRef, handleKeyDown, selectOption, selectedLabel } = useSelect({
    value,
    onChange,
    options,
    placeholder,
  });

  return (
    <div ref={containerRef} className={`relative min-w-0${className ? ` ${className}` : ""}`}>
      <SelectTrigger
        selectedLabel={selectedLabel}
        hasValue={!!value}
        open={open}
        onKeyDown={handleKeyDown}
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <SelectDropdown
          value={value}
          options={options}
          placeholder={placeholder}
          onSelect={selectOption}
        />
      )}
    </div>
  );
}
