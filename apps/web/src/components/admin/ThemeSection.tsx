"use client";
import { THEME_PRESETS } from "@/lib/constants";
import { useTransition } from "@/components/transitions/TransitionProvider";
import type { ThemeConfig, ThemePreset } from "@/lib/themes/types";
import { ColorHarmonyPicker } from "./ColorHarmonyPicker";

type Props = {
  value: ThemeConfig;
  onChange: (theme: ThemeConfig) => void;
};

function findMatchingPreset(theme: ThemeConfig): ThemePreset | null {
  return (
    THEME_PRESETS.find(
      (p) =>
        p.config.colors.bg === theme.colors.bg &&
        p.config.colors.text === theme.colors.text &&
        p.config.colors.accent === theme.colors.accent &&
        p.config.bgPattern === theme.bgPattern &&
        p.config.transition === theme.transition &&
        p.config.decorations === theme.decorations
    ) ?? null
  );
}

const selectClass =
  "bg-gray-800 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30 w-full";
const labelClass = "text-sm text-white/70";

export function ThemeSection({ value, onChange }: Props) {
  const { preview } = useTransition();
  const activePreset = findMatchingPreset(value);

  function setColor(field: "bg" | "text" | "accent", hex: string) {
    onChange({ ...value, colors: { ...value.colors, [field]: hex }, preset: "custom" });
  }

  function setField<K extends keyof ThemeConfig>(field: K, val: ThemeConfig[K]) {
    onChange({ ...value, [field]: val, preset: "custom" });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className={labelClass}>Theme</span>
          {!activePreset && (
            <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-white/50">Custom</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(preset.config)}
              className={`flex items-center gap-2 rounded border px-3 py-2 text-sm transition-colors ${
                activePreset?.label === preset.label
                  ? "border-white text-white"
                  : "border-white/20 text-white/60 hover:border-white/40 hover:text-white/80"
              }`}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: preset.config.colors.accent }}
              />
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ColorHarmonyPicker
          label="Background"
          value={value.colors.bg}
          onChange={(hex) => setColor("bg", hex)}
        />
        <ColorHarmonyPicker
          label="Text"
          value={value.colors.text}
          onChange={(hex) => setColor("text", hex)}
        />
        <ColorHarmonyPicker
          label="Accent"
          value={value.colors.accent}
          onChange={(hex) => setColor("accent", hex)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Background Pattern</label>
          <select
            value={value.bgPattern}
            onChange={(e) => setField("bgPattern", e.target.value)}
            className={selectClass}
          >
            <option value="none">None</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass}>Transition</label>
          <select
            value={value.transition ?? ""}
            onChange={(e) =>
              setField("transition", (e.target.value || null) as ThemeConfig["transition"])
            }
            className={selectClass}
          >
            <option value="">None</option>
            <option value="floral-bloom">Floral Bloom</option>
            <option value="bells-flower">Bells Flower</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass}>Decorations</label>
          <select
            value={value.decorations ?? ""}
            onChange={(e) =>
              setField("decorations", (e.target.value || null) as ThemeConfig["decorations"])
            }
            className={selectClass}
          >
            <option value="">None</option>
            <option value="forest">Forest</option>
          </select>
        </div>
      </div>

      <div>
        <button
          type="button"
          disabled={value.transition === null}
          onClick={() => value.transition && preview(value.transition)}
          className="rounded border border-white/20 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Preview transition
        </button>
      </div>
    </div>
  );
}
