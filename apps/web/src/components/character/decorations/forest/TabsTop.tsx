"use client";
import { motion } from "framer-motion";

const VINE_NODES = [
  { left: "8%", height: 14, delay: 0 },
  { left: "20%", height: 10, delay: 0.5 },
  { left: "33%", height: 16, delay: 1.0 },
  { left: "47%", height: 12, delay: 0.3 },
  { left: "61%", height: 14, delay: 0.8 },
  { left: "74%", height: 10, delay: 0.2 },
  { left: "87%", height: 16, delay: 0.6 },
];

function VineNode({ height }: { height: number }) {
  return (
    <svg width="10" height={height + 8} viewBox={`0 0 10 ${height + 8}`} fill="none">
      {/* stem */}
      <line x1="5" y1="0" x2="5" y2={height} stroke="var(--theme-accent)" strokeWidth="1.2" opacity="0.5" />
      {/* small leaf */}
      <ellipse cx="5" cy={height + 4} rx="4" ry="4" fill="var(--theme-accent)" opacity="0.45" />
    </svg>
  );
}

export function TabsTop() {
  return (
    <div className="pointer-events-none relative h-4 w-full overflow-visible">
      {VINE_NODES.map((node, i) => (
        <motion.div
          key={i}
          className="absolute top-0"
          style={{ transformOrigin: "top", left: node.left }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1, y: [0, 2, 0] }}
          transition={{
            scaleY: { duration: 0.4, delay: node.delay },
            opacity: { duration: 0.4, delay: node.delay },
            y: { duration: 3 + i * 0.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: node.delay + 0.5 },
          }}
        >
          <VineNode height={node.height} />
        </motion.div>
      ))}
    </div>
  );
}
