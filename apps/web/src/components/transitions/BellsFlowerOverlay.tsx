"use client";
import { useAnimate, stagger } from "framer-motion";
import { useEffect, useState } from "react";
import { BellsFlowerIcon } from "@/components/ui/icons/BellsFlowerIcon";
import { GrassIcon } from "@/components/ui/icons/GrassIcon";
import { useTransition } from "./TransitionProvider";
import { Phase, type ThemeConfig } from "@/lib/themes/types";
import { BellsFlowerIconV2 } from "../ui/icons/BellsFlowerIconV2";
import { FernBranchIcon } from "../ui/icons/FernBranchIcon";

// Animation Map:
// Bell flower rotation: -60 -> -40 hold for hover -> 0
// petals rotation: -60 -> 0, 5, 0 hold for hover -> -60, 0, -5, 0

type FlowerConfig = {
  side: "left" | "right";
};

const FLOWERS: FlowerConfig[] = [{ side: "left" }, { side: "right" }];

type AnimateFn = ReturnType<typeof useAnimate>[1];

const SPRING_IN = { type: "spring", bounce: 0.3, duration: 0.8 } as const;
const SPRING_PEEK = { type: "spring", bounce: 0.25, duration: 1.5 } as const;

async function animationSetup(animate: AnimateFn, _config: FlowerConfig) {
  await animate(".bell-flower", { rotate: -90 }, { duration: 0 });
  await animate(
    "#bellsFlowerV2_flower-bulb-1, #bellsFlowerV2_flower-bulb-2, #bellsFlowerV2_flower-bulb-3, #bellsFlowerV2_flower-bulb-4, #bellsFlowerV2_segmented-bulb-1, #bellsFlowerV2_segmented-bulb-2",
    { rotate: 180, transformOrigin: "top center" },
    { duration: 0 }
  );
  // await animate(
  //   "#segmented-bulb-1, #segmented-bulb-2",
  //   { y: [0, -10, 3, 0] },
  //   { duration: 0.5, delay: stagger(0.1, { startDelay: 0.1 }), ease: "easeInOut" }
  // );
}

async function animateFlowerIn(animate: AnimateFn, _config: FlowerConfig) {
  await Promise.all([
    animate(".flower-group", { x: 0 }, SPRING_IN),
    animate(".bell-flower", { rotate: -20 }, SPRING_IN),
    animate(
      "#bellsFlowerV2_flower-bulb-1, #bellsFlowerV2_flower-bulb-2, #bellsFlowerV2_flower-bulb-3, #bellsFlowerV2_flower-bulb-4, #bellsFlowerV2_segmented-bulb-1, #bellsFlowerV2_segmented-bulb-2",
      { rotate: [150, 60, 0, 15, 0, 10] },
      { duration: 1, ease: "easeIn" }
    ),
  ]);

  // animate("#background-leaf", { rotate: [0, 6, -3, 0] }, { duration: 0.7, ease: "easeInOut" });
  // animate(
  //   "#stem-leaf",
  //   { rotate: [0, -10, 5, 0] },
  //   { duration: 0.6, delay: 0.1, ease: "easeInOut" }
  // );
  // animate(
  //   "#flower-bulb-1, #flower-bulb-2, #flower-bulb-3, #flower-bulb-4",
  //   { y: [0, -14, 4, 0] },
  //   { duration: 0.55, delay: stagger(0.08), ease: "easeInOut" }
  // );
  // await animate(
  //   "#segmented-bulb-1, #segmented-bulb-2",
  //   { y: [0, -10, 3, 0] },
  //   { duration: 0.5, delay: stagger(0.1, { startDelay: 0.1 }), ease: "easeInOut" }
  // );
}

async function animatePreviewIn(animate: AnimateFn, _config: FlowerConfig) {
  await Promise.all([
    animate(".flower-group", { x: "0vw" }, SPRING_PEEK),
    animate(".bell-flower", { rotate: -40 }, SPRING_PEEK),
    animate(
      "#bellsFlowerV2_flower-bulb-1, #bellsFlowerV2_flower-bulb-2, #bellsFlowerV2_flower-bulb-3, #bellsFlowerV2_flower-bulb-4, #bellsFlowerV2_segmented-bulb-1, #bellsFlowerV2_segmented-bulb-2",
      { rotate: [180, 0, 60, 30, 60] },
      { duration: 1.5, ease: "easeIn", delay: 0.5 }
    ),
  ]);
}

async function runPreview(animateLeft: AnimateFn, animateRight: AnimateFn) {
  await Promise.all([
    animatePreviewIn(animateLeft, FLOWERS[0]),
    animatePreviewIn(animateRight, FLOWERS[1]),
  ]);
}

