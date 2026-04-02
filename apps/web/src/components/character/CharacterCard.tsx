import Image from 'next/image'
import Link from 'next/link'
import type { CharacterPreview } from '@/lib/types'

export function CharacterCard({ slug, name, system, thumbnailUrl, tags }: CharacterPreview) {
  return (
    <Link href={`/characters/${slug}`} className="group block rounded-lg overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
      <div className="relative aspect-square bg-white/10">
        {thumbnailUrl ? (
          <Image src={thumbnailUrl} alt={name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-white/20">?</div>
        )}
      </div>
      <div className="p-3">
        <h2 className="font-semibold text-white truncate">{name}</h2>
        <p className="text-sm text-white/60 mb-2">{system}</p>
        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-1">
            {tags.map(tag => (
              <li key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  )
}
