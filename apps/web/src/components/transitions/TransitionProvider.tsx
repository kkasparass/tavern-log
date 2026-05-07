"use client";
import { createContext, useCallback, useContext, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ThemeConfig, TransitionId } from "@/lib/themes/types";

type Phase = "idle" | "hover-preview" | "covering" | "uncovering";

type TransitionContextValue = {
  phase: Phase;
  hoveredCharacter: ThemeConfig | null;
  activeTransition: TransitionId | null;
  setHoveredCharacter: (theme: ThemeConfig) => void;
  clearHoveredCharacter: () => void;
  navigate: (href: string, transitionId: TransitionId | null) => void;
  preview: (transitionId: TransitionId) => void;
  onCoverComplete: () => void;
  onUncoverComplete: () => void;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function useTransition(): TransitionContextValue {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("useTransition must be used inside TransitionProvider");
  return ctx;
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [hoveredCharacter, setHoveredCharacter] = useState<ThemeConfig | null>(null);
  const [activeTransition, setActiveTransition] = useState<TransitionId | null>(null);
  // phaseRef lets callbacks read current phase without stale closure
  const phaseRef = useRef<Phase>("idle");
  const pendingHref = useRef<string | null>(null);
  // routerRef keeps callbacks stable even if router object identity changes across renders
  const routerRef = useRef(router);
  routerRef.current = router;

  const setHoveredCharacterFn = useCallback((theme: ThemeConfig) => {
    setHoveredCharacter(theme);
    if (phaseRef.current === "idle") {
      phaseRef.current = "hover-preview";
      setPhase("hover-preview");
    }
  }, []);

  const clearHoveredCharacter = useCallback(() => {
    if (phaseRef.current !== "hover-preview") return;
    setHoveredCharacter(null);
    phaseRef.current = "idle";
    setPhase("idle");
  }, []);

  const navigate = useCallback((href: string, transitionId: TransitionId | null) => {
    if (!transitionId) {
      routerRef.current.push(href);
      return;
    }
    pendingHref.current = href;
    setActiveTransition(transitionId);
    phaseRef.current = "covering";
    setPhase("covering");
  }, []);

  const preview = useCallback((transitionId: TransitionId) => {
    setActiveTransition(transitionId);
    phaseRef.current = "covering";
    setPhase("covering");
  }, []);

  const onCoverComplete = useCallback(() => {
    if (pendingHref.current) {
      routerRef.current.push(pendingHref.current);
      pendingHref.current = null;
    }
    phaseRef.current = "uncovering";
    setPhase("uncovering");
  }, []);

  const onUncoverComplete = useCallback(() => {
    setHoveredCharacter(null);
    setActiveTransition(null);
    phaseRef.current = "idle";
    setPhase("idle");
  }, []);

  return (
    <TransitionContext.Provider
      value={{
        phase,
        hoveredCharacter,
        activeTransition,
        setHoveredCharacter: setHoveredCharacterFn,
        clearHoveredCharacter,
        navigate,
        preview,
        onCoverComplete,
        onUncoverComplete,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}
