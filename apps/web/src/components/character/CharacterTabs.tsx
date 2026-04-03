"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const getTabs = (slug: string) => [
  { label: "Overview", href: `/characters/${slug}` },
  { label: "Stories", href: `/characters/${slug}/stories` },
  { label: "Voice Lines", href: `/characters/${slug}/voice-lines` },
  { label: "Gallery", href: `/characters/${slug}/gallery` },
  { label: "Timeline", href: `/characters/${slug}/timeline` },
];

export function CharacterTabs({ slug }: { slug: string }) {
  const pathname = usePathname();
  return (
    <nav className="mt-6 flex gap-1 overflow-x-auto border-b border-white/10 px-8">
      {getTabs(slug).map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={[
            "whitespace-nowrap rounded-t px-4 py-2 text-sm font-medium transition-colors",
            pathname === tab.href
              ? "border-b-2 border-[var(--theme-accent)] text-[var(--theme-accent)]"
              : "text-white/50 hover:text-white/80",
          ].join(" ")}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
