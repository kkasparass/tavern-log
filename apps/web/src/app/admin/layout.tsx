import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <aside className="flex w-56 shrink-0 flex-col border-r border-white/10 bg-gray-900">
        <div className="border-b border-white/10 px-6 py-5">
          <Link
            href="/admin"
            className="text-sm font-semibold text-white transition-colors hover:text-white/80"
          >
            Admin
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          <Link
            href="/admin"
            className="rounded px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            Characters
          </Link>
        </nav>
        <div className="border-t border-white/10 px-6 py-4">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-8 text-white">{children}</main>
    </div>
  );
}
