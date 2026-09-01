"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowUpRight,
  Check,
  FolderGit2,
  Cpu,
  Globe,
  Map,
} from "lucide-react";
import { useEffect } from "react";
import { PROFILE } from "@/lib/portfolio-data";
import type { Profile } from "@/lib/portfolio-data";
import { playSound } from "@/hooks/use-sound";

type Project = Profile["projects"][number];

const accentMap = {
  alien: { color: "oklch(0.82 0.22 165)", glow: "glow-alien" },
  cyan: { color: "oklch(0.78 0.20 195)", glow: "glow-cyan" },
  plasma: { color: "oklch(0.72 0.25 320)", glow: "glow-plasma" },
} as const;

const STACK_ICONS: Record<string, typeof Cpu> = {
  "Next.js": Cpu,
  React: Cpu,
  TypeScript: Cpu,
  JavaScript: Cpu,
  "Socket.IO": Globe,
  Tailwind: Cpu,
  "Web Crypto": Cpu,
  Recharts: Cpu,
  "REST APIs": Globe,
  Mapbox: Map,
  Prisma: Cpu,
};

interface ProjectDialogProps {
  project: Project | null;
  onClose: () => void;
}

/**
 * Alien-styled project detail modal. Renders the long description,
 * feature list with checkmarks, key metrics, tech stack and a CTA.
 */
