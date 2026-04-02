import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { VoiceLinesList } from "@/components/character/VoiceLinesList";

export default async function VoiceLinesPage({ params }: { params: { slug: string } }) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["character", params.slug],
    queryFn: () => fetch(`${process.env.API_URL}/characters/${params.slug}`).then((r) => r.json()),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <VoiceLinesList slug={params.slug} />
    </HydrationBoundary>
  );
}
