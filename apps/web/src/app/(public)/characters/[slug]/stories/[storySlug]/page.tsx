import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { StoryContent } from "@/components/character/StoryContent";

export default async function StoryPage({
  params,
}: {
  params: { slug: string; storySlug: string };
}) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["story", params.slug, params.storySlug],
    queryFn: () =>
      fetch(`${process.env.API_URL}/characters/${params.slug}/stories/${params.storySlug}`).then(
        (r) => r.json()
      ),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StoryContent slug={params.slug} storySlug={params.storySlug} />
    </HydrationBoundary>
  );
}
