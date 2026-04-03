import { ChevronDown } from "lucide-react";

interface SelectTriggerProps {
  selectedLabel: string;
  hasValue: boolean;
  open: boolean;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onClick: () => void;
}

export function SelectTrigger({
  selectedLabel,
  hasValue,
  open,
  onKeyDown,
  onClick,
}: SelectTriggerProps) {
  return (
    <button
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls="select-listbox"
      onKeyDown={onKeyDown}
      onClick={onClick}
      className="flex min-w-48 max-w-48 items-center justify-between gap-2 rounded border border-white/10 bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-white/30"
    >
      <span className={hasValue ? "text-white" : "text-white/50"}>{selectedLabel}</span>
      <ChevronDown
        size={16}
        className={`shrink-0 text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
      />
    </button>
  );
}
