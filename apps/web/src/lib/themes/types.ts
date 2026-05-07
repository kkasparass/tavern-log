export type DecorationSetId = "forest" | "none";
export type TransitionId = "floral-bloom" | "bells-flower";
export type DecorationSlotName =
  | "page-edge-left"
  | "page-edge-right"
  | "header-top"
  | "tabs-top"
  | "background";

export type ThemeColors = {
  bg: string;
  text: string;
  accent: string;
};

export type ThemeConfig = {
  preset: DecorationSetId | "custom";
  colors: ThemeColors;
  bgPattern: string;
  transition: TransitionId | null;
  decorations: DecorationSetId | null;
};

export type ThemePreset = {
  label: string;
  config: ThemeConfig;
};
