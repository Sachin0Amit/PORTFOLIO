"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";

const STATUS_LINES: Array<{ threshold: number; text: string }> = [
  { threshold: 0, text: "loading portfolio" },
  { threshold: 45, text: "almost there" },
  { threshold: 90, text: "done" },
];

/**
 * Full-screen boot sequence. Counts 0 -> 100 in ~1.5s, holds 350ms,
 * then slides the whole overlay up. Total lifetime ~2.5s.
 * Hero entrance animations are timed against this (base delay 2.5s).
 */
export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    let exitTimer: ReturnType<typeof setTimeout> | undefined;

    const controls = animate(0, 100, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (v) => setProgress(v),
      onComplete: () => {
        exitTimer = setTimeout(() => setDone(true), 350);
      },
    });

    return () => {
      controls.stop();
      if (exitTimer) clearTimeout(exitTimer);
      document.body.style.overflow = "";
    };
  }, []);

  const statusLine =
    [...STATUS_LINES].reverse().find((s) => progress >= s.threshold)?.text ??
    STATUS_LINES[0].text;

  if (gone) return null;

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = "";
        setGone(true);
      }}
    >
      {!done && (
        <motion.div
          className="star-field fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex flex-col items-center gap-8 px-6">
            {/* Header */}
            <div className="flex flex-col items-center gap-2.5">
              <span className="font-mono text-xs tracking-[0.4em] text-fuchsia-300/80">
                SACHIN KUMAR
              </span>
              <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
                LOADING PORTFOLIO
                <span className="animate-caret text-fuchsia-300">█</span>
              </span>
            </div>

            {/* Counter */}
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-7xl font-bold tabular-nums text-gradient">
                {Math.round(progress)}
              </span>
              <span className="font-mono text-sm text-muted-foreground">%</span>
            </div>

            {/* Progress bar */}
            <div className="h-[3px] w-64 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Status line */}
            <p className="min-h-[1rem] font-mono text-[10px] tracking-[0.25em] text-muted-foreground">
              {statusLine}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
