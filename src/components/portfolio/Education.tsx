"use client"

import { motion } from "framer-motion"
import { BookOpen, GraduationCap, MapPin, School } from "lucide-react"
import SectionHeading from "./SectionHeading"
import Reveal from "./Reveal"
import { EDUCATION } from "@/lib/portfolio-data"

const EDUCATION_ICONS = {
  School,
  BookOpen,
  GraduationCap,
} as const

type EducationIconName = keyof typeof EDUCATION_ICONS

const ACCENT_TAG_STYLES: Record<string, string> = {
  violet: "border-violet-400/30 text-violet-200",
  fuchsia: "border-fuchsia-400/30 text-fuchsia-200",
  amber: "border-amber-300/30 text-amber-200",
}

export default function Education() {
  return (
    <section id="education" className="relative overflow-hidden py-24 sm:py-32">
      {/* Ambient layers */}
      <div className="grid-bg absolute inset-0 opacity-50" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-0 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -left-24 bottom-10 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="education"
          title={
            <>
              Edu<span className="text-gradient">cation</span>
            </>
          }
        />

        <div className="relative mt-16 lg:mt-20">
          {/* timeline track */}
          <div
            className="absolute bottom-0 left-5 top-0 w-px bg-white/10 lg:left-1/2 lg:-translate-x-1/2"
            aria-hidden="true"
          />
          {/* animated gradient line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="glow-violet absolute bottom-0 left-5 top-0 w-px origin-top bg-gradient-to-b from-violet-400 via-fuchsia-400 to-amber-300 lg:left-1/2 lg:-translate-x-1/2"
            aria-hidden="true"
          />

          {EDUCATION.map((entry, i) => {
            const onLeft = i % 2 === 0
            const Icon = EDUCATION_ICONS[entry.icon as EducationIconName] ?? GraduationCap

            return (
              <div
                key={entry.school}
                className="relative mb-12 pl-14 last:mb-0 lg:mb-16 lg:grid lg:grid-cols-2 lg:gap-12 lg:pl-0"
              >
                {/* node dot */}
                <div
                  className="absolute left-5 top-7 z-10 -translate-x-1/2 lg:left-1/2"
                  aria-hidden="true"
                >
                  <div className="animate-pulse-glow flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-fuchsia-400 bg-background">
                    <div className="h-1 w-1 rounded-full bg-amber-300" />
                  </div>
                </div>

                <Reveal
                  delay={i * 0.12}
                  className={
                    onLeft
                      ? "lg:col-start-1 lg:row-start-1 lg:pr-12"
                      : "lg:col-start-2 lg:row-start-1 lg:pl-12"
                  }
                >
                  <article
                    className={`glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-400/40 ${
                      onLeft ? "lg:text-right" : "lg:text-start"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-4 ${
                        onLeft ? "lg:flex-row-reverse" : ""
                      }`}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                        <Icon className="h-5 w-5 text-fuchsia-300" aria-hidden="true" />
                      </div>
                      <span className="chip ml-auto shrink-0">{entry.period}</span>
                    </div>

                    <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-fuchsia-300">
                      {entry.level}
                    </p>
                    <h3 className="font-display mt-1.5 text-lg font-semibold sm:text-xl">
                      {entry.school}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0 text-amber-300" aria-hidden="true" />
                      {entry.place}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {entry.description}
                    </p>

                    <div
                      className={`mt-4 flex flex-wrap gap-2 ${
                        onLeft ? "lg:justify-end" : ""
                      }`}
                    >
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`chip text-[10px] ${
                            ACCENT_TAG_STYLES[entry.accent] ?? ""
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                </Reveal>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
