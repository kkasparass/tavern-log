"use client";
import type { AnchorHTMLAttributes } from "react";
import type { ThemeConfig } from "@/lib/themes/types";
import { useTransition } from "./TransitionProvider";

type TransitionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  theme: ThemeConfig;
};

export function TransitionLink({ href, theme, children, onClick, ...rest }: TransitionLinkProps) {
  const { navigate } = useTransition();

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
        navigate(href, theme);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
