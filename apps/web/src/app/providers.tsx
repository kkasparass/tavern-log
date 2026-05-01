"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { makeQueryClient } from "@/lib/queryClient";
import { TransitionOverlay } from "@/components/transition-overlay/TransitionOverlay";
import { TransitionProvider } from "@/context-providers/TransitionProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());
  return (
    <TransitionProvider>
      <TransitionOverlay />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TransitionProvider>
  );
}
