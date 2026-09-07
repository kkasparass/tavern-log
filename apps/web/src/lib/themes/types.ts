export enum DecorationSetId {
  Forest = "forest",
}

export enum CardTemplateId {
  Portrait = "portrait",
  Banner = "banner",
  Compact = "compact",
  Polaroid = "polaroid",
}

export type PortraitSettings = Record<string, never>;

export type BannerSettings = {
  imageAlignment: "left" | "right";
};

export type CompactSettings = {
  showTags: boolean;
};

export type PolaroidSettings = {
  rotation: number;
  frameColor: string;
};

export type CardSettingsMap = {
  [CardTemplateId.Portrait]: PortraitSettings;
  [CardTemplateId.Banner]: BannerSettings;
  [CardTemplateId.Compact]: CompactSettings;
  [CardTemplateId.Polaroid]: PolaroidSettings;
};

export type SettingsOf<T extends CardTemplateId> = CardSettingsMap[T];

export type ResolvedCard<T extends CardTemplateId = CardTemplateId> = {
  template: T;
  settings: SettingsOf<T>;
};

export function cardLabel(id: CardTemplateId): string {
  switch (id) {
    case CardTemplateId.Portrait:
      return "Portrait";
    case CardTemplateId.Banner:
      return "Banner";
    case CardTemplateId.Compact:
      return "Compact";
    case CardTemplateId.Polaroid:
      return "Polaroid";
  }
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
