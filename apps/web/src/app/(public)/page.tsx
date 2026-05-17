import type { Metadata } from "next";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CharacterGrid } from "@/components/character/CharacterGrid";
import { PageLayout } from "@/components/layout/PageLayout";

export const metadata: Metadata = {
  title: "Tavern Log",
  description: "A personal archive of TTRPG characters.",
  openGraph: {
    title: "Tavern Log",
    description: "A personal archive of TTRPG characters.",
  },
};

export default async function HomePage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["characters"],
    queryFn: () => fetch(`${process.env.API_URL}/characters`).then((r) => r.json()),
  });
  return (
    <main className="flex flex-col bg-gray-950 py-8 text-white">
      <PageLayout>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <CharacterGrid />
        </HydrationBoundary>
      </PageLayout>
    </main>
  );
}
