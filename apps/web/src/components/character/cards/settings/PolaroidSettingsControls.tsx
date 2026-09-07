"use client";
import type { CardSettingsControlsProps } from "../types";
import type { CardTemplateId } from "@/lib/themes/types";

export function PolaroidSettingsControls({
  value,
  onChange,
}: CardSettingsControlsProps<CardTemplateId.Polaroid>) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="polaroid-rotation" className="text-sm text-white/70">
          Tilt ({value.rotation}°)
        </label>
        <input
          id="polaroid-rotation"
          type="range"
          min={-6}
          max={6}
          step={1}
          value={value.rotation}
          onChange={(e) => onChange({ ...value, rotation: Number(e.target.value) })}
          className="accent-white"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="polaroid-frame-color" className="text-sm text-white/70">
          Frame colour
        </label>
        <input
          id="polaroid-frame-color"
          type="color"
          value={value.frameColor}
          onChange={(e) => onChange({ ...value, frameColor: e.target.value })}
          className="h-9 w-20 cursor-pointer rounded border border-white/20 bg-transparent"
        />
      </div>
    </div>
  );
}
