"use client";
import { motion } from "framer-motion";
import { BellsFlowerIcon } from "@/components/ui/icons/BellsFlowerIcon";
import { useTransition } from "./TransitionProvider";
import { Phase, type ThemeConfig } from "@/lib/themes/types";

function flowerAnimate(phase: Phase) {
  if (phase === Phase.HoverPreview) return { x: "-60vw" };
  if (phase === Phase.Covering) return { x: "0vw" };
  return { x: "-120vw" }; // uncovering — exit off-screen
}

function flowerTransition(phase: Phase) {
  if (phase === Phase.Covering) return { type: "spring", bounce: 0.2, duration: 0.7 } as const;
  if (phase === Phase.HoverPreview) return { type: "spring", bounce: 0.2, duration: 0.7 } as const;
  return { duration: 0.5 };
}

const FLOWER_STYLE = { height: "clamp(280px, 80cqh, 9000px)", width: "auto" } as const;

export function BellsFlowerOverlay({ theme }: { theme: ThemeConfig }) {
  const { phase, onCoverComplete, onUncoverComplete } = useTransition();

  function handleCoverComplete() {
    if (phase === Phase.Covering) onCoverComplete();
    else if (phase === Phase.Uncovering) onUncoverComplete();
  }

  const animate = flowerAnimate(phase);
  const transition = flowerTransition(phase);

  return (
    <div className="absolute inset-0">
      {/* Left flower — fires the phase callbacks */}
      <div className="absolute bottom-0 left-0">
        <motion.div
          initial={{ x: "-120vw" }}
          animate={animate}
          transition={transition}
          onAnimationComplete={handleCoverComplete}
          style={FLOWER_STYLE}
        >
          <BellsFlowerIcon height="100%" color={theme.colors.accent} secColor={theme.colors.text} />
        </motion.div>
      </div>

      {/* Right flower — mirrored via static CSS on parent, same animation values */}
      <div className="absolute bottom-0 right-0" style={{ transform: "scaleX(-1)" }}>
        <motion.div
          initial={{ x: "-120vw" }}
          animate={animate}
          transition={transition}
          style={FLOWER_STYLE}
        >
          <BellsFlowerIcon height="100%" color={theme.colors.accent} secColor={theme.colors.text} />
        </motion.div>
      </div>
    </div>
  );
}