async function runCovering(
  animateLeft: AnimateFn,
  animateRight: AnimateFn,
  onCoverComplete: () => void
) {
  await Promise.all([
    animateFlowerIn(animateLeft, FLOWERS[0]),
    animateFlowerIn(animateRight, FLOWERS[1]),
  ]);
  onCoverComplete();
}

async function runUncovering(
  animateLeft: AnimateFn,
  animateRight: AnimateFn,
  onUncoverComplete: () => void
) {
  await Promise.all([
    animateLeft(".flower-group", { x: "-110vw" }, { duration: 0.45, ease: "easeIn" }),
    animateRight(".flower-group", { x: "-110vw" }, { duration: 0.45, ease: "easeIn" }),
  ]);
  onUncoverComplete();
}

async function runSetup(animateLeft: AnimateFn, animateRight: AnimateFn, onComplete: () => void) {
  await Promise.all([
    animationSetup(animateLeft, FLOWERS[0]),
    animationSetup(animateRight, FLOWERS[1]),
  ]);
  onComplete();
}

export function BellsFlowerOverlay({ theme }: { theme: ThemeConfig }) {
  const { phase, onCoverComplete, onUncoverComplete } = useTransition();
  const [scopeLeft, animateLeft] = useAnimate<HTMLDivElement>();
  const [scopeRight, animateRight] = useAnimate<HTMLDivElement>();
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);

  useEffect(() => {
    runSetup(animateLeft, animateRight, () => setHasCompletedSetup(true));
  }, []);

  useEffect(() => {
    if (!hasCompletedSetup) return;
    if (phase === Phase.HoverPreview) runPreview(animateLeft, animateRight);
    else if (phase === Phase.Covering) runCovering(animateLeft, animateRight, onCoverComplete);
    else if (phase === Phase.Uncovering)
      runUncovering(animateLeft, animateRight, onUncoverComplete);
  }, [phase, animateLeft, animateRight, onCoverComplete, onUncoverComplete, hasCompletedSetup]);

  return (
    <div className="absolute inset-0">
      {/* Left scope — absolute inset-0 so children can be positioned independently */}
      <div ref={scopeLeft} className="absolute inset-0 overflow-visible">
        {/* Flower — anchored bottom-left */}
        <div className="absolute bottom-0 left-0">
          <div className="flower-group" style={{ transform: "translateX(-110vw)" }}>
            <BellsFlowerIconV2
              className="bell-flower"
              height="clamp(280px, 80cqh, 9000px)"
              width="auto"
              color={theme.colors.accent}
              secColor={theme.colors.text}
            />
          </div>
        </div>
        {/* Grass — pushed down so only the top shows above the screen edge */}
        <div className="absolute left-0" style={{ bottom: "-25cqh" }}>
          <div className="flower-group" style={{ transform: "translateX(-110vw)" }}>
            <GrassIcon
              height="clamp(280px, 60cqh, 9000px)"
              width="auto"
              color={theme.colors.accent}
              secColor={theme.colors.text}
            />
          </div>
        </div>
        {/* fern branch — anchored top-left */}
        <div className="absolute left-0 top-0">
          <div className="flower-group" style={{ transform: "translateX(-110vw)" }}>
            <FernBranchIcon
              className="fern-branch"
              height="clamp(280px, 60cqh, 9000px)"
              width="auto"
              color={theme.colors.accent}
              secColor={theme.colors.text}
              style={{ transform: "scaleX(-1)" }}
            />
          </div>
        </div>
      </div>
      {/* Right scope — mirrored via scaleX(-1) */}
      <div ref={scopeRight} className="absolute inset-0" style={{ transform: "scaleX(-1)" }}>
        <div className="absolute bottom-0 left-0">
          <div className="flower-group" style={{ transform: "translateX(-110vw)" }}>
            <BellsFlowerIconV2
              className="bell-flower"
              height="clamp(280px, 80cqh, 9000px)"
              width="auto"
              color={theme.colors.accent}
              secColor={theme.colors.text}
            />
          </div>
        </div>
        {/* Grass — pushed down so only the top shows above the screen edge */}
        <div className="absolute left-0" style={{ bottom: "-25cqh" }}>
          <div className="flower-group" style={{ transform: "translateX(-110vw)" }}>
            <GrassIcon
              height="clamp(280px, 60cqh, 9000px)"
              width="auto"
              color={theme.colors.accent}
              secColor={theme.colors.text}
            />
          </div>
        </div>
        {/* fern branch — anchored top-left */}
        <div className="absolute left-0 top-0">
          <div className="flower-group" style={{ transform: "translateX(-110vw)" }}>
            <FernBranchIcon
              className="fern-branch"
              height="clamp(280px, 60cqh, 9000px)"
              width="auto"
              color={theme.colors.accent}
              secColor={theme.colors.text}
              style={{ transform: "scaleX(-1)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
