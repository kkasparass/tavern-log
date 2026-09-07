"use client";
import { Select } from "@/components/ui/Select";
import { CardImageAlignment } from "@/lib/themes/types";
import type { CardTemplateId } from "@/lib/themes/types";
import type { CardSettingsControlsProps } from "../types";

const alignmentOptions = [
  { value: CardImageAlignment.Left, label: "Thumbnail left" },
  { value: CardImageAlignment.Right, label: "Thumbnail right" },
];

export function BannerSettingsControls({
  value,
  onChange,
}: CardSettingsControlsProps<CardTemplateId.Banner>) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="banner-image-alignment" className="text-sm text-white/70">
        Image alignment
      </label>
      <Select
        id="banner-image-alignment"
        value={value.imageAlignment}
        onChange={(val) =>
          onChange({
            ...value,
            imageAlignment:
              val === CardImageAlignment.Right
                ? CardImageAlignment.Right
                : CardImageAlignment.Left,
          })
        }
        options={alignmentOptions}
      />
    </div>
  );
}
