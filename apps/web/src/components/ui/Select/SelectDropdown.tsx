import { SelectItem } from "./SelectItem";
import type { SelectOption } from "./types";

interface SelectDropdownProps {
  value: string;
  options: SelectOption[];
  placeholder: string;
  onSelect: (value: string) => void;
}

export function SelectDropdown({ value, options, placeholder, onSelect }: SelectDropdownProps) {
  return (
    <ul
      id="select-listbox"
      role="listbox"
      className="absolute left-0 top-full z-50 mt-1 min-w-full overflow-hidden rounded border border-white/10 bg-gray-900 py-1 shadow-lg"
    >
      <SelectItem label={placeholder} selected={value === ""} onSelect={() => onSelect("")} />
      {options.map((option) => (
        <SelectItem
          key={option.value}
          label={option.label}
          selected={value === option.value}
          onSelect={() => onSelect(option.value)}
        />
      ))}
    </ul>
  );
}
