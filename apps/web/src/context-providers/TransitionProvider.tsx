"use client";
import { createContext, useContext, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type Phase = "idle" | "covering" | "uncovering";

interface TransitionCtx {
  phase: Phase;
  navigate: (href: string) => void;
  onCoverComplete: () => void;
  onUncoverComplete: () => void;
}

const Ctx = createContext<TransitionCtx | null>(null);
export const usePageTransition = () => useContext(Ctx)!;

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const pendingHref = useRef<string | null>(null);

  const navigate = useCallback((href: string) => {
    pendingHref.current = href;
    setPhase("covering");
  }, []);

  const onCoverComplete = useCallback(() => {
    if (pendingHref.current) {
      router.push(pendingHref.current);
      pendingHref.current = null;
    }
    setPhase("uncovering");
  }, [router]);

  const onUncoverComplete = useCallback(() => setPhase("idle"), []);

  return (
    <Ctx.Provider value={{ phase, navigate, onCoverComplete, onUncoverComplete }}>
      {children}
    </Ctx.Provider>
  );
}
