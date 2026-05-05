"use client";
import { useThemeHover } from "@/context-providers/ThemeHoverContext";

const EDGE_SIZE = "22vmin";
const OPACITY_HEX = "55"; // ~33% alpha

export function ThemeHoverOverlay() {
  const { bgColor } = useThemeHover();
  const color = bgColor ? `${bgColor}${OPACITY_HEX}` : "transparent";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: -1,
        opacity: bgColor ? 1 : 0,
        transition: "opacity 0.35s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: EDGE_SIZE,
          background: `linear-gradient(to right, ${color}, transparent)`,
          transition: "background 0.35s ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: EDGE_SIZE,
          background: `linear-gradient(to left, ${color}, transparent)`,
          transition: "background 0.35s ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: EDGE_SIZE,
          background: `linear-gradient(to bottom, ${color}, transparent)`,
          transition: "background 0.35s ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: EDGE_SIZE,
          background: `linear-gradient(to top, ${color}, transparent)`,
          transition: "background 0.35s ease",
        }}
      />
    </div>
  );
}
