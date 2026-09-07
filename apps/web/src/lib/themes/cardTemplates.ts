import type { ComponentType } from "react";
import { CARD_TEMPLATE_DEFAULTS } from "./cards";
import { CardTemplateId, cardLabel } from "./types";
import type { SettingsOf } from "./types";
import type {
  CardComponentProps,
  CardSettingsControlsProps,
} from "@/components/character/cards/types";
import { PortraitCard } from "@/components/character/cards/PortraitCard";
import { BannerCard } from "@/components/character/cards/BannerCard";
import { CompactCard } from "@/components/character/cards/CompactCard";
import { PolaroidCard } from "@/components/character/cards/PolaroidCard";
import { PortraitSettingsControls } from "@/components/character/cards/settings/PortraitSettingsControls";
import { BannerSettingsControls } from "@/components/character/cards/settings/BannerSettingsControls";
import { CompactSettingsControls } from "@/components/character/cards/settings/CompactSettingsControls";
import { PolaroidSettingsControls } from "@/components/character/cards/settings/PolaroidSettingsControls";

type CardTemplateEntry<K extends CardTemplateId = CardTemplateId> = {
  label: string;
  CardComponent: ComponentType<CardComponentProps<K>>;
  SettingsControls: ComponentType<CardSettingsControlsProps<K>>;
  defaultSettings: SettingsOf<K>;
};

export type CardRegistry = { [K in CardTemplateId]: CardTemplateEntry<K> };

export const CARD_TEMPLATES: CardRegistry = {
  [CardTemplateId.Portrait]: {
    label: cardLabel(CardTemplateId.Portrait),
    CardComponent: PortraitCard,
    SettingsControls: PortraitSettingsControls,
    defaultSettings: CARD_TEMPLATE_DEFAULTS[CardTemplateId.Portrait],
  },
  [CardTemplateId.Banner]: {
    label: cardLabel(CardTemplateId.Banner),
    CardComponent: BannerCard,
    SettingsControls: BannerSettingsControls,
    defaultSettings: CARD_TEMPLATE_DEFAULTS[CardTemplateId.Banner],
  },
  [CardTemplateId.Compact]: {
    label: cardLabel(CardTemplateId.Compact),
    CardComponent: CompactCard,
    SettingsControls: CompactSettingsControls,
    defaultSettings: CARD_TEMPLATE_DEFAULTS[CardTemplateId.Compact],
  },
  [CardTemplateId.Polaroid]: {
    label: cardLabel(CardTemplateId.Polaroid),
    CardComponent: PolaroidCard,
    SettingsControls: PolaroidSettingsControls,
    defaultSettings: CARD_TEMPLATE_DEFAULTS[CardTemplateId.Polaroid],
  },
};

export function getCardTemplate<K extends CardTemplateId>(
  id: K
): CardTemplateEntry<K> {
  return CARD_TEMPLATES[id];
}
