"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { makeQueryClient } from "@/lib/queryClient";
import { TransitionOverlay } from "@/components/transition-overlay/TransitionOverlay";
import { TransitionProvider } from "@/context-providers/TransitionProvider";
import { ThemeHoverProvider } from "@/context-providers/ThemeHoverContext";
import { ThemeHoverOverlay } from "@/components/theme-hover-overlay/ThemeHoverOverlay";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());
  return (
    <TransitionProvider>
      <ThemeHoverProvider>
        <TransitionOverlay />
        <ThemeHoverOverlay />
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ThemeHoverProvider>
    </TransitionProvider>
  );
}
