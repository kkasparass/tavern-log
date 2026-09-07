"use client";
import { resolveTheme } from "@/lib/themes/presets";
import { resolveCardFromTheme } from "@/lib/themes/cards";
import { getCardTemplate } from "@/lib/themes/cardTemplates";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { useTransition } from "@/components/transitions/TransitionProvider";
import type { CharacterPreview } from "@/lib/types";

export function CharacterCard(character: CharacterPreview) {
  const { theme, ...data } = character;
  const { hoverPreview, clearHoverPreview } = useTransition();
  const resolvedTheme = resolveTheme(theme);
  const { template, settings } = resolveCardFromTheme(theme);
  const { CardComponent: Card } = getCardTemplate(template);

  return (
    <TransitionLink
      href={`/characters/${data.slug}`}
      theme={resolvedTheme}
      className="group block"
      onMouseEnter={() => hoverPreview(resolvedTheme)}
      onMouseLeave={clearHoverPreview}
    >
      <Card {...data} settings={settings} />
    </TransitionLink>
  );
}
