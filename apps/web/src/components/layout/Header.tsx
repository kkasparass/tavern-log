"use client";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-gray-900 px-8 py-4">
      <Link
        href="/"
        className="text-lg font-semibold text-white transition-colors hover:text-white/80"
      >
        Tavern Log
      </Link>
      <Link href="/admin" className="text-sm text-white/60 transition-colors hover:text-white/90">
        Admin
      </Link>
    </header>
  );
}
