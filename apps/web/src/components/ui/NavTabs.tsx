"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavTab {
  label: string;
  href: string;
}

interface NavTabsProps {
  tabs: NavTab[];
  className?: string;
  activeClassName: string;
  inactiveClassName: string;
}

export function NavTabs({ tabs, className, activeClassName, inactiveClassName }: NavTabsProps) {
  const pathname = usePathname();
  return (
    <nav className={className}>
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={[
            "whitespace-nowrap rounded-t px-4 py-2 text-sm font-medium transition-colors",
            pathname === tab.href ? activeClassName : inactiveClassName,
          ].join(" ")}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
