import type { ThemeConfig, ThemePreset } from "./types";

export const DEFAULT_THEME: ThemeConfig = {
  preset: "custom",
  colors: { bg: "#0f0f1a", text: "#e0e0e0", accent: "#7c3aed" },
  bgPattern: "none",
  transition: null,
  decorations: null,
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    label: "Void",
    config: {
      preset: "custom",
      colors: { bg: "#0f0f1a", text: "#e0e0e0", accent: "#7c3aed" },
      bgPattern: "none",
      transition: null,
      decorations: null,
    },
  },
  {
    label: "Ember",
    config: {
      preset: "custom",
      colors: { bg: "#1c1408", text: "#e8d5b0", accent: "#d4901a" },
      bgPattern: "none",
      transition: null,
      decorations: null,
    },
  },
  {
    label: "Slate",
    config: {
      preset: "custom",
      colors: { bg: "white", text: "#f3f4f6", accent: "#3b82f6" },
      bgPattern: "none",
      transition: null,
      decorations: null,
    },
  },
  {
    label: "Forest",
    config: {
      preset: "forest",
      colors: { bg: "#0f1a0f", text: "#d4e8d4", accent: "#4ade80" },
      bgPattern: "none",
      transition: "bells-flower",
      decorations: "forest",
    },
  },
  {
    label: "Crimson",
    config: {
      preset: "custom",
      colors: { bg: "#1a0f0f", text: "#f0d0d0", accent: "#dc2626" },
      bgPattern: "none",
      transition: "floral-bloom",
      decorations: null,
    },
  },
];

export function resolveTheme(stored: Record<string, unknown>): ThemeConfig {
  // New shape: has a nested `colors` object
  if (stored.colors && typeof stored.colors === "object") {
    const colors = stored.colors as Record<string, unknown>;
    return {
      preset: (stored.preset as ThemeConfig["preset"]) ?? DEFAULT_THEME.preset,
      colors: {
        bg: (colors.bg as string) ?? DEFAULT_THEME.colors.bg,
        text: (colors.text as string) ?? DEFAULT_THEME.colors.text,
        accent: (colors.accent as string) ?? DEFAULT_THEME.colors.accent,
      },
      bgPattern: (stored.bgPattern as string) ?? DEFAULT_THEME.bgPattern,
      transition: (stored.transition as ThemeConfig["transition"]) ?? DEFAULT_THEME.transition,
      decorations: (stored.decorations as ThemeConfig["decorations"]) ?? DEFAULT_THEME.decorations,
    };
  }

  // Legacy flat shape: { bgColor, textColor, accentColor }
  if (stored.bgColor || stored.textColor || stored.accentColor) {
    return {
      ...DEFAULT_THEME,
      colors: {
        bg: (stored.bgColor as string) ?? DEFAULT_THEME.colors.bg,
        text: (stored.textColor as string) ?? DEFAULT_THEME.colors.text,
        accent: (stored.accentColor as string) ?? DEFAULT_THEME.colors.accent,
      },
    };
  }

  return DEFAULT_THEME;
}
