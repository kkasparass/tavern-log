"use client";
import type { CardSettingsControlsProps } from "../types";
import type { CardTemplateId } from "@/lib/themes/types";

export function CompactSettingsControls({
  value,
  onChange,
}: CardSettingsControlsProps<CardTemplateId.Compact>) {
  return (
    <label className="flex items-center gap-2 text-sm text-white/70">
      <input
        type="checkbox"
        checked={value.showTags}
        onChange={(e) => onChange({ ...value, showTags: e.target.checked })}
        className="h-4 w-4 accent-white"
      />
      Show tags
    </label>
  );
}
