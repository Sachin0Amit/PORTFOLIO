"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

interface Ufo {
  id: number;
  y: number;
  delay: number;
  duration: number;
  scale: number;
}

/**
 * Konami-code easter egg. When the user enters ↑↑↓↓←→←→ B A, a fleet of
 * alien UFOs fly across the screen with a beacon message. Also exposes a
 * global `window.__summonUfos()` for programmatic triggers.
 */
export function KonamiEasterEgg() {
  const [active, setActive] = useState(false);
  const [ufoIndex, setUfoIndex] = useState(0);
  const [ufos, setUfos] = useState<Ufo[]>([]);
  const sequence = KONAMI;

  const summon = useCallback(() => {
    setActive(true);
    const fleet: Ufo[] = Array.from({ length: 7 }, (_, i) => ({
      id: Date.now() + i,
      y: 80 + Math.random() * 60,
      delay: i * 0.35,
      duration: 4 + Math.random() * 2.5,
      scale: 0.7 + Math.random() * 0.6,
    }));
    setUfos(fleet);
    setUfoIndex((v) => v + 1);
    // Auto-dismiss after fleet passes
    window.setTimeout(() => setActive(false), 7000);
  }, []);

  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key;
      const expected = sequence[pos];
      // normalize "B"/"A" case-insensitively
      const match =
        key === expected ||
        (expected === "b" && key.toLowerCase() === "b") ||
        (expected === "a" && key.toLowerCase() === "a");
      if (match) {
        pos++;
        if (pos === sequence.length) {
          pos = 0;
          summon();
        }
      } else {
        // reset but allow restart if they hit the first key again
        pos = key === sequence[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    // Expose programmatic trigger
    (window as unknown as { __summonUfos?: () => void }).__summonUfos = summon;
    return () => {
      window.removeEventListener("keydown", onKey);
      delete (window as unknown as { __summonUfos?: () => void }).__summonUfos;
    };
  }, [sequence, summon]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={`fleet-${ufoIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden"
          aria-hidden="true"
        >
          {/* UFOs */}
          {ufos.map((u) => (
            <motion.div
              key={u.id}
              initial={{ x: "-20vw", y: `${u.y}vh` }}
              animate={{ x: "120vw", y: [`${u.y}vh`, `${u.y - 4}vh`, `${u.y}vh`] }}
              transition={{
                duration: u.duration,
                delay: u.delay,
                ease: "easeInOut",
                y: { duration: u.duration / 4, repeat: Infinity, repeatType: "reverse" },
              }}
              style={{ scale: u.scale }}
              className="absolute"
            >
              <UfoSvg />
            </motion.div>
          ))}

          {/* Beacon message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.3 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative rounded-2xl border border-[oklch(0.82_0.22_165/0.5)] bg-[oklch(0.10_0.02_280/0.9)] px-8 py-4 backdrop-blur-xl glow-alien">
              <div className="absolute inset-0 rounded-2xl bg-grid-fine opacity-30" />
              <div className="relative text-center">
                <div className="font-mono text-[10px] tracking-[0.3em] text-[oklch(0.78_0.20_195)] text-glow-cyan">
                  INCOMING TRANSMISSION
                </div>
                <div className="mt-1 font-display text-2xl font-black text-gradient-alien sm:text-3xl">
                  WE COME IN PEACE
                </div>
                <div className="mt-1 font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                  ▲ ▲ ▼ ▼ ◄ ► ◄ ► B A
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function UfoSvg() {
  return (
    <svg
      width="90"
      height="50"
      viewBox="0 0 90 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="dome" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="rgba(180,255,220,0.95)" />
          <stop offset="60%" stopColor="rgba(120,255,200,0.5)" />
          <stop offset="100%" stopColor="rgba(120,255,200,0.05)" />
        </radialGradient>
        <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.4 0.1 280)" />
          <stop offset="100%" stopColor="oklch(0.15 0.05 280)" />
        </linearGradient>
        <radialGradient id="beam" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor="rgba(120,255,200,0.35)" />
          <stop offset="100%" stopColor="rgba(120,255,200,0)" />
        </radialGradient>
      </defs>
      {/* Beam */}
      <path d="M30 38 L60 38 L70 50 L20 50 Z" fill="url(#beam)" />
      {/* Dome */}
      <ellipse cx="45" cy="22" rx="18" ry="14" fill="url(#dome)" stroke="rgba(120,255,200,0.6)" strokeWidth="1" />
      {/* Saucer body */}
      <ellipse cx="45" cy="32" rx="38" ry="7" fill="url(#body)" stroke="rgba(120,255,200,0.4)" strokeWidth="1" />
      {/* Lights */}
      <circle cx="20" cy="33" r="1.8" fill="rgba(220,120,255,1)">
        <animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="35" r="1.5" fill="rgba(120,255,200,1)">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="0.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="45" cy="36" r="1.8" fill="rgba(120,220,255,1)">
        <animate attributeName="opacity" values="1;0.3;1" dur="0.7s" repeatCount="indefinite" />
      </circle>
      <circle cx="58" cy="35" r="1.5" fill="rgba(220,120,255,1)">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="0.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="70" cy="33" r="1.8" fill="rgba(120,255,200,1)">
        <animate attributeName="opacity" values="1;0.3;1" dur="0.9s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
