"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface SectionMeta {
  id: string;
  label: string;
}

const SECTIONS: SectionMeta[] = [
  { id: "hero", label: "ORIGIN" },
  { id: "about", label: "BIO" },
  { id: "education", label: "TIMELINE" },
  { id: "certificates", label: "CREDS" },
  { id: "performance", label: "TELEMETRY" },
  { id: "achievements", label: "INSIGNIA" },
  { id: "skills", label: "ARSENAL" },
  { id: "projects", label: "ARCHIVE" },
  { id: "testimonials", label: "SIGNALS" },
  { id: "goals", label: "MISSIONS" },
  { id: "contact", label: "SIGNAL" },
];

/**
 * A vertical section-rail fixed to the right edge of the viewport (desktop
 * only). Shows a dot per section, a "you are here" indicator that tracks the
 * active section, and a thin progress fill representing the active section's
 * own scroll progress. Clicking a dot smooth-scrolls to that section.
 */
export function SectionRail() {
  const [activeId, setActiveId] = useState("hero");
  const [progress, setProgress] = useState(0);
  const ticking = useRef(false);

  // Track active section + per-section progress via a single scroll listener
  useEffect(() => {
    const update = () => {
      ticking.current = false;
      const viewportMid = window.innerHeight * 0.45;
      let current = SECTIONS[0].id;
      let currentProgress = 0;

      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Active = the section whose top is above the viewport mid AND
        // whose bottom is below it.
        if (rect.top <= viewportMid && rect.bottom >= viewportMid) {
          current = s.id;
          const scrollable = rect.height - window.innerHeight;
          if (scrollable > 0) {
            currentProgress = Math.min(
              1,
              Math.max(0, -rect.top / scrollable)
            );
          } else {
            currentProgress = rect.top < 0 ? 1 : 0;
          }
          break;
        }
        // fallback: last section whose top is above mid
        if (rect.top <= viewportMid) {
          current = s.id;
          currentProgress = 0;
        }
      }
      setActiveId(current);
      setProgress(currentProgress);
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Overall page progress for the rail's vertical fill
  const { scrollYProgress } = useScroll();
  const fillHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <div className="pointer-events-auto relative flex flex-col items-center gap-2.5">
        {/* Vertical track */}
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[oklch(0.82_0.22_165/0.12)]">
          <motion.div
            style={{ height: fillHeight }}
            className="w-full bg-gradient-to-b from-[oklch(0.82_0.22_165)] via-[oklch(0.78_0.20_195)] to-[oklch(0.72_0.25_320)] opacity-60"
          />
        </div>

        {SECTIONS.map((s) => {
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              onClick={() =>
                document
                  .getElementById(s.id)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="group relative flex h-3 w-3 items-center justify-center"
              aria-label={`Jump to ${s.label}`}
            >
              {/* Active progress ring */}
              {isActive && (
                <svg
                  className="absolute inset-0 h-7 w-7 -rotate-90"
                  viewBox="0 0 28 28"
                >
                  <circle
                    cx="14"
                    cy="14"
                    r="12"
                    fill="none"
                    stroke="oklch(0.82 0.22 165 / 0.2)"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="14"
                    cy="14"
                    r="12"
                    fill="none"
                    stroke="oklch(0.82 0.22 165)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 12}`}
                    strokeDashoffset={`${2 * Math.PI * 12 * (1 - progress)}`}
                    style={{ transition: "stroke-dashoffset 0.1s linear" }}
                  />
                </svg>
              )}
              {/* Dot */}
              <span
                className={`relative block rounded-full transition-all duration-300 ${
                  isActive
                    ? "h-2.5 w-2.5 bg-[oklch(0.82_0.22_165)] shadow-[0_0_10px_rgba(120,255,200,0.8)]"
                    : "h-1.5 w-1.5 bg-[oklch(0.82_0.22_165/0.4)] group-hover:bg-[oklch(0.82_0.22_165/0.8)] group-hover:h-2 group-hover:w-2"
                }`}
              />
              {/* Label tooltip */}
              <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.10_0.02_280/0.9)] px-2 py-1 font-mono text-[9px] tracking-[0.15em] text-foreground opacity-0 backdrop-blur-md transition-all duration-200 group-hover:opacity-100 group-hover:right-7">
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
