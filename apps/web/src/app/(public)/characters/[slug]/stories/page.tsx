import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { StoriesList } from "@/components/character/StoriesList";

export default async function StoriesPage({ params }: { params: { slug: string } }) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["character", params.slug],
    queryFn: () => fetch(`${process.env.API_URL}/characters/${params.slug}`).then((r) => r.json()),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StoriesList slug={params.slug} />
    </HydrationBoundary>
  );
}
