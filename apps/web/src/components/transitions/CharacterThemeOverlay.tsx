"use client";
import { motion } from "framer-motion";
import { useTransition } from "./TransitionProvider";
import { DEFAULT_THEME } from "@/lib/themes/presets";

export function CharacterThemeOverlay() {
  const { phase, hoveredCharacter } = useTransition();

  if (phase === "idle") return null;

  const bg = hoveredCharacter?.colors.bg ?? DEFAULT_THEME.colors.bg;

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {/* gradient background — visible during hover-preview, fades out on covering */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 30%, ${bg} 100%)`,
        }}
        animate={{ opacity: phase === "hover-preview" ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
      />
      {/* solid background — covers fully during covering, stays during uncovering */}
      <motion.div
        className="absolute inset-0"
        style={{ background: bg }}
        animate={{ opacity: phase === "covering" || phase === "uncovering" ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      />
      {/* overlay components (FloralBloomOverlay / BellsFlowerOverlay) wired in next phase */}
    </div>
  );
}