export function ProjectDialog({ project, onClose }: ProjectDialogProps) {
  // Close on Escape + play open/close sounds + lock body scroll
  useEffect(() => {
    if (!project) return;
    playSound("open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // Lock body scroll while open
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      playSound("close");
    };
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9997] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[oklch(0.04_0.02_280/0.85)] backdrop-blur-md"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[88vh] w-full max-w-2xl overflow-hidden rounded-2xl glass-panel holo-border"
          >
            {/* Scanline overlay */}
            <div className="pointer-events-none absolute inset-0 z-10 scanlines" />

            {/* Header band */}
            <div
              className="relative overflow-hidden border-b border-[oklch(0.82_0.22_165/0.15)] p-5 sm:p-6"
              style={{
                background: `linear-gradient(135deg, ${accentMap[project.accent].color.replace(")", " / 0.12)")}, transparent 70%)`,
              }}
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl opacity-40" style={{ background: accentMap[project.accent].color }} />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: `${accentMap[project.accent].color} / 0.12`,
                      border: `1px solid ${accentMap[project.accent].color} / 0.3`,
                    } as React.CSSProperties}
                  >
                    <FolderGit2 className="h-6 w-6" style={{ color: accentMap[project.accent].color }} />
                  </span>
                  <div>
                    <div
                      className="font-mono text-[10px] tracking-[0.25em]"
                      style={{ color: accentMap[project.accent].color }}
                    >
                      {project.codename}
                    </div>
                    <h2 className="mt-0.5 font-display text-xl font-black tracking-wide sm:text-2xl">
                      {project.title}
                    </h2>
                    <p className="text-xs font-medium" style={{ color: accentMap[project.accent].color }}>
                      {project.tagline}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.10_0.02_280/0.6)] text-muted-foreground transition-all hover:border-[oklch(0.82_0.22_165/0.5)] hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="max-h-[calc(88vh-180px)] overflow-y-auto scroll-alien p-5 sm:p-6">
              {/* Preview image */}
              {PROFILE.projectImages[project.codename] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="relative mb-5 overflow-hidden rounded-xl border border-[oklch(0.82_0.22_165/0.2)]"
                >
                  <div
                    className="aspect-[16/8] w-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${PROFILE.projectImages[project.codename]})`,
                    }}
                  />
                  {/* Overlay gradient for legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.04_0.02_280/0.7)] via-transparent to-transparent" />
                  {/* Scanlines */}
                  <div className="pointer-events-none absolute inset-0 scanlines opacity-50" />
                  {/* Corner brackets */}
                  <span className="absolute left-2 top-2 h-4 w-4 border-l border-t border-[oklch(0.82_0.22_165/0.6)]" />
                  <span className="absolute right-2 top-2 h-4 w-4 border-r border-t border-[oklch(0.82_0.22_165/0.6)]" />
                  <span className="absolute bottom-2 left-2 h-4 w-4 border-b border-l border-[oklch(0.82_0.22_165/0.6)]" />
                  <span className="absolute bottom-2 right-2 h-4 w-4 border-b border-r border-[oklch(0.82_0.22_165/0.6)]" />
                  {/* Caption */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-[oklch(0.82_0.22_165/0.3)] bg-[oklch(0.04_0.02_280/0.8)] px-3 py-0.5 font-mono text-[8px] tracking-[0.2em] text-[oklch(0.82_0.22_165)] backdrop-blur-sm">
                    ▸ VISUAL TELEMETRY · {project.codename}
                  </div>
                </motion.div>
              )}
              {/* Metrics row */}
              {project.metrics && (
                <div className="mb-5 grid grid-cols-3 gap-2">
                  {project.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl border border-[oklch(0.82_0.22_165/0.15)] bg-[oklch(0.10_0.02_280/0.5)] p-3 text-center"
                    >
                      <div
                        className="font-display text-lg font-black"
                        style={{ color: accentMap[project.accent].color }}
                      >
                        {m.value}
                      </div>
                      <div className="mt-0.5 font-mono text-[9px] tracking-[0.15em] text-muted-foreground">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Long description */}
              <div className="mb-5">
                <div className="mb-2 font-mono text-[10px] tracking-[0.2em] text-[oklch(0.78_0.20_195)]">
                  ▸ MISSION BRIEFING
                </div>
                <p className="text-sm leading-relaxed text-foreground/85">
                  {project.longDescription}
                </p>
              </div>

              {/* Features */}
              {project.features && (
                <div className="mb-5">
                  <div className="mb-2 font-mono text-[10px] tracking-[0.2em] text-[oklch(0.78_0.20_195)]">
                    ▸ CORE CAPABILITIES
                  </div>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {project.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 rounded-lg border border-[oklch(0.82_0.22_165/0.12)] bg-[oklch(0.08_0.02_280/0.4)] px-3 py-2"
                      >
                        <span
                          className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded"
                          style={{ background: `${accentMap[project.accent].color} / 0.15)` }}
                        >
                          <Check className="h-2.5 w-2.5" style={{ color: accentMap[project.accent].color }} />
                        </span>
                        <span className="text-xs text-foreground/80">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech stack */}
              <div>
                <div className="mb-2 font-mono text-[10px] tracking-[0.2em] text-[oklch(0.78_0.20_195)]">
                  ▸ TECH STACK
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => {
                    const Icon = STACK_ICONS[tech] ?? Cpu;
                    return (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[oklch(0.82_0.22_165/0.15)] bg-[oklch(0.10_0.02_280/0.5)] px-2.5 py-1 font-mono text-[11px] text-foreground/80"
                      >
                        <Icon className="h-3 w-3" style={{ color: accentMap[project.accent].color }} />
                        {tech}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="flex items-center justify-between gap-3 border-t border-[oklch(0.82_0.22_165/0.15)] bg-[oklch(0.08_0.02_280/0.5)] p-4 sm:px-6">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.82_0.22_165)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[oklch(0.82_0.22_165)]" />
                </span>
                <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                  STATUS: {project.status} · {project.progress}% COMPLETE
                </span>
              </div>
              <button
                onClick={onClose}
                className="group flex items-center gap-2 rounded-xl bg-[oklch(0.82_0.22_165)] px-4 py-2 font-display text-xs font-bold tracking-wider text-[oklch(0.10_0.02_280)] transition-all hover:shadow-[0_0_20px_rgba(120,255,200,0.5)]"
              >
                CLOSE
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
