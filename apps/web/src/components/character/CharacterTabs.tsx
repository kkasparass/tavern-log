'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const getTabs = (slug: string) => [
  { label: 'Overview',    href: `/characters/${slug}` },
  { label: 'Stories',     href: `/characters/${slug}/stories` },
  { label: 'Voice Lines', href: `/characters/${slug}/voice-lines` },
  { label: 'Gallery',     href: `/characters/${slug}/gallery` },
  { label: 'Timeline',    href: `/characters/${slug}/timeline` },
]

export function CharacterTabs({ slug }: { slug: string }) {
  const pathname = usePathname()
  return (
    <nav className="flex gap-1 px-8 mt-6 border-b border-white/10">
      {getTabs(slug).map(tab => (
        <Link
          key={tab.href}
          href={tab.href}
          className={[
            'px-4 py-2 text-sm font-medium rounded-t transition-colors',
            pathname === tab.href
              ? 'text-[var(--theme-accent)] border-b-2 border-[var(--theme-accent)]'
              : 'text-white/50 hover:text-white/80',
          ].join(' ')}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}
