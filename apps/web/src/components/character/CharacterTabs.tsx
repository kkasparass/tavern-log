"use client";
import { NavTabs } from "@/components/ui/NavTabs";
import { DecorationSlot } from "@/components/character/DecorationSlot";
import type { DecorationSetId } from "@/lib/themes/types";

const getTabs = (slug: string) => [
  { label: "Overview", href: `/characters/${slug}` },
  { label: "Stories", href: `/characters/${slug}/stories` },
  { label: "Voice Lines", href: `/characters/${slug}/voice-lines` },
  { label: "Gallery", href: `/characters/${slug}/gallery` },
  { label: "Timeline", href: `/characters/${slug}/timeline` },
];

export function CharacterTabs({
  slug,
  decorationSet = null,
}: {
  slug: string;
  decorationSet?: DecorationSetId | null;
}) {
  return (
    <div className="relative">
      <DecorationSlot slot="tabs-top" decorationSet={decorationSet} />
      <NavTabs
        tabs={getTabs(slug)}
        className="mt-6 flex gap-1 overflow-x-auto border-b border-white/10 px-8"
        activeClassName="border-b-2 border-[var(--theme-accent)] text-[var(--theme-accent)]"
        inactiveClassName="text-white/50 hover:text-white/80"
      />
    </div>
  );
}
