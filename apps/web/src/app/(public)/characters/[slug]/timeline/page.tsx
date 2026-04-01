import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { TimelineList } from '@/components/character/TimelineList'

export default async function TimelinePage({ params }: { params: { slug: string } }) {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['character', params.slug],
    queryFn: () =>
      fetch(`${process.env.API_URL}/characters/${params.slug}`).then(r => r.json()),
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TimelineList slug={params.slug} />
    </HydrationBoundary>
  )
}
