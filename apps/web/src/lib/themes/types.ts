export enum DecorationSetId {
  Forest = "forest",
}

export enum TransitionId {
  FloralBloom = "floral-bloom",
  BellsFlower = "bells-flower",
}

export function transitionLabel(id: TransitionId): string {
  switch (id) {
    case TransitionId.FloralBloom:
      return "Floral Bloom";
    case TransitionId.BellsFlower:
      return "Bells Flower";
  }
}

export function decorationLabel(id: DecorationSetId): string {
  switch (id) {
    case DecorationSetId.Forest:
      return "Forest";
  }
}

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
