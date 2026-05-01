"use client";
import { useEffect, useMemo } from "react";
import { motion, AnimatePresence, useAnimate, stagger } from "framer-motion";
import { usePageTransition } from "@/context-providers/TransitionProvider";
import { FlowerIcon } from "../ui/icons/FlowerIcon";

const COLS = 8,
  ROWS = 6;
const FLOWER_COUNT = COLS * ROWS;

export function TransitionOverlay() {
  const { phase, onCoverComplete, onUncoverComplete } = usePageTransition();
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (phase === "covering") {
      const run = async () => {
        const flowerAnimation = async (selector: string, shouldTransform?: boolean) => {
          const m = shouldTransform ? -1 : 1;

          await animate(
            selector,
            { x: `${100 * m}vw`, y: "-25vh", opacity: 0, rotate: -90 * m, scale: 0.3, scaleX: m },
            { duration: 0 }
          );

          await animate(
            `${selector} #bell-1`,
            { rotate: -120 * m, transformOrigin: "top center" },
            { duration: 0 }
          );

          animate(selector, { rotate: [-90 * m, 0, -20 * m] }, { duration: 1, ease: "easeInOut" });

          animate(
            `${selector} #bell-1`,
            { rotate: [-120 * m, 50 * m, -20 * m] },
            { duration: 2, ease: "easeInOut" }
          );

          await animate(
            selector,
            { x: 0, opacity: 1, scale: 0.6 },
            {
              type: "spring",
              stiffness: 80,
              damping: 12,
              mass: 1.2,
              opacity: { duration: 0.4, ease: "easeOut" },
            }
          );

          await animate(
            selector,
            { x: [0, -12 * m, 0] },
            { duration: 1.2, ease: "easeInOut" }
          );
        };

        await Promise.all([
          flowerAnimation('svg[data-flower="flower-1"]'),
          flowerAnimation('svg[data-flower="flower-2"]', true),
        ]);

        onCoverComplete();
      };

      run();
      // animate(
      //   `div[${element}]`,
      //   { scale: [0, 1.1, 1] },
      //   {
      //     duration: 0.25,
      //     ease: [0.34, 1.56, 0.64, 1],
      //     delay: stagger(0.03, { from: "center" }),
      //     onComplete: onCoverComplete,
      //   }
      // );
    } else if (phase === "uncovering") {
      animate(
        // `svg[${element}]`,
        `svg[data-flower]`,
        { scale: [0.6, 0] },
        {
          duration: 0.35,
          ease: [0.55, 0, 1, 0.45],
          onComplete: onUncoverComplete,
        }
      );
    }
  }, [phase]);

  if (phase === "idle") return null;

  return (
    <div
      ref={scope}
      style={{
        zIndex: 9999,
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
      }}
    >
      <FlowerIcon data-flower="flower-1" style={{ position: "absolute" }} />
      <FlowerIcon data-flower="flower-2" style={{ position: "absolute" }} />
    </div>
  );
}
