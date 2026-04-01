'use client'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { CharacterCard } from './CharacterCard'

type Character = {
  id: string
  slug: string
  name: string
  system: string
  thumbnailUrl: string | null
  tags: string[]
}

export function CharacterGrid() {
  const { data: characters = [] } = useQuery<Character[]>({
    queryKey: ['characters'],
    queryFn: () => fetch('/api/characters').then(r => r.json()),
  })

  const [systemFilter, setSystemFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')

  const systems = Array.from(new Set(characters.map(c => c.system))).sort()
  const tags = Array.from(new Set(characters.flatMap(c => c.tags))).sort()

  const filtered = characters.filter(c =>
    (!systemFilter || c.system === systemFilter) &&
    (!tagFilter || c.tags.includes(tagFilter))
  )

  return (
    <div>
      <div className="flex gap-3 mb-6">
        <select
          value={systemFilter}
          onChange={e => setSystemFilter(e.target.value)}
          className="bg-white/10 text-white rounded px-3 py-1.5 text-sm"
        >
          <option value="">All systems</option>
          {systems.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={tagFilter}
          onChange={e => setTagFilter(e.target.value)}
          className="bg-white/10 text-white rounded px-3 py-1.5 text-sm"
        >
          <option value="">All tags</option>
          {tags.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map(c => <CharacterCard key={c.id} {...c} />)}
      </div>
    </div>
  )
}
