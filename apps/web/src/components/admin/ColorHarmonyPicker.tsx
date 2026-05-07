"use client";
import {
  ColorArea,
  ColorSlider,
  ColorThumb,
  SliderTrack,
  parseColor,
  type Color,
} from "react-aria-components";
import { hexToHSL } from "@/lib/colorUtils";

type Props = {
  value: string;
  onChange: (hex: string) => void;
  label: string;
};

function safeParseColor(hex: string): Color {
  try {
    return parseColor(hex).toFormat("hsb");
  } catch {
    return parseColor("#7c3aed").toFormat("hsb");
  }
}

const thumbClass =
  "h-5 w-5 rounded-full border-2 border-white shadow-md cursor-grab forced-colors:border-[Highlight]";

export function ColorHarmonyPicker({ value, onChange, label }: Props) {
  const color = safeParseColor(value);
  const [hue] = hexToHSL(value);

  function handleChange(c: Color) {
    onChange(c.toString("hex"));
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-white/70">{label}</span>
      <ColorArea
        value={color}
        onChange={handleChange}
        colorSpace="hsb"
        xChannel="saturation"
        yChannel="brightness"
        className="h-28 w-full rounded border border-white/10"
        style={{
          background: `linear-gradient(to top, black, transparent), linear-gradient(to right, white, transparent), hsl(${hue} 100% 50%)`,
        }}
      >
        <ColorThumb className={thumbClass} />
      </ColorArea>
      <ColorSlider
        value={color}
        onChange={handleChange}
        colorSpace="hsb"
        channel="hue"
        className="flex flex-col gap-1"
      >
        <SliderTrack className="h-3 w-full rounded">
          <ColorThumb className={`${thumbClass} top-1/2`} />
        </SliderTrack>
      </ColorSlider>
    </div>
  );
}
