import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { CharacterOverview } from "@/components/character/CharacterOverview";

export default async function CharacterPage({
  params,
}: {
  params: { slug: string };
}) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["character", params.slug],
    queryFn: () =>
      fetch(`${process.env.API_URL}/characters/${params.slug}`).then((r) =>
        r.json(),
      ),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CharacterOverview slug={params.slug} />
    </HydrationBoundary>
  );
}
