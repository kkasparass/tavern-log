'use client'
import Link from 'next/link'

export function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-black/20">
      <Link href="/" className="text-lg font-semibold text-white hover:text-white/80 transition-colors">
        Tavern Log
      </Link>
      <Link href="/admin" className="text-sm text-white/60 hover:text-white/90 transition-colors">
        Admin
      </Link>
    </header>
  )
}
