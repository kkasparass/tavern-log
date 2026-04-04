import Link from "next/link";
import { cookies } from "next/headers";
import { LogoutButton } from "@/components/admin/LogoutButton";

export async function Header() {
  const isLoggedIn = !!(await cookies()).get("token");

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-gray-900 px-4 py-4 sm:px-8">
      <Link
        href="/"
        className="text-lg font-semibold text-white transition-colors hover:text-white/80"
      >
        Tavern Log
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/admin" className="text-sm text-white/60 transition-colors hover:text-white/90">
          Admin
        </Link>
        {isLoggedIn && <LogoutButton />}
      </div>
    </header>
  );
}
