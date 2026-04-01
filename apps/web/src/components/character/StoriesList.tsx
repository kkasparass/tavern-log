'use client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import type { Character } from '@/lib/types'

export function StoriesList({ slug }: { slug: string }) {
  const { data: character } = useQuery<Character>({
    queryKey: ['character', slug],
    queryFn: () => fetch(`/api/characters/${slug}`).then(r => r.json()),
  })

  if (!character) return null
  if (character.stories.length === 0) {
    return <p className="opacity-50">No stories yet.</p>
  }

  return (
    <ul className="space-y-4 max-w-2xl">
      {character.stories.map(story => (
        <li key={story.id}>
          <Link
            href={`/characters/${slug}/stories/${story.slug}`}
            className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <h2 className="font-semibold">{story.title}</h2>
            {story.publishedAt && (
              <time className="text-sm opacity-50">
                {new Date(story.publishedAt).toLocaleDateString()}
              </time>
            )}
          </Link>
        </li>
      ))}
    </ul>
  )
}
