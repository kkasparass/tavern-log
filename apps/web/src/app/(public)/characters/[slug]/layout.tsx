import { notFound } from "next/navigation";
import type { Character } from "@/lib/types";
import { CharacterTabs } from "@/components/character/CharacterTabs";
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

  const { bgColor = "#1a1a2e", textColor = "#e0e0e0", accentColor = "#7c3aed" } = character.theme;

  return (
    <div
      className="min-h-screen"
      style={
        {
          "--theme-bg": bgColor,
          "--theme-text": textColor,
          "--theme-accent": accentColor,
          backgroundColor: "var(--theme-bg)",
          color: "var(--theme-text)",
        } as React.CSSProperties
      }
    >
      <header className="px-8 pt-8">
        <h1 className="text-3xl font-bold">{character.name}</h1>
        <p className="mt-1 text-sm opacity-60">
          {character.system}
          {character.campaign ? ` · ${character.campaign}` : ""}
        </p>
        <span className="mt-2 inline-block rounded-full bg-white/10 px-2 py-0.5 text-xs opacity-70">
          {character.status}
        </span>
      </header>

      <CharacterTabs slug={params.slug} />

      <main className="p-8">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
