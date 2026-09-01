"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Activity, Crosshair, Gauge, Radio, TrendingUp } from "lucide-react";
import { PROFILE } from "@/lib/portfolio-data";
import { SectionHeading } from "./SectionHeading";

/* ================= gauge geometry ================= */
const START = -120; // degrees, clockwise from 12 o'clock
const SWEEP = 240;
const CX = 100;
const CY = 100;
const R = 76;

function polar(angle: number, radius: number) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: CX + radius * Math.sin(rad),
    y: CY - radius * Math.cos(rad),
  };
}

function arcPath(start: number, end: number, radius: number) {
  const s = polar(start, radius);
  const e = polar(end, radius);
  const large = Math.abs(end - start) > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${radius} ${radius} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

const ARC_D = arcPath(START, START + SWEEP, R);

/* Round SVG coords to 2 decimals — avoids SSR/client float drift (hydration mismatch) */
const r2 = (n: number) => n.toFixed(2);

const TICKS = Array.from({ length: 21 }, (_, i) => {
  const angle = START + (SWEEP * i) / 20;
  const outer = polar(angle, R - 6);
  const inner = polar(angle, i % 2 === 0 ? R - 20 : R - 14);
  return {
    major: i % 2 === 0,
    value: i / 2,
    active: i / 2 <= PROFILE.performance.sgpa,
    x1: r2(outer.x),
    y1: r2(outer.y),
    x2: r2(inner.x),
    y2: r2(inner.y),
  };
});

/* Periodic EKG-style waveform (150px period, 40px tall) */
function buildWaveD(periods: number) {
  let d = "";
  for (let k = 0; k < periods; k++) {
    const o = k * 150;
    d += `M ${o} 20 H ${o + 36} L ${o + 40} 12 L ${o + 44} 26 L ${o + 48} 20 H ${o + 96} L ${o + 100} 4 L ${o + 105} 32 L ${o + 110} 20 H ${o + 150} `;
  }
  return d;
}
const WAVE_D = buildWaveD(4);

/* ================= readout rows ================= */
const READOUT = [
  { idx: "01", label: "SEMESTER", value: "01 / 08", tone: "alien" },
  { idx: "02", label: "GRADE BAND", value: "A · DISTINCTION", tone: "alien" },
  { idx: "03", label: "PERCENTILE", value: "~81%", tone: "cyan" },
  { idx: "04", label: "TARGET SGPA", value: "9.0+", tone: "plasma" },
  { idx: "05", label: "CREDIT LOAD", value: "FULL", tone: "muted" },
  { idx: "06", label: "STATUS", value: "NOMINAL", tone: "alien" },
] as const;

const TONE_TEXT: Record<(typeof READOUT)[number]["tone"], string> = {
  alien: "text-[oklch(0.82_0.22_165)]",
  cyan: "text-[oklch(0.78_0.20_195)]",
  plasma: "text-[oklch(0.72_0.25_320)]",
  muted: "text-foreground/80",
};

/* ================= hooks ================= */
function useCountUp(target: number, active: boolean, duration = 1700) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased * 10) / 10);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

