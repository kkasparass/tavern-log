import type { Metadata } from "next";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CharacterOverview } from "@/components/character/CharacterOverview";
import type { Character } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const res = await fetch(`${process.env.API_URL}/characters/${params.slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return {};
  const character: Character = await res.json();

  return {
    title: `${character.name} — Tavern Log`,
    description: character.bio ?? `${character.name} · ${character.system}`,
    openGraph: {
      title: `${character.name} — Tavern Log`,
      description: character.bio ?? `${character.name} · ${character.system}`,
      images: character.thumbnailUrl ? [{ url: character.thumbnailUrl }] : [],
    },
  };
}

export default async function CharacterPage({ params }: { params: { slug: string } }) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["character", params.slug],
    queryFn: () =>
      fetch(`${process.env.API_URL}/characters/${params.slug}`, { cache: "no-store" }).then((r) =>
        r.json()
      ),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CharacterOverview slug={params.slug} />
    </HydrationBoundary>
  );
}
