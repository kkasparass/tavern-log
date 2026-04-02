import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { GalleryGrid } from "@/components/character/GalleryGrid";

export default async function GalleryPage({ params }: { params: { slug: string } }) {
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
      <GalleryGrid slug={params.slug} />
    </HydrationBoundary>
  );
}
