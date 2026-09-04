"use client";
import { createContext, useCallback, useContext, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Phase } from "@/lib/themes/types";
import type { ThemeConfig } from "@/lib/themes/types";

type TransitionContextValue = {
  phase: Phase;
  previewTheme: ThemeConfig | null;
  activeTransition: ThemeConfig["transition"];
  hoverPreview: (theme: ThemeConfig) => void;
  clearHoverPreview: () => void;
  navigate: (href: string, theme: ThemeConfig) => void;
  preview: (theme: ThemeConfig) => void;
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
  const [phase, setPhase] = useState<Phase>(Phase.Idle);
  const [previewTheme, setPreviewTheme] = useState<ThemeConfig | null>(null);
  const activeTransition = previewTheme?.transition ?? null;
  // phaseRef lets callbacks read current phase without stale closure
  const phaseRef = useRef<Phase>(Phase.Idle);
  const pendingHref = useRef<string | null>(null);
  // routerRef keeps callbacks stable even if router object identity changes across renders
  const routerRef = useRef(router);
  routerRef.current = router;

  const hoverPreview = useCallback((theme: ThemeConfig) => {
    setPreviewTheme(theme);
    if (phaseRef.current === Phase.Idle) {
      phaseRef.current = Phase.HoverPreview;
      setPhase(Phase.HoverPreview);
    }
  }, []);

  const clearHoverPreview = useCallback(() => {
    if (phaseRef.current !== Phase.HoverPreview) return;
    setPreviewTheme(null);
    phaseRef.current = Phase.Idle;
    setPhase(Phase.Idle);
  }, []);

  const navigate = useCallback((href: string, theme: ThemeConfig) => {
    if (!theme.transition) {
      routerRef.current.push(href);
      return;
    }
    pendingHref.current = href;
    setPreviewTheme(theme);
    phaseRef.current = Phase.Covering;
    setPhase(Phase.Covering);
  }, []);

  const preview = useCallback((theme: ThemeConfig) => {
    setPreviewTheme(theme);
    phaseRef.current = Phase.Covering;
    setPhase(Phase.Covering);
  }, []);

  const onCoverComplete = useCallback(() => {
    if (pendingHref.current) {
      routerRef.current.push(pendingHref.current);
      pendingHref.current = null;
    }
    phaseRef.current = Phase.Uncovering;
    setPhase(Phase.Uncovering);
  }, []);

  const onUncoverComplete = useCallback(() => {
    setPreviewTheme(null);
    phaseRef.current = Phase.Idle;
    setPhase(Phase.Idle);
  }, []);

  return (
    <TransitionContext.Provider
      value={{
        phase,
        previewTheme,
        activeTransition,
        hoverPreview,
        clearHoverPreview,
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
