"use client";
import { motion } from "framer-motion";

const LEAVES = [
  { top: "12%", size: 26, delay: 0.4, rotate: 20 },
  { top: "27%", size: 32, delay: 1.0, rotate: -15 },
  { top: "43%", size: 20, delay: 0, rotate: 30 },
  { top: "58%", size: 28, delay: 0.7, rotate: -25 },
  { top: "72%", size: 22, delay: 1.3, rotate: 10 },
  { top: "86%", size: 30, delay: 0.2, rotate: -10 },
];

function Leaf({ size, rotate }: { size: number; rotate: number }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 24 34" fill="none">
      <path
        d="M12 2 C6 8 2 14 4 22 C6 28 10 32 12 32 C14 32 18 28 20 22 C22 14 18 8 12 2Z"
        fill="var(--theme-accent)"
        opacity="0.5"
        transform={`rotate(${rotate} 12 17)`}
      />
      <line x1="12" y1="2" x2="12" y2="32" stroke="var(--theme-accent)" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

export function PageEdgeRight() {
  return (
    <div className="pointer-events-none fixed right-0 top-0 z-0 h-full w-10 overflow-hidden">
      {LEAVES.map((leaf, i) => (
        <motion.div
          key={i}
          className="absolute -right-1"
          style={{ top: leaf.top }}
          initial={{ x: 8, opacity: 0 }}
          animate={{ x: [0, -4, 0], opacity: 0.7 }}
          transition={{
            x: { duration: 3.5 + i * 0.3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: leaf.delay },
            opacity: { duration: 0.8, delay: leaf.delay },
          }}
        >
          <Leaf size={leaf.size} rotate={leaf.rotate} />
        </motion.div>
      ))}
    </div>
  );
}
