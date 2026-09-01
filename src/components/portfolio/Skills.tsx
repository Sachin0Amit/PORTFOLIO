"use client";

import { motion } from "framer-motion";
import { Cpu, Layers, Zap } from "lucide-react";
import { PROFILE } from "@/lib/portfolio-data";
import { SectionHeading } from "./SectionHeading";
import { TiltCard } from "@/components/effects/TiltCard";

const CAT_ICONS = [Cpu, Layers, Zap];
const CAT_ACCENTS = ["alien", "cyan", "plasma"] as const;

export function Skills() {
  return (
    <section id="skills" className="relative px-4 py-20 sm:py-28">
      <div className="pointer-events-none absolute right-0 top-1/4 h-80 w-80 rounded-full bg-[oklch(0.82_0.22_165/0.05)] blur-3xl" />

      <div className="mx-auto max-w-5xl">
        <SectionHeading
          index="06 // ARSENAL"
          title="TECH ARSENAL"
          subtitle="Tools and frequencies currently loaded into the engineering core."
          accent="alien"
        />

        <div className="grid gap-5 md:grid-cols-3">
          {PROFILE.skills.map((cat, ci) => {
            const Icon = CAT_ICONS[ci % CAT_ICONS.length];
            const accent = CAT_ACCENTS[ci % CAT_ACCENTS.length];
            const accentColor =
              accent === "alien"
                ? "oklch(0.82 0.22 165)"
                : accent === "cyan"
                ? "oklch(0.78 0.20 195)"
                : "oklch(0.72 0.25 320)";
            return (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: ci * 0.1 }}
              >
                <TiltCard
                  max={9}
                  scale={1.04}
                  glareColor={accent}
                  className="h-full"
                >
                  <div className="group relative h-full overflow-hidden rounded-2xl glass-panel p-5 sm:p-6">
                    <div
                      className="absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl opacity-40"
                      style={{ background: `${accentColor} / 0.15)` }}
                    />
                    <div className="relative">
                      <div className="mb-4 flex items-center gap-3">
                        <span
                          className="flex h-10 w-10 items-center justify-center rounded-xl"
                          style={{
                            background: `${accentColor} / 0.12`,
                            border: `1px solid ${accentColor} / 0.3`,
                          } as React.CSSProperties}
                        >
                          <Icon className="h-5 w-5" style={{ color: accentColor }} />
                        </span>
                        <div>
                          <div className="font-display text-sm font-bold tracking-wide">
                            {cat.category}
                          </div>
                          <div
                            className="font-mono text-[9px] tracking-[0.2em]"
                            style={{ color: accentColor }}
                          >
                            MODULE.0{ci + 1}
                          </div>
                        </div>
                      </div>

                      <ul className="space-y-3">
                        {cat.items.map((item, ii) => (
                          <li key={item.name}>
                            <div className="mb-1 flex items-center justify-between">
                              <span className="text-sm font-medium text-foreground/90">
                                {item.name}
                              </span>
                              <span
                                className="font-mono text-[10px] tracking-wider"
                                style={{ color: accentColor }}
                              >
                                {item.level}%
                              </span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[oklch(0.16_0.04_280)]">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${item.level}%` }}
                                viewport={{ once: true }}
                                transition={{
                                  delay: 0.2 + ii * 0.08,
                                  duration: 0.9,
                                  ease: "easeOut",
                                }}
                                className="relative h-full rounded-full"
                                style={{
                                  background: `linear-gradient(90deg, ${accentColor}, ${accentColor.replace(
                                    /0\.\d+\)$/,
                                    "0.5)"
                                  )})`,
                                }}
                              >
                                <div className="absolute inset-0 animate-shimmer" />
                              </motion.div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* Marquee strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="relative mt-8 overflow-hidden rounded-2xl border border-[oklch(0.82_0.22_165/0.15)] bg-[oklch(0.08_0.02_280/0.5)] py-4"
        >
          <div className="flex animate-[scroll_30s_linear_infinite] gap-8 whitespace-nowrap">
            {[
              "C", "C++", "Python", "JavaScript", "HTML", "CSS", "Git",
              "Linux", "Data Structures", "Algorithms", "OOP", "React",
              "Next.js", "SQL", "Problem Solving",
              "C", "C++", "Python", "JavaScript", "HTML", "CSS", "Git",
              "Linux", "Data Structures", "Algorithms", "OOP", "React",
              "Next.js", "SQL", "Problem Solving",
            ].map((t, i) => (
              <span
                key={i}
                className="font-display text-sm font-bold tracking-[0.2em] text-muted-foreground/60"
              >
                {t}
                <span className="ml-8 text-[oklch(0.82_0.22_165/0.4)]">◆</span>
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
