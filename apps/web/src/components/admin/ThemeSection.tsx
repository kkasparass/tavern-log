"use client";
import type { ThemeConfig, ThemeColors } from "@/lib/themes/types";
import { PresetSelector } from "./PresetSelector";
import { ColorControls } from "./ColorControls";
import { AppearanceControls } from "./AppearanceControls";

type Props = {
  value: ThemeConfig;
  onChange: (theme: ThemeConfig) => void;
};

export function ThemeSection({ value, onChange }: Props) {
  function setColors(colors: ThemeColors) {
    onChange({ ...value, colors, preset: "custom" });
  }

  return (
    <div className="flex flex-col gap-4">
      <PresetSelector value={value} onChange={onChange} />
      <ColorControls value={value.colors} onChange={setColors} />
      <AppearanceControls value={value} onChange={onChange} />
    </div>
  );
}
