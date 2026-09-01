"use client";

import { motion } from "framer-motion";
import { Rocket, Languages, Briefcase, ArrowUpRight } from "lucide-react";
import { PROFILE } from "@/lib/portfolio-data";
import { SectionHeading } from "./SectionHeading";
import { TiltCard } from "@/components/effects/TiltCard";

const ICONS = [Briefcase, Languages, Languages];

export function Goals() {
  return (
    <section id="goals" className="relative px-4 py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/4 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[oklch(0.72_0.25_320/0.06)] blur-3xl" />

      <div className="mx-auto max-w-5xl">
        <SectionHeading
          index="10 // MISSIONS"
          title="FUTURE MISSIONS"
          subtitle="Calibrated objectives for the next orbital cycles."
          accent="plasma"
        />

        <div className="grid gap-5 md:grid-cols-3">
          {PROFILE.goals.map((goal, i) => {
            const Icon = ICONS[i % ICONS.length];
            const isLang = goal.codename.startsWith("FREQ");
            const accent = isLang ? "plasma" : "alien";
            const accentColor =
              accent === "alien"
                ? "oklch(0.82 0.22 165)"
                : "oklch(0.72 0.25 320)";
            return (
              <motion.div
                key={goal.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
              >
                <TiltCard
                  max={10}
                  scale={1.04}
                  glareColor={accent as "alien" | "plasma"}
                  className="h-full"
                >
                  <div className="group relative h-full overflow-hidden rounded-2xl glass-panel p-6 holo-border">
                    {/* Mission number watermark */}
                    <div className="absolute -right-2 -top-4 font-display text-7xl font-black text-[oklch(0.82_0.22_165/0.06)]">
                      0{i + 1}
                    </div>

                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <span
                          className="flex h-11 w-11 items-center justify-center rounded-xl"
                          style={{
                            background: `${accentColor} / 0.12`,
                            border: `1px solid ${accentColor} / 0.3`,
                          } as React.CSSProperties}
                        >
                          <Icon
                            className="h-5 w-5"
                            style={{ color: accentColor }}
                          />
                        </span>
                        <span
                          className="rounded-full border px-2.5 py-0.5 font-mono text-[9px] tracking-[0.2em]"
                          style={{
                            borderColor: `${accentColor} / 0.4`,
                            color: accentColor,
                          } as React.CSSProperties}
                        >
                          {goal.eta}
                        </span>
                      </div>

                      <div
                        className="mt-4 font-mono text-[10px] tracking-[0.25em]"
                        style={{ color: accentColor }}
                      >
                        {goal.codename}
                      </div>
                      <h3 className="mt-1 font-display text-lg font-bold tracking-wide">
                        {goal.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/75">
                        {goal.description}
                      </p>

                      {/* Progress */}
                      <div className="mt-5">
                        <div className="mb-1.5 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                          <span>PROGRESS</span>
                          <span style={{ color: accentColor }}>
                            {goal.progress}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[oklch(0.16_0.04_280)]">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${goal.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
                            className="relative h-full rounded-full"
                            style={{ background: accentColor }}
                          >
                            <div
                              className="absolute inset-0 animate-shimmer"
                              style={{
                                background: `linear-gradient(90deg, transparent, ${accentColor.replace(
                                  /0\.\d+\)$/,
                                  "0.5)"
                                )}, transparent)`,
                              }}
                            />
                          </motion.div>
                        </div>
                      </div>

                      <button
                        className="mt-5 flex w-full items-center justify-between rounded-xl border border-[oklch(0.82_0.22_165/0.15)] bg-[oklch(0.10_0.02_280/0.4)] px-3 py-2 text-left transition-all hover:border-[oklch(0.82_0.22_165/0.4)]"
                      >
                        <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                          TRACK MISSION
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-[oklch(0.82_0.22_165)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </button>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* Vision banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mt-8 overflow-hidden rounded-2xl border border-[oklch(0.82_0.22_165/0.2)] bg-gradient-to-br from-[oklch(0.10_0.04_280/0.8)] via-[oklch(0.08_0.02_280/0.6)] to-[oklch(0.12_0.04_320/0.6)] p-6 sm:p-8"
        >
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[oklch(0.82_0.22_165/0.1)] blur-3xl" />
          <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[oklch(0.82_0.22_165/0.4)] bg-[oklch(0.10_0.02_280)]">
              <Rocket className="h-6 w-6 text-[oklch(0.82_0.22_165)] animate-flicker" />
            </span>
            <div className="flex-1">
              <div className="font-mono text-[10px] tracking-[0.25em] text-[oklch(0.78_0.20_195)] text-glow-cyan">
                ULTIMATE VECTOR
              </div>
              <p className="mt-1 font-display text-lg font-bold tracking-wide sm:text-xl">
                Become a{" "}
                <span className="text-gradient-alien">software engineer</span>{" "}
                who ships code across continents — and one day, across stars.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
