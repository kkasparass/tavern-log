"use client";
import { usePageTransition } from "@/context-providers/TransitionProvider";

export function AnimationTestButton() {
  const { triggerAnimation } = usePageTransition();
  return (
    <button
      onClick={triggerAnimation}
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 9998,
        padding: "8px 16px",
        background: "#1a1a2e",
        color: "#e0e0e0",
        border: "1px solid #7c3aed",
        borderRadius: 6,
        cursor: "pointer",
        fontSize: 13,
      }}
    >
      Test Animation
    </button>
  );
}
