"use client";

import { motion } from "framer-motion";
import { School, BookOpen, Rocket, MapPin } from "lucide-react";
import { PROFILE } from "@/lib/portfolio-data";
import { SectionHeading } from "./SectionHeading";
import { TiltCard } from "@/components/effects/TiltCard";

const ICONS = [School, BookOpen, Rocket];

export function Education() {
  return (
    <section id="education" className="relative px-4 py-20 sm:py-28">
      {/* Section ambient */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-[oklch(0.72_0.25_320/0.06)] blur-3xl" />

      <div className="mx-auto max-w-5xl">
        <SectionHeading
          index="03 // JOURNEY.LOG"
          title="EDUCATIONAL TRAJECTORY"
          subtitle="From origin-seed to stellar dock — each waypoint recalibrated my trajectory."
          accent="plasma"
        />

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-[oklch(0.82_0.22_165/0.6)] via-[oklch(0.78_0.20_195/0.4)] to-[oklch(0.72_0.25_320/0.3)] sm:left-1/2 sm:-translate-x-1/2" />

          <div className="space-y-8 sm:space-y-12">
            {PROFILE.education.map((edu, i) => {
              const Icon = ICONS[i % ICONS.length];
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={edu.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className={`relative flex items-start gap-6 pl-12 sm:pl-0 ${
                    isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* Node */}
                  <div className="absolute left-4 top-1 z-10 -translate-x-1/2 sm:left-1/2">
                    <div className="relative">
                      <span className="absolute inset-0 -m-2 animate-ping rounded-full bg-[oklch(0.82_0.22_165/0.3)]" />
                      <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[oklch(0.82_0.22_165/0.5)] bg-[oklch(0.10_0.02_280)]">
                        <Icon className="h-4 w-4 text-[oklch(0.82_0.22_165)]" />
                      </span>
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 sm:max-w-[calc(50%-2.5rem)]">
                    <TiltCard max={8} scale={1.03} glareColor="cyan" className="h-full">
                      <div className="group relative h-full overflow-hidden rounded-2xl glass-panel p-5 sm:p-6">
                        <div className="absolute right-3 top-3 font-display text-5xl font-black text-[oklch(0.82_0.22_165/0.08)] transition-colors group-hover:text-[oklch(0.82_0.22_165/0.15)]">
                          {edu.glyph}
                        </div>
                        <div className="relative">
                          <span className="font-mono text-[10px] tracking-[0.25em] text-[oklch(0.78_0.20_195)] text-glow-cyan">
                            {edu.phase}
                          </span>
                          <h3 className="mt-1.5 font-display text-lg font-bold tracking-wide sm:text-xl">
                            {edu.title}
                          </h3>
                          <div className="mt-1 font-medium text-[oklch(0.82_0.22_165)]">
                            {edu.place}
                          </div>
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {edu.location}
                            <span className="mx-1 text-[oklch(0.72_0.25_320)]">•</span>
                            {edu.period}
                          </div>
                          <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                            {edu.detail}
                          </p>
                        </div>
                        {/* Bottom accent bar */}
                        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[oklch(0.82_0.22_165/0.6)] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </TiltCard>
                  </div>

                  {/* Spacer for the other side (desktop) */}
                  <div className="hidden flex-1 sm:block sm:max-w-[calc(50%-2.5rem)]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
