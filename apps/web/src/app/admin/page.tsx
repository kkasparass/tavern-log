import Link from 'next/link'
import { CharacterList } from '@/components/admin/CharacterList'

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">Characters</h1>
        <Link
          href="/admin/characters/new"
          className="bg-white text-gray-950 font-semibold rounded px-4 py-2 text-sm hover:bg-white/90 transition-colors"
        >
          New character
        </Link>
      </div>
      <CharacterList />
    </div>
  )
}
