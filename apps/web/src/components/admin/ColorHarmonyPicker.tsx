"use client";
import {
  ColorArea,
  ColorSlider,
  ColorThumb,
  SliderTrack,
  parseColor,
  type Color,
} from "react-aria-components";

type Props = {
  value: string;
  onChange: (hex: string) => void;
  label: string;
};

function hexToHSL(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
  const hk = h / 360;
  function hue2rgb(p: number, q: number, t: number) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, hk + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, hk) * 255);
  const b = Math.round(hue2rgb(p, q, hk - 1 / 3) * 255);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

const HARMONY_OFFSETS = [
  { label: "Complement", offset: 180 },
  { label: "Analogous", offset: 30 },
  { label: "Triadic", offset: 120 },
  { label: "Split", offset: 150 },
];

function getHarmonies(hex: string): { label: string; hex: string }[] {
  const [h, s, l] = hexToHSL(hex);
  return HARMONY_OFFSETS.map(({ label, offset }) => ({
    label,
    hex: hslToHex((h + offset) % 360, s, l),
  }));
}

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
  const harmonies = getHarmonies(value);
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
        style={{ background: `hsl(${hue} 100% 50%)` }}
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
      <div className="flex gap-2">
        {harmonies.map((swatch) => (
          <button
            key={swatch.label}
            type="button"
            aria-label={swatch.label}
            onClick={() => onChange(swatch.hex)}
            className="h-6 w-6 shrink-0 rounded-full border border-white/20 transition-transform hover:scale-110"
            style={{ backgroundColor: swatch.hex }}
          />
        ))}
      </div>
    </div>
  );
}
