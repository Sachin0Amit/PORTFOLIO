"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, GraduationCap, Code2 } from "lucide-react";
import { PROFILE } from "@/lib/portfolio-data";
import { SectionHeading } from "./SectionHeading";
import { TiltCard } from "@/components/effects/TiltCard";

export function About() {
  return (
    <section id="about" className="relative px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          index="02 // BIOGRAPHY"
          title="ABOUT THE UNIT"
          subtitle="Identity dossier of the carbon-based engineer currently orbiting Sheikhpura."
          accent="cyan"
        />

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Bio panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8"
          >
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[oklch(0.78_0.20_195/0.08)] blur-3xl" />
            <div className="relative">
              {/* Terminal header */}
              <div className="mb-5 flex items-center gap-2 border-b border-[oklch(0.82_0.22_165/0.15)] pb-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.65_0.24_25/0.8)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.75_0.22_90/0.8)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.82_0.22_165/0.8)]" />
                </div>
                <span className="ml-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                  /bio/sachin-kumar.log
                </span>
              </div>

              {PROFILE.bio.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
                  className="mb-4 text-[15px] leading-relaxed text-foreground/90 last:mb-0"
                >
                  <span className="mr-2 font-mono text-[oklch(0.82_0.22_165)]">
                    {">"}
                  </span>
                  {p}
                </motion.p>
              ))}

              {/* Inline tags */}
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "CSE Undergrad",
                  "Bihar-Origin",
                  "Polyglot-in-Training",
                  "Open Systems",
                  "Curiosity-Driven",
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.10_0.02_280/0.5)] px-3 py-1 font-mono text-[10px] tracking-[0.15em] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Identity card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <TiltCard max={9} scale={1.03} glareColor="plasma" className="h-full">
              <div className="relative h-full overflow-hidden rounded-2xl glass-panel-plasma p-6 holo-border">
                <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-[oklch(0.72_0.25_320/0.1)] blur-3xl" />
                <div className="relative">
                  {/* Avatar / sigil */}
                  <div className="mb-5 flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[oklch(0.82_0.22_165)] via-[oklch(0.78_0.20_195)] to-[oklch(0.72_0.25_320)] opacity-80 blur-md" />
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[oklch(0.82_0.22_165/0.4)] bg-[oklch(0.08_0.02_280)] font-display text-2xl font-black text-gradient-alien">
                        SK
                      </div>
                    </div>
                    <div>
                      <div className="font-display text-lg font-bold tracking-wide">
                        {PROFILE.name}
                      </div>
                      <div className="font-mono text-[10px] tracking-[0.2em] text-[oklch(0.78_0.20_195)]">
                        {PROFILE.callsign}
                      </div>
                    </div>
                  </div>

                  {/* Data rows */}
                  <ul className="space-y-3">
                    {[
                      {
                        icon: MapPin,
                        label: "ORIGIN",
                        value: PROFILE.origin,
                      },
                      {
                        icon: GraduationCap,
                        label: "DOCKED AT",
                        value: "GEC Sheikhpura",
                      },
                      {
                        icon: Code2,
                        label: "DISCIPLINE",
                        value: "CSE · 2nd Year",
                      },
                      {
                        icon: Calendar,
                        label: "STATUS",
                        value: "Acquiring Knowledge",
                      },
                    ].map((row) => (
                      <li
                        key={row.label}
                        className="flex items-center gap-3 rounded-xl border border-[oklch(0.72_0.25_320/0.15)] bg-[oklch(0.08_0.02_280/0.4)] px-3 py-2.5"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[oklch(0.72_0.25_320/0.12)]">
                          <row.icon className="h-4 w-4 text-[oklch(0.72_0.25_320)]" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                            {row.label}
                          </div>
                          <div className="truncate text-sm font-medium text-foreground">
                            {row.value}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
