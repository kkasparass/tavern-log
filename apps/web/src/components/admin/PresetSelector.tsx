"use client";
import { THEME_PRESETS } from "@/lib/constants";
import type { ThemeConfig, ThemePreset } from "@/lib/themes/types";

type Props = {
  value: ThemeConfig;
  onChange: (theme: ThemeConfig) => void;
};

export function findMatchingPreset(theme: ThemeConfig): ThemePreset | null {
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

const labelClass = "text-sm text-white/70";

export function PresetSelector({ value, onChange }: Props) {
  const activePreset = findMatchingPreset(value);

  return (
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
  );
}
