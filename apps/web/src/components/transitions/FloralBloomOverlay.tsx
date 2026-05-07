"use client";
import { useAnimate } from "framer-motion";
import { useEffect } from "react";
import { FlowerIcon } from "@/components/ui/icons/FlowerIcon";
import { useTransition } from "./TransitionProvider";
import { Phase } from "@/lib/themes/types";
import type { ThemeConfig } from "@/lib/themes/types";

const COLS = 8;
const ROWS = 6;
const CELL_COUNT = COLS * ROWS;

export function FloralBloomOverlay({ theme }: { theme: ThemeConfig }) {
  const { phase, onCoverComplete, onUncoverComplete } = useTransition();
  const [scope, animate] = useAnimate<HTMLDivElement>();

  useEffect(() => {
    if (phase === Phase.HoverPreview) {
      animate(".edge", { opacity: 0.18 }, { duration: 0.4 });
    } else if (phase === Phase.Covering) {
      animate("div", { opacity: 1 }, { duration: 0.5 }).then(onCoverComplete);
    } else if (phase === Phase.Uncovering) {
      animate("div", { opacity: 0 }, { duration: 0.4 }).then(onUncoverComplete);
    }
  }, [phase, animate, onCoverComplete, onUncoverComplete]);

  return (
    <div
      ref={scope}
      className="absolute inset-0 grid"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        overflow: "hidden",
      }}
    >
      {Array.from({ length: CELL_COUNT }, (_, i) => {
        const isEdge =
          i < COLS || i >= CELL_COUNT - COLS || i % COLS === 0 || i % COLS === COLS - 1;
        return (
          <div key={i} className={isEdge ? "edge" : ""} style={{ opacity: 0 }}>
            <FlowerIcon height="100%" color={theme.colors.accent} secColor={theme.colors.text} />
          </div>
        );
      })}
    </div>
  );
}
