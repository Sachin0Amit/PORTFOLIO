"use client";

import { motion } from "framer-motion";
import {
  Gauge,
  GraduationCap,
  Languages,
  GitBranch,
  Cpu,
  MapPin,
  Award,
} from "lucide-react";
import { PROFILE } from "@/lib/portfolio-data";
import type { Profile } from "@/lib/portfolio-data";
import { TiltCard } from "@/components/effects/TiltCard";

type Achievement = Profile["achievements"][number];

const ICON_MAP: Record<string, typeof Gauge> = {
  gauge: Gauge,
  graduation: GraduationCap,
  languages: Languages,
  git: GitBranch,
  cpu: Cpu,
  map: MapPin,
};

const accentMap = {
  alien: { color: "oklch(0.82 0.22 165)" },
  cyan: { color: "oklch(0.78 0.20 195)" },
  plasma: { color: "oklch(0.72 0.25 320)" },
} as const;

function AchievementBadge({ item, index }: { item: Achievement; index: number }) {
  const Icon = ICON_MAP[item.icon] ?? Award;
  const ac = accentMap[item.accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: 30 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <TiltCard max={14} scale={1.06} glareColor={item.accent} className="h-full">
        <div className="group relative flex h-full flex-col items-center overflow-hidden rounded-2xl glass-panel p-4 text-center">
          {/* Glow */}
          <div
            className="absolute -top-8 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full blur-2xl opacity-40 transition-opacity group-hover:opacity-70"
            style={{ background: ac.color }}
          />
          {/* Icon medallion */}
          <div
            className="relative flex h-12 w-12 items-center justify-center rounded-full"
            style={{
              background: `${ac.color} / 0.12`,
              border: `1px solid ${ac.color} / 0.4`,
              boxShadow: `0 0 16px ${ac.color} / 0.25`,
            } as React.CSSProperties}
          >
            <Icon className="h-5 w-5" style={{ color: ac.color }} />
            {/* Rotating ring */}
            <div
              className="absolute inset-[-3px] rounded-full border border-dashed opacity-30 animate-spin-slow"
              style={{ borderColor: `${ac.color} / 0.4` }}
            />
          </div>
          {/* Value */}
          <div
            className="mt-3 font-display text-xl font-black"
            style={{ color: ac.color }}
          >
            {item.value}
          </div>
          {/* Title */}
          <div className="mt-0.5 font-display text-[11px] font-bold tracking-wide text-foreground">
            {item.title}
          </div>
          {/* Detail */}
          <div className="mt-1 font-mono text-[8px] leading-tight tracking-[0.1em] text-muted-foreground">
            {item.detail}
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

export function Achievements() {
  return (
    <section id="achievements" className="relative px-4 py-16 sm:py-20">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-60 w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.82_0.22_165/0.04)] blur-3xl" />

      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center gap-3"
        >
          <Award className="h-5 w-5 text-[oklch(0.82_0.22_165)]" />
          <h2 className="font-display text-lg font-black tracking-wide sm:text-xl">
            ACHIEVEMENT INsignIA
          </h2>
          <span className="h-px flex-1 bg-gradient-to-r from-[oklch(0.82_0.22_165/0.4)] to-transparent" />
          <span className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground">
            {PROFILE.achievements.length} BADGES
          </span>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {PROFILE.achievements.map((item, i) => (
            <AchievementBadge key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
