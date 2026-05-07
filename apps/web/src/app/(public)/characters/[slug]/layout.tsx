import { notFound } from "next/navigation";
import type { Character } from "@/lib/types";
import { resolveTheme } from "@/lib/themes/presets";
import { CharacterTabs } from "@/components/character/CharacterTabs";
import { DecorationSlot } from "@/components/character/DecorationSlot";
import { DecorationSlotName } from "@/lib/themes/types";
import { PageTransition } from "@/components/character/PageTransition";

export default async function CharacterLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const res = await fetch(`${process.env.API_URL}/characters/${params.slug}`, {
    cache: "no-store",
  });
  if (!res.ok) notFound();
  const character: Character = await res.json();

  const theme = resolveTheme(character.theme);

  return (
    <div
      className="relative flex-1"
      style={
        {
          "--theme-bg": theme.colors.bg,
          "--theme-text": theme.colors.text,
          "--theme-accent": theme.colors.accent,
          backgroundColor: "var(--theme-bg)",
          color: "var(--theme-text)",
        } as React.CSSProperties
      }
    >
      <DecorationSlot slot={DecorationSlotName.PageEdgeLeft} decorationSet={theme.decorations} />
      <DecorationSlot slot={DecorationSlotName.PageEdgeRight} decorationSet={theme.decorations} />

      <header className="relative px-4 pt-4 sm:px-8 sm:pt-8">
        <DecorationSlot slot={DecorationSlotName.HeaderTop} decorationSet={theme.decorations} />
        <h1 className="text-3xl font-bold">{character.name}</h1>
        <p className="mt-1 text-sm opacity-60">
          {character.system}
          {character.campaign ? ` · ${character.campaign}` : ""}
        </p>
        <span className="mt-2 inline-block rounded-full bg-white/10 px-2 py-0.5 text-xs opacity-70">
          {character.status}
        </span>
      </header>

      <CharacterTabs slug={params.slug} decorationSet={theme.decorations} />

      <main className="p-4 sm:p-8">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
