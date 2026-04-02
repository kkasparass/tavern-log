import Link from 'next/link'
import { LogoutButton } from '@/components/admin/LogoutButton'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 flex">
      <aside className="w-56 shrink-0 border-r border-white/10 bg-gray-900 flex flex-col">
        <div className="px-6 py-5 border-b border-white/10">
          <Link href="/admin" className="text-sm font-semibold text-white hover:text-white/80 transition-colors">
            Admin
          </Link>
        </div>
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          <Link
            href="/admin"
            className="px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded transition-colors"
          >
            Characters
          </Link>
        </nav>
        <div className="px-6 py-4 border-t border-white/10">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-8 text-white">
        {children}
      </main>
    </div>
  )
}
