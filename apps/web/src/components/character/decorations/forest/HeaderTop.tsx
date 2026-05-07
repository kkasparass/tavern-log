"use client";
import { motion } from "framer-motion";
import { FlowerIcon } from "@/components/ui/icons/FlowerIcon";

const FLOWERS = [
  { left: "5%", delay: 0, scale: 0.7, rotate: -8 },
  { left: "18%", delay: 0.4, scale: 0.55, rotate: 6 },
  { left: "78%", delay: 0.2, scale: 0.6, rotate: -5 },
  { left: "91%", delay: 0.6, scale: 0.75, rotate: 10 },
];

export function HeaderTop() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-16 overflow-hidden">
      {FLOWERS.map((flower, i) => (
        <motion.div
          key={i}
          className="absolute -top-6"
          style={{ left: flower.left }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: [0, 3, 0], opacity: 0.55 }}
          transition={{
            y: {
              duration: 4 + i * 0.4,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: flower.delay,
            },
            opacity: { duration: 0.9, delay: flower.delay },
          }}
        >
          <FlowerIcon
            width={40 * flower.scale}
            height={56 * flower.scale}
            color="var(--theme-accent)"
            secColor="var(--theme-text)"
            style={{ transform: `rotate(${flower.rotate}deg)` }}
          />
        </motion.div>
      ))}
    </div>
  );
}
