"use client";
import { usePageTransition } from "@/context-providers/TransitionProvider";

export function TransitionLink({
  href,
  children,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { navigate } = usePageTransition();
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        navigate(href);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
