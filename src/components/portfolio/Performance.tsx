"use client";

import { motion } from "framer-motion";
import { Activity, TrendingUp, Target, Gauge } from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { PROFILE } from "@/lib/portfolio-data";
import { SectionHeading } from "./SectionHeading";
import { TiltCard } from "@/components/effects/TiltCard";

export function Performance() {
  const sgpa = PROFILE.performance.sgpa;
  const pct = Math.round((sgpa / 10) * 100);
  const chartData = [{ name: "SGPA", value: pct, fill: "oklch(0.82 0.22 165)" }];

  return (
    <section id="performance" className="relative px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          index="05 // TELEMETRY"
          title="ACADEMIC TELEMETRY"
          subtitle="First-semester signal readings from the CSE orbit."
          accent="alien"
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* SGPA gauge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl glass-panel p-6 sm:p-8"
          >
            <div className="absolute inset-0 bg-grid-fine opacity-30" />
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[oklch(0.82_0.22_165/0.12)] blur-3xl" />
            <div className="relative w-full">
              <div className="mb-2 flex items-center justify-center gap-2">
                <Gauge className="h-4 w-4 text-[oklch(0.82_0.22_165)]" />
                <span className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground">
                  {PROFILE.performance.label}
                </span>
              </div>
              <div className="relative mx-auto h-56 w-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="72%"
                    outerRadius="100%"
                    data={chartData}
                    startAngle={220}
                    endAngle={-40}
                  >
                    <PolarAngleAxis
                      type="number"
                      domain={[0, 100]}
                      angleAxisId={0}
                      tick={false}
                    />
                    <RadialBar
                      background={{
                        fill: "oklch(0.16 0.04 280 / 0.6)",
                      }}
                      dataKey="value"
                      cornerRadius={20}
                      fill="oklch(0.82 0.22 165)"
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                {/* Center readout */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="font-display text-6xl font-black text-gradient-alien text-glow-alien"
                  >
                    {sgpa}
                  </motion.div>
                  <div className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground">
                    SGPA / 10
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 rounded-full border border-[oklch(0.82_0.22_165/0.3)] bg-[oklch(0.10_0.02_280/0.5)] px-2.5 py-0.5">
                    <TrendingUp className="h-3 w-3 text-[oklch(0.82_0.22_165)]" />
                    <span className="font-mono text-[9px] tracking-[0.2em] text-[oklch(0.82_0.22_165)]">
                      +{pct}% NOMINAL
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                {PROFILE.performance.note}
              </p>
            </div>
          </motion.div>

          {/* Telemetry metrics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {[
              {
                icon: Activity,
                label: "GRADE BAND",
                value: "A",
                sub: "Distinction Tier",
                color: "alien",
              },
              {
                icon: Target,
                label: "TARGET SGPA",
                value: "9.0+",
                sub: "Next Semester",
                color: "plasma",
              },
              {
                icon: TrendingUp,
                label: "PERCENTILE",
                value: "~81%",
                sub: "Performance",
                color: "cyan",
              },
              {
                icon: Gauge,
                label: "CREDITS",
                value: "Active",
                sub: "Full Load",
                color: "alien",
              },
            ].map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
              >
                <TiltCard
                  max={12}
                  scale={1.05}
                  glareColor={m.color as "alien" | "plasma" | "cyan"}
                  className="h-full"
                >
                  <div
                    className={`group relative h-full overflow-hidden rounded-2xl p-5 ${
                      m.color === "plasma" ? "glass-panel-plasma" : "glass-panel"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          m.color === "alien"
                            ? "bg-[oklch(0.82_0.22_165/0.12)]"
                            : m.color === "plasma"
                            ? "bg-[oklch(0.72_0.25_320/0.12)]"
                            : "bg-[oklch(0.78_0.20_195/0.12)]"
                        }`}
                      >
                        <m.icon
                          className={`h-5 w-5 ${
                            m.color === "alien"
                              ? "text-[oklch(0.82_0.22_165)]"
                              : m.color === "plasma"
                              ? "text-[oklch(0.72_0.25_320)]"
                              : "text-[oklch(0.78_0.20_195)]"
                          }`}
                        />
                      </span>
                    </div>
                    <div className="mt-4 font-display text-3xl font-black text-foreground">
                      {m.value}
                    </div>
                    <div className="mt-1 font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                      {m.label}
                    </div>
                    <div className="mt-0.5 text-xs text-foreground/60">{m.sub}</div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}

            {/* Progress bar strip */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="sm:col-span-2 rounded-2xl glass-panel p-4"
            >
              <div className="mb-2 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                <span>GRADE WEIGHT</span>
                <span className="text-[oklch(0.82_0.22_165)]">{pct}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[oklch(0.16_0.04_280)]">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                  className="relative h-full rounded-full bg-gradient-to-r from-[oklch(0.82_0.22_165)] via-[oklch(0.78_0.20_195)] to-[oklch(0.72_0.25_320)]"
                >
                  <div className="absolute inset-0 animate-shimmer" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
