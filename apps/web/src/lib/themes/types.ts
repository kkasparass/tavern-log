export type DecorationSetId = "forest" | "none";
export type TransitionId = "floral-bloom" | "bells-flower";

export enum Phase {
  Idle = "idle",
  HoverPreview = "hover-preview",
  Covering = "covering",
  Uncovering = "uncovering",
}
export enum DecorationSlotName {
  PageEdgeLeft = "page-edge-left",
  PageEdgeRight = "page-edge-right",
  HeaderTop = "header-top",
  TabsTop = "tabs-top",
  Background = "background",
}

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
