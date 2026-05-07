"use client";
import type { AnchorHTMLAttributes } from "react";
import type { TransitionId } from "@/lib/themes/types";
import { useTransition } from "./TransitionProvider";

type TransitionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  transitionId: TransitionId | null;
};

export function TransitionLink({ href, transitionId, children, onClick, ...rest }: TransitionLinkProps) {
  const { navigate } = useTransition();

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
        navigate(href, transitionId);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
