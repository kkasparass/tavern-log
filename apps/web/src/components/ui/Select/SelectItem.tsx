interface SelectItemProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export function SelectItem({ label, selected, onSelect }: SelectItemProps) {
  return (
    <li
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      className={`cursor-pointer px-3 py-1.5 text-sm ${
        selected ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
      }`}
    >
      {label}
    </li>
  );
}