function useClock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString("en-GB", { hour12: false }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ================= component ================= */
export function Performance() {
  const sgpa = PROFILE.performance.sgpa;
  const frac = sgpa / 10;
  const pct = Math.round(frac * 100);
  const needleAngle = START + SWEEP * frac;
  const targetAngle = START + SWEEP * 0.9;
  const endP = {
    cx: r2(polar(needleAngle, R).x),
    cy: r2(polar(needleAngle, R).y),
  };
  const clock = useClock();
  const consoleRef = useRef<HTMLDivElement>(null);
  const inView = useInView(consoleRef, { once: true, margin: "-100px" });
  const count = useCountUp(sgpa, inView);

  return (
    <section id="performance" className="relative px-4 py-20 sm:py-28">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-16 h-64 w-72 -translate-x-1/2 rounded-full bg-[oklch(0.82_0.22_165/0.05)] blur-3xl" />

      <div className="mx-auto max-w-5xl">
        <SectionHeading
          index="05 // TELEMETRY"
          title="ACADEMIC TELEMETRY"
          subtitle="First-semester signal readings, streamed live from the CSE orbit."
          accent="alien"
        />

        <motion.div
          ref={consoleRef}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* HUD corner brackets */}
          <span aria-hidden className="pointer-events-none absolute -left-1.5 -top-1.5 h-5 w-5 border-l-2 border-t-2 border-[oklch(0.82_0.22_165/0.7)]" />
          <span aria-hidden className="pointer-events-none absolute -right-1.5 -top-1.5 h-5 w-5 border-r-2 border-t-2 border-[oklch(0.82_0.22_165/0.7)]" />
          <span aria-hidden className="pointer-events-none absolute -bottom-1.5 -left-1.5 h-5 w-5 border-b-2 border-l-2 border-[oklch(0.82_0.22_165/0.7)]" />
          <span aria-hidden className="pointer-events-none absolute -bottom-1.5 -right-1.5 h-5 w-5 border-b-2 border-r-2 border-[oklch(0.82_0.22_165/0.7)]" />

          {/* Console shell */}
          <div className="relative overflow-hidden rounded-2xl border border-[oklch(0.82_0.22_165/0.18)] bg-[oklch(0.09_0.02_280/85)] shadow-[0_0_60px_oklch(0.82_0.22_165/0.07)] backdrop-blur-md">
            {/* Texture overlays */}
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-fine opacity-40" />
            <div aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-60" />
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.82_0.22_165/0.6)] to-transparent" />

            {/* ===== Console header strip ===== */}
            <div className="relative flex items-center gap-3 border-b border-white/5 bg-[oklch(0.13_0.04_280/60)] px-4 py-2.5 sm:px-5">
              <div className="flex items-center gap-1.5" aria-hidden>
                <span className="h-2 w-2 animate-flicker rounded-full bg-[oklch(0.65_0.24_25/0.9)]" />
                <span
                  className="h-2 w-2 animate-blink rounded-full bg-[oklch(0.75_0.22_90/0.9)]"
                  style={{ animationDelay: "0.35s" }}
                />
                <span className="h-2 w-2 animate-pulse rounded-full bg-[oklch(0.82_0.22_165)]" />
              </div>
              <span className="hidden font-mono text-[10px] tracking-[0.28em] text-foreground/60 sm:inline">
                ACAD.SYS // SEMESTER FEED
              </span>
              <div className="ml-auto flex items-center gap-3 sm:gap-4">
                <span className="hidden font-mono text-[10px] tracking-[0.2em] text-muted-foreground md:inline">
                  SYS.TIME {clock}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.25em] text-[oklch(0.82_0.22_165)]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.82_0.22_165/0.7)]" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[oklch(0.82_0.22_165)]" />
                  </span>
                  LIVE
                </span>
              </div>
            </div>

            {/* ===== Main instrument grid ===== */}
            <div className="relative grid lg:grid-cols-[1.15fr_1fr]">
              {/* --- Gauge panel --- */}
              <div className="relative p-5 pb-6 sm:p-8">
                <div aria-hidden className="absolute -left-10 top-12 h-36 w-36 rounded-full bg-[oklch(0.82_0.22_165/0.08)] blur-3xl" />

                <div className="relative mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-muted-foreground">
                    <Gauge className="h-3.5 w-3.5 text-[oklch(0.82_0.22_165)]" />
                    {PROFILE.performance.label}
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50">
                    CH·01
                  </span>
                </div>

                {/* Speedometer SVG */}
                <div className="relative mx-auto w-full max-w-[300px]">
                  <svg
                    viewBox="0 0 200 200"
                    role="img"
                    aria-label={`SGPA gauge reading ${sgpa} out of 10`}
                    className="h-auto w-full"
                  >
                    <defs>
                      <linearGradient id="perfArcGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="oklch(0.78 0.20 195)" />
                        <stop offset="55%" stopColor="oklch(0.82 0.22 165)" />
                        <stop offset="100%" stopColor="oklch(0.72 0.25 320)" />
                      </linearGradient>
                      <filter id="perfGlow" x="-60%" y="-60%" width="220%" height="220%">
                        <feGaussianBlur stdDeviation="2.6" result="b" />
                        <feMerge>
                          <feMergeNode in="b" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Target zone (9.0 -> 10), dashed plasma */}
                    <path
                      d={arcPath(targetAngle, START + SWEEP, R + 10)}
                      fill="none"
                      stroke="oklch(0.72 0.25 320 / 0.55)"
                      strokeWidth="1.5"
                      strokeDasharray="3 4"
                      strokeLinecap="round"
                    />
                    <text
                      x={r2(polar(START + SWEEP * 0.94, R + 22).x)}
                      y={r2(polar(START + SWEEP * 0.94, R + 22).y)}
                      textAnchor="middle"
                      fontSize="5.5"
                      fill="oklch(0.72 0.25 320 / 0.8)"
                      style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                    >
                      TGT
                    </text>

                    {/* Track arc */}
                    <path
                      d={ARC_D}
                      fill="none"
                      stroke="oklch(0.17 0.04 280)"
                      strokeWidth="9"
                      strokeLinecap="round"
                    />

                    {/* Value arc (animated fill) */}
                    <motion.path
                      d={ARC_D}
                      fill="none"
                      stroke="url(#perfArcGrad)"
                      strokeWidth="9"
                      strokeLinecap="round"
                      filter="url(#perfGlow)"
                      initial={{ pathLength: 0 }}
                      animate={inView ? { pathLength: frac } : { pathLength: 0 }}
                      transition={{ duration: 1.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />

                    {/* Tick marks — brighter up to current value */}
                    {TICKS.map((t, i) => (
                      <line
                        key={i}
                        x1={t.x1}
                        y1={t.y1}
                        x2={t.x2}
                        y2={t.y2}
                        stroke={
                          t.active
                            ? "oklch(0.82 0.22 165 / 0.85)"
                            : "oklch(0.45 0.04 280)"
                        }
                        strokeWidth={t.major ? 1.7 : 1}
                        strokeLinecap="round"
                      />
                    ))}

                    {/* Scale numbers */}
                    {[0, 2, 4, 6, 8, 10].map((v) => {
                      const p = polar(START + (SWEEP * v) / 10, R - 33);
                      return (
                        <text
                          key={v}
                          x={r2(p.x)}
                          y={r2(p.y + 3)}
                          textAnchor="middle"
                          fontSize="9"
                          fill={
                            v === 8
                              ? "oklch(0.82 0.22 165)"
                              : v === 10
                              ? "oklch(0.72 0.25 320 / 0.8)"
                              : "oklch(0.52 0.04 280)"
                          }
                          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                        >
                          {v}
                        </text>
                      );
                    })}

                    {/* Needle */}
                    <motion.g
                      initial={{ rotate: START }}
                      animate={inView ? { rotate: needleAngle } : { rotate: START }}
                      transition={{ delay: 0.55, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        transformOrigin: "100px 100px",
                        transformBox: "view-box",
                      }}
                    >
                      <line
                        x1={CX}
                        y1={CY + 13}
                        x2={CX}
                        y2={CY - 58}
                        stroke="oklch(0.95 0.01 200 / 0.95)"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        filter="url(#perfGlow)"
                      />
                      <line
                        x1={CX}
                        y1={CY + 13}
                        x2={CX}
                        y2={CY - 58}
                        stroke="oklch(0.82 0.22 165 / 0.8)"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                      />
                    </motion.g>

                    {/* Hub */}
                    <circle
                      cx={CX}
                      cy={CY}
                      r="7"
                      fill="oklch(0.10 0.02 280)"
                      stroke="oklch(0.82 0.22 165 / 0.55)"
                      strokeWidth="1.5"
                    />
                    <circle cx={CX} cy={CY} r="2.4" fill="oklch(0.82 0.22 165)" />

                    {/* Endpoint pulse */}
                    <motion.circle
                      cx={endP.cx}
                      cy={endP.cy}
                      r="9"
                      fill="none"
                      stroke="oklch(0.82 0.22 165 / 0.7)"
                      strokeWidth="1.4"
                      initial={{ opacity: 0 }}
                      animate={
                        inView
                          ? { opacity: [0.7, 0], scale: [0.4, 1.6] }
                          : { opacity: 0 }
                      }
                      transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    />
                    <circle
                      cx={endP.cx}
                      cy={endP.cy}
                      r="4"
                      fill="oklch(0.82 0.22 165)"
                      filter="url(#perfGlow)"
                    />
                  </svg>
                </div>

                {/* Digital readout */}
                <div className="relative mt-3 flex flex-col items-center">
                  <div className="flex items-end gap-2">
                    <motion.span
                      initial={{ opacity: 0, y: 8 }}
                      animate={inView ? { opacity: 1, y: 0 } : undefined}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="font-display text-5xl font-black leading-none text-gradient-alien text-glow-alien"
                    >
                      {count.toFixed(1)}
                    </motion.span>
                    <span className="pb-0.5 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                      SGPA / 10.0
                    </span>
                  </div>
                  <span className="mt-3 flex items-center gap-1.5 rounded-full border border-[oklch(0.82_0.22_165/0.3)] bg-[oklch(0.82_0.22_165/0.08)] px-3 py-1 font-mono text-[9px] tracking-[0.2em] text-[oklch(0.82_0.22_165)]">
                    <TrendingUp className="h-3 w-3" />
                    GRADE A · {pct}% NOMINAL
                  </span>
                  <p className="mt-3 max-w-xs text-center text-xs leading-relaxed text-muted-foreground">
                    {PROFILE.performance.note}
                  </p>
                </div>
              </div>

              {/* --- Data readout panel --- */}
              <div className="relative flex flex-col border-t border-white/5 lg:border-t-0 lg:border-l">
                <div className="flex items-center gap-2 border-b border-white/5 px-5 pb-3 pt-4 sm:px-6">
                  <Crosshair className="h-3.5 w-3.5 text-[oklch(0.78_0.20_195)]" />
                  <span className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground">
                    DATA READOUT
                  </span>
                  <span className="ml-auto font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50">
                    06 ROWS
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-center">
                  {READOUT.map((r, i) => (
                    <motion.div
                      key={r.idx}
                      initial={{ opacity: 0, x: 24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.45, delay: 0.1 + i * 0.07 }}
                      className="group relative flex items-baseline gap-2 border-b border-white/5 px-5 py-3 transition-colors last:border-b-0 hover:bg-[oklch(0.82_0.22_165/0.04)] sm:gap-3 sm:px-6"
                    >
                      {/* hover accent bar */}
                      <span
                        aria-hidden
                        className="absolute left-0 top-0 h-full w-[2px] origin-bottom scale-y-0 bg-[oklch(0.82_0.22_165/0.7)] transition-transform duration-300 group-hover:scale-y-100"
                      />
                      <span className="font-mono text-[9px] text-muted-foreground/50">
                        {r.idx}
                      </span>
                      <span className="shrink-0 font-mono text-[10px] tracking-[0.18em] text-foreground/70 sm:text-[11px]">
                        {r.label}
                      </span>
                      <span
                        aria-hidden
                        className="mx-1 flex-1 -translate-y-[3px] border-b border-dotted border-white/15"
                      />
                      {r.label === "STATUS" ? (
                        <span
                          className={`flex shrink-0 items-center gap-1.5 font-display text-sm font-bold ${TONE_TEXT[r.tone]}`}
                        >
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.82_0.22_165/0.8)]" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[oklch(0.82_0.22_165)]" />
                          </span>
                          {r.value}
                        </span>
                      ) : (
                        <span
                          className={`shrink-0 font-display text-sm font-bold tracking-wide ${TONE_TEXT[r.tone]}`}
                        >
                          {r.value}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== Waveform strip ===== */}
            <div className="relative border-t border-white/5">
              <div className="relative h-9 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_14%,black_86%,transparent)]">
                <div className="wave-track absolute inset-y-0 left-0 w-[200%]">
                  <svg viewBox="0 0 600 40" preserveAspectRatio="none" className="h-full w-full">
                    <path
                      d={WAVE_D}
                      fill="none"
                      stroke="oklch(0.82 0.22 165 / 0.55)"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
                <div className="wave-track-slow absolute inset-y-0 left-0 w-[200%]">
                  <svg viewBox="0 0 600 40" preserveAspectRatio="none" className="h-full w-full">
                    <path
                      d={WAVE_D}
                      fill="none"
                      stroke="oklch(0.72 0.25 320 / 0.3)"
                      strokeWidth="1"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              </div>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-[oklch(0.07_0.02_280/0.9)] px-1.5 py-0.5 font-mono text-[9px] tracking-[0.25em] text-[oklch(0.82_0.22_165)]">
                SIGNAL·OK
              </span>
            </div>

            {/* ===== Program tracker ===== */}
            <div className="relative border-t border-white/5 p-5 sm:p-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-muted-foreground">
                  <Radio className="h-3.5 w-3.5 text-[oklch(0.78_0.20_195)]" />
                  B.TECH CSE — PROGRAM TRACK
                </span>
                <span className="shrink-0 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50">
                  01 / 08 RECORDED
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-8 gap-1 sm:gap-1.5"
              >
                {Array.from({ length: 8 }, (_, i) => {
                  const state = i === 0 ? "done" : i === 1 ? "live" : "queued";
                  return (
                    <div
                      key={i}
                      title={
                        state === "done"
                          ? "Semester 1 — 8.1 SGPA recorded"
                          : state === "live"
                          ? "Semester 2 — in progress"
                          : `Semester ${i + 1} — queued`
                      }
                      className={
                        state === "done"
                          ? "relative flex h-11 items-center justify-center rounded-md border border-[oklch(0.82_0.22_165/0.5)] bg-gradient-to-b from-[oklch(0.82_0.22_165/0.28)] to-[oklch(0.82_0.22_165/0.1)] font-display text-xs font-bold text-[oklch(0.88_0.2_165)] shadow-[0_0_16px_oklch(0.82_0.22_165/0.25)] sm:h-12"
                          : state === "live"
                          ? "stripe-live relative flex h-11 items-center justify-center rounded-md border border-[oklch(0.78_0.20_195/0.45)] sm:h-12"
                          : "relative flex h-11 items-center justify-center rounded-md border border-white/10 bg-white/[0.02] font-mono text-[10px] text-muted-foreground/40 sm:h-12"
                      }
                    >
                      {state === "done" && "8.1"}
                      {state === "live" && (
                        <span className="flex items-center gap-1.5 font-mono text-[10px] text-[oklch(0.78_0.20_195)]">
                          <span className="h-1.5 w-1.5 animate-blink rounded-full bg-[oklch(0.78_0.20_195)]" />
                          02
                        </span>
                      )}
                      {state === "queued" && `0${i + 1}`}
                    </div>
                  );
                })}
              </motion.div>

              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-[9px] tracking-[0.12em]">
                <span className="text-[oklch(0.82_0.22_165)]">SEM 01 · 8.1 SGPA</span>
                <span className="text-[oklch(0.78_0.20_195)]">SEM 02 · LIVE</span>
                <span className="hidden text-muted-foreground/60 sm:inline">
                  SEM 03–08 · QUEUED
                </span>
              </div>
            </div>

            {/* ===== Console footer strip ===== */}
            <div className="relative flex items-center justify-between gap-3 border-t border-white/5 px-5 py-2 font-mono text-[9px] tracking-[0.15em] text-muted-foreground/60">
              <span className="truncate">
                CALIBRATION {sgpa.toFixed(1)} / 10.0 · CHANNEL CSE·Y2
              </span>
              <span className="flex shrink-0 items-center gap-1.5 text-[oklch(0.82_0.22_165/0.8)]">
                <Activity className="h-3 w-3" />
                FEED STABLE
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
