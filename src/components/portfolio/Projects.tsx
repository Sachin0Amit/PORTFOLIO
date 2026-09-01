"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FolderGit2, ArrowUpRight, Cpu, Globe, Cloud, Map } from "lucide-react";
import { PROFILE } from "@/lib/portfolio-data";
import type { Profile } from "@/lib/portfolio-data";
import { SectionHeading } from "./SectionHeading";
import { TiltCard } from "@/components/effects/TiltCard";
import { ProjectDialog } from "./ProjectDialog";

type Project = Profile["projects"][number];

const STACK_ICONS: Record<string, typeof Cpu> = {
  "Next.js": Cpu,
  React: Cpu,
  TypeScript: Cpu,
  JavaScript: Cpu,
  "Socket.IO": Globe,
  "Tailwind": Cpu,
  "Web Crypto": Cpu,
  Recharts: Cpu,
  "REST APIs": Globe,
  "Mapbox": Map,
  Prisma: Cpu,
};

const accentMap = {
  alien: { color: "oklch(0.82 0.22 165)", bg: "bg-[oklch(0.82_0.22_165/0.12)]" },
  cyan: { color: "oklch(0.78 0.20 195)", bg: "bg-[oklch(0.78_0.20_195/0.12)]" },
  plasma: { color: "oklch(0.72 0.25 320)", bg: "bg-[oklch(0.72_0.25_320/0.12)]" },
} as const;

// `Cloud` is referenced to keep the import meaningful for future weather icons.
void Cloud;

export function Projects() {
  const [featured, ...rest] = PROFILE.projects;
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" className="relative px-4 py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-80 w-80 rounded-full bg-[oklch(0.78_0.20_195/0.05)] blur-3xl" />

      <div className="mx-auto max-w-5xl">
        <SectionHeading
          index="07 // ARCHIVE"
          title="PROJECT ARCHIVE"
          subtitle="Selected builds from the engineering bay — each one a transmission from the workshop."
          accent="cyan"
        />

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Featured project — large card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="lg:row-span-2"
          >
            <TiltCard max={8} scale={1.03} glareColor={featured.accent} className="h-full">
              <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl glass-panel p-6 sm:p-8">
                <div className="relative flex h-full flex-col">
                  {/* Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{
                        background: `${accentMap[featured.accent].color} / 0.12`,
                        border: `1px solid ${accentMap[featured.accent].color} / 0.3`,
                      } as React.CSSProperties}
                    >
                      <FolderGit2
                        className="h-5 w-5"
                        style={{ color: accentMap[featured.accent].color }}
                      />
                    </span>
                    <span
                      className="rounded-full border px-2.5 py-0.5 font-mono text-[9px] tracking-[0.2em]"
                      style={{
                        borderColor: `${accentMap[featured.accent].color} / 0.4`,
                        color: accentMap[featured.accent].color,
                      } as React.CSSProperties}
                    >
                      ◆ {featured.status}
                    </span>
                  </div>

                  {/* Codename + glyph */}
                  <div className="mb-1 flex items-baseline justify-between">
                    <span
                      className="font-mono text-[10px] tracking-[0.25em]"
                      style={{ color: accentMap[featured.accent].color }}
                    >
                      {featured.codename}
                    </span>
                    <span className="font-display text-3xl font-black text-[oklch(0.82_0.22_165/0.15)]">
                      {featured.glyph}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-black tracking-wide sm:text-3xl">
                    {featured.title}
                  </h3>
                  <p
                    className="mt-1 text-sm font-medium"
                    style={{ color: accentMap[featured.accent].color }}
                  >
                    {featured.tagline}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/75">
                    {featured.description}
                  </p>

                  {/* Stack chips */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {featured.stack.map((tech) => {
                      const Icon = STACK_ICONS[tech] ?? Cpu;
                      return (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-1 rounded-md border border-[oklch(0.82_0.22_165/0.15)] bg-[oklch(0.10_0.02_280/0.5)] px-2 py-0.5 font-mono text-[10px] text-foreground/70"
                        >
                          <Icon className="h-2.5 w-2.5" style={{ color: accentMap[featured.accent].color }} />
                          {tech}
                        </span>
                      );
                    })}
                  </div>

                  {/* Progress + CTA pinned to bottom */}
                  <div className="mt-auto pt-5">
                    <div className="mb-1.5 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                      <span>BUILD PROGRESS</span>
                      <span style={{ color: accentMap[featured.accent].color }}>
                        {featured.progress}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[oklch(0.16_0.04_280)]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${featured.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
                        className="relative h-full rounded-full"
                        style={{ background: accentMap[featured.accent].color }}
                      >
                        <div className="absolute inset-0 animate-shimmer" />
                      </motion.div>
                    </div>
                    <button
                      onClick={() => setSelected(featured)}
                      className="mt-4 flex w-full items-center justify-between rounded-xl border border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.10_0.02_280/0.4)] px-4 py-2.5 transition-all hover:border-[oklch(0.82_0.22_165/0.5)] hover:bg-[oklch(0.82_0.22_165/0.08)]"
                    >
                      <span className="font-display text-sm font-bold tracking-wider">
                        EXPLORE BUILD
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-[oklch(0.82_0.22_165)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Smaller project cards */}
          {rest.map((p, i) => {
            const ac = accentMap[p.accent];
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <TiltCard max={10} scale={1.04} glareColor={p.accent} className="h-full">
                  <button
                    type="button"
                    onClick={() => setSelected(p)}
                    className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl glass-panel p-5 text-left sm:p-6"
                  >
                    <div className="absolute right-3 top-3 font-display text-4xl font-black text-[oklch(0.82_0.22_165/0.08)]">
                      {p.glyph}
                    </div>
                    <div className="relative flex flex-1 flex-col">
                      <div className="mb-3 flex items-center gap-2">
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-lg"
                          style={{
                            background: `${ac.color} / 0.12`,
                            border: `1px solid ${ac.color} / 0.3`,
                          } as React.CSSProperties}
                        >
                          <FolderGit2 className="h-4 w-4" style={{ color: ac.color }} />
                        </span>
                        <span
                          className="font-mono text-[9px] tracking-[0.2em]"
                          style={{ color: ac.color }}
                        >
                          {p.codename}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold tracking-wide">
                        {p.title}
                      </h3>
                      <p className="mt-0.5 text-xs font-medium" style={{ color: ac.color }}>
                        {p.tagline}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-foreground/70">
                        {p.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {p.stack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="rounded border border-[oklch(0.82_0.22_165/0.12)] bg-[oklch(0.10_0.02_280/0.4)] px-1.5 py-0.5 font-mono text-[9px] text-foreground/60"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="flex-1">
                          <div className="mb-1 flex items-center justify-between font-mono text-[8px] tracking-[0.2em] text-muted-foreground">
                            <span>{p.status}</span>
                            <span style={{ color: ac.color }}>{p.progress}%</span>
                          </div>
                          <div className="h-1 w-full overflow-hidden rounded-full bg-[oklch(0.16_0.04_280)]">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${p.progress}%` }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                              className="h-full rounded-full"
                              style={{ background: ac.color }}
                            />
                          </div>
                        </div>
                        <ArrowUpRight className="ml-3 h-4 w-4 shrink-0 text-[oklch(0.82_0.22_165)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </button>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Project detail modal */}
      <ProjectDialog project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
