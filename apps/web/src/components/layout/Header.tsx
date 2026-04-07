import Link from "next/link";
import { cookies } from "next/headers";
import { LogoutButton } from "@/components/admin/LogoutButton";
import Image from "next/image";

export async function Header() {
  const isLoggedIn = !!(await cookies()).get("token");

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-gray-900 px-4 py-4 sm:px-8">
      <Link
        href="/"
        className="flex items-center gap-3 text-lg font-semibold text-white transition-colors hover:text-white/80"
      >
        <Image height={32} width={32} src="/assets/tavern-log-icon.png" alt="Tavern Log" />
        <p>Tavern Log</p>
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
