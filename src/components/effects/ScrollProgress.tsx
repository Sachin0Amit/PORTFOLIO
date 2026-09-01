"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A glowing alien-green progress bar fixed to the top of the viewport
 * that tracks overall page scroll progress.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-[oklch(0.82_0.22_165)] via-[oklch(0.78_0.20_195)] to-[oklch(0.72_0.25_320)]"
    >
      <div className="h-full w-full bg-gradient-to-r from-[oklch(0.82_0.22_165)] via-[oklch(0.78_0.20_195)] to-[oklch(0.72_0.25_320)] shadow-[0_0_10px_rgba(120,255,200,0.7)]" />
    </motion.div>
  );
}
