import type { Metadata } from 'next'
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { CharacterGrid } from '@/components/character/CharacterGrid'

export const metadata: Metadata = {
  title: 'Tavern Log',
  description: 'A personal archive of TTRPG characters.',
  openGraph: {
    title: 'Tavern Log',
    description: 'A personal archive of TTRPG characters.',
  },
}

export default async function HomePage() {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['characters'],
    queryFn: () =>
      fetch(`${process.env.API_URL}/characters`).then(r => r.json()),
  })
  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Tavern Log</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CharacterGrid />
      </HydrationBoundary>
    </main>
  )
}
