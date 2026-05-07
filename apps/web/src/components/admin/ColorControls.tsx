"use client";
import type { ThemeColors } from "@/lib/themes/types";
import { ColorPicker } from "./ColorPicker";

type Props = {
  value: ThemeColors;
  onChange: (colors: ThemeColors) => void;
};

export function ColorControls({ value, onChange }: Props) {
  function setColor(field: keyof ThemeColors, hex: string) {
    onChange({ ...value, [field]: hex });
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <ColorPicker label="Background" value={value.bg} onChange={(hex) => setColor("bg", hex)} />
      <ColorPicker label="Text" value={value.text} onChange={(hex) => setColor("text", hex)} />
      <ColorPicker
        label="Accent"
        value={value.accent}
        onChange={(hex) => setColor("accent", hex)}
      />
    </div>
  );
}
