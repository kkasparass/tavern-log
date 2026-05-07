"use client";
import { motion } from "framer-motion";
import { useTransition } from "./TransitionProvider";
import { Phase } from "@/lib/themes/types";
import { DEFAULT_THEME } from "@/lib/themes/presets";
import { FloralBloomOverlay } from "./FloralBloomOverlay";
import { BellsFlowerOverlay } from "./BellsFlowerOverlay";

export function CharacterThemeOverlay() {
  const { phase, hoveredCharacter, activeTransition } = useTransition();

  if (phase === Phase.Idle) return null;

  const theme = hoveredCharacter ?? DEFAULT_THEME;
  const bg = theme.colors.bg;

  return (
    <div className="pointer-events-none absolute inset-0 z-50">
      {/* gradient background — visible during hover-preview, fades out on covering */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 50%, ${bg} 100%)`,
          opacity: 0,
        }}
        animate={{ opacity: phase === Phase.HoverPreview ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
      />
      {/* solid background — covers fully during covering, stays during uncovering */}
      <motion.div
        className="absolute inset-0"
        style={{ background: bg, opacity: 0 }}
        animate={{ opacity: phase === Phase.Covering || phase === Phase.Uncovering ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
      {/* overlay animation component */}
      {activeTransition === "floral-bloom" && <FloralBloomOverlay theme={theme} />}
      {activeTransition === "bells-flower" && <BellsFlowerOverlay theme={theme} />}
    </div>
  );
}
