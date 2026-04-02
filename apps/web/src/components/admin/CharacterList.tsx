'use client'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { CharacterCard } from '@/components/character/CharacterCard'
import type { CharacterPreview } from '@/lib/types'

async function fetchAdminCharacters(): Promise<CharacterPreview[]> {
  const res = await fetch('/api/admin/characters')
  if (!res.ok) throw new Error('Failed to fetch characters')
  return res.json()
}

export function CharacterList() {
  const { data: characters, isPending, isError } = useQuery<CharacterPreview[]>({
    queryKey: ['admin-characters'],
    queryFn: fetchAdminCharacters,
  })

  if (isPending) {
    return <p className="text-white/40">Loading…</p>
  }

  if (isError) {
    return <p className="text-red-400">Failed to load characters.</p>
  }

  if (characters.length === 0) {
    return (
      <p className="text-white/40">
        No characters yet.{' '}
        <Link href="/admin/characters/new" className="text-white/70 hover:text-white underline transition-colors">
          Create your first one.
        </Link>
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {characters.map(c => (
        <div key={c.id} className="flex flex-col gap-2">
          <CharacterCard {...c} />
          <Link
            href={`/admin/characters/${c.id}/edit`}
            className="text-sm text-center text-white/50 hover:text-white transition-colors"
          >
            Edit
          </Link>
        </div>
      ))}
    </div>
  )
}
