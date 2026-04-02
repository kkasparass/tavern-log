import { CharacterStatus } from "./types";

export const characterStatusLabel: Record<CharacterStatus, string> = {
  [CharacterStatus.ACTIVE]: "Active",
  [CharacterStatus.RETIRED]: "Retired",
  [CharacterStatus.DECEASED]: "Deceased",
};

export const THEME_PRESETS = [
  { label: "Void", theme: { bgColor: "#0f0f1a", textColor: "#e0e0e0", accentColor: "#7c3aed" } },
  { label: "Ember", theme: { bgColor: "#1c1408", textColor: "#e8d5b0", accentColor: "#d4901a" } },
  { label: "Slate", theme: { bgColor: "#111827", textColor: "#f3f4f6", accentColor: "#3b82f6" } },
  { label: "Forest", theme: { bgColor: "#0f1a0f", textColor: "#d4e8d4", accentColor: "#4ade80" } },
  { label: "Crimson", theme: { bgColor: "#1a0f0f", textColor: "#f0d0d0", accentColor: "#dc2626" } },
] as const;
