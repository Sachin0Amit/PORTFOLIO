"use client"

import { useEffect, useRef, useState } from "react"
import { animate, useInView } from "framer-motion"
import { GraduationCap, School, Trophy, CalendarDays } from "lucide-react"
import SectionHeading from "./SectionHeading"
import Reveal from "./Reveal"
import { HERO_STATS, PERSONAL } from "@/lib/portfolio-data"

interface StatCounterProps {
  value: number
  decimals: number
  suffix: string
  label: string
}

function StatCounter({ value, decimals, suffix, label }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const [display, setDisplay] = useState((0).toFixed(decimals))

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.21, 0.47, 0.32, 0.98],
      onUpdate: (latest) => setDisplay(latest.toFixed(decimals)),
    })
    return () => controls.stop()
  }, [inView, value, decimals])

  return (
    <div ref={ref} className="flex flex-col items-center gap-1.5 text-center">
      <span className="font-display text-2xl font-bold tabular-nums sm:text-3xl">
        {display}
        {suffix ? <span className="text-gradient-warm">{suffix}</span> : null}
      </span>
      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

const QUICK_FACTS = [
  { label: "Degree", value: "B.Tech CSE", icon: GraduationCap },
  { label: "Year", value: "2nd Year", icon: CalendarDays },
  { label: "College", value: "GEC Sheikhpura", icon: School },
  { label: "Sem 1 SGPA", value: "8.1 / 10", icon: Trophy },
]

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden py-24 sm:py-32">
      {/* Ambient layers */}
      <div className="star-field absolute inset-0 opacity-40" aria-hidden="true" />
      <div
        className="absolute -left-32 top-24 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -right-24 bottom-12 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="about" title={<>About <span className="text-gradient">Me</span></>} />

        <Reveal className="mx-auto mt-14 max-w-3xl">
          <div className="space-y-4">
            {PERSONAL.bio.map((paragraph, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "leading-relaxed text-foreground/90"
                    : "leading-relaxed text-muted-foreground"
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* quick facts */}
          <div className="mt-10 grid grid-cols-2 gap-3">
            {QUICK_FACTS.map((fact) => (
              <div key={fact.label} className="glass rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  <fact.icon className="h-3.5 w-3.5 text-fuchsia-300" aria-hidden="true" />
                  {fact.label}
                </div>
                <p className="mt-1.5 text-sm font-medium">{fact.value}</p>
              </div>
            ))}
          </div>

          {/* animated stats */}
          <div className="glass mt-8 grid grid-cols-2 gap-3 rounded-2xl p-5 sm:grid-cols-4">
            {HERO_STATS.map((stat) => (
              <StatCounter
                key={stat.label}
                value={stat.value}
                decimals={stat.decimals}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
