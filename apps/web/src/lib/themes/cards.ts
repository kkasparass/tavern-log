import { CardTemplateId } from "./types";
import type { ResolvedCard, SettingsOf } from "./types";

export const CARD_TEMPLATE_DEFAULTS: { [K in CardTemplateId]: SettingsOf<K> } = {
  [CardTemplateId.Portrait]: {},
  [CardTemplateId.Banner]: { imageAlignment: "left" },
  [CardTemplateId.Compact]: { showTags: true },
  [CardTemplateId.Polaroid]: { rotation: -3, frameColor: "#f5f0e6" },
};

function readTemplate(raw: Record<string, unknown>): CardTemplateId {
  const card = raw.card;
  if (!card || typeof card !== "object") {
    return CardTemplateId.Portrait;
  }
  const template = (card as Record<string, unknown>).template;
  return (
    Object.values(CardTemplateId).find((id) => id === template) ??
    CardTemplateId.Portrait
  );
}

function sanitizeSettings<T extends CardTemplateId>(
  defaults: SettingsOf<T>,
  stored: unknown
): SettingsOf<T> {
  const resolved: Record<string, unknown> = { ...defaults };
  if (!stored || typeof stored !== "object") {
    return resolved as SettingsOf<T>;
  }
  for (const [key, value] of Object.entries(stored as Record<string, unknown>)) {
    const fallback = resolved[key];
    if (key in defaults && fallback !== undefined && typeof value === typeof fallback) {
      resolved[key] = value;
    }
  }
  return resolved as SettingsOf<T>;
}

export function resolveCard<const T extends CardTemplateId>(
  template: T,
  raw: Record<string, unknown>
): ResolvedCard<T> {
  const card = raw.card;
  const stored =
    card && typeof card === "object"
      ? (card as Record<string, unknown>).settings
      : undefined;
  return {
    template,
    settings: sanitizeSettings(CARD_TEMPLATE_DEFAULTS[template], stored),
  };
}

export function resolveCardFromTheme(raw: Record<string, unknown>): ResolvedCard {
  return resolveCard(readTemplate(raw), raw);
}
