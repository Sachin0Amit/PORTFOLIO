"use client"

import { motion } from "framer-motion"
import { Code2, FlaskConical, Globe, Wrench } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SectionHeading from "./SectionHeading"
import Reveal from "./Reveal"
import { CURRENTLY_LEARNING, SKILL_CATEGORIES, type SkillItem } from "@/lib/portfolio-data"

const CATEGORY_ICONS = {
  Code2,
  Globe,
  Wrench,
} as const

type CategoryIconName = keyof typeof CATEGORY_ICONS

interface SkillCardProps {
  skill: SkillItem
  index: number
}

function SkillCard({ skill, index }: SkillCardProps) {
  return (
    <div className="glass rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/40">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium">{skill.name}</span>
        <span className="font-mono text-sm text-fuchsia-300">{skill.level}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={skill.level} aria-valuemin={0} aria-valuemax={100} aria-label={`${skill.name} proficiency`}>
        <motion.div
          initial={{ width: "0%" }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.2, delay: 0.05 * index, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300"
        />
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="relative overflow-hidden py-24 sm:py-32">
      {/* Ambient layers */}
      <div className="star-field absolute inset-0 opacity-30" aria-hidden="true" />
      <div
        className="absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -right-32 bottom-8 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="skills"
          title={
            <>
              My <span className="text-gradient">Skills</span>
            </>
          }
          description="Where I stand today — always improving."
        />

        <Tabs defaultValue={SKILL_CATEGORIES[0].id} className="mt-14 w-full">
          <TabsList className="flex w-full flex-wrap justify-center gap-1 rounded-full border border-white/10 bg-white/5 p-1.5 sm:w-fit">
            {SKILL_CATEGORIES.map((category) => {
              const Icon = CATEGORY_ICONS[category.icon as CategoryIconName] ?? Code2
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="rounded-full px-5 py-2.5 font-mono text-xs uppercase tracking-widest data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-fuchsia-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {category.title}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {SKILL_CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category.icon as CategoryIconName] ?? Code2
            return (
              <TabsContent key={category.id} value={category.id} className="mt-10">
                <div className="mb-5 flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-fuchsia-300" aria-hidden="true" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                    {category.subtitle}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {category.skills.map((skill, i) => (
                    <SkillCard key={skill.name} skill={skill} index={i} />
                  ))}
                </div>
              </TabsContent>
            )
          })}
        </Tabs>

        {/* Currently in the lab */}
        <Reveal delay={0.1} className="mt-12">
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-amber-300">
              <FlaskConical className="h-4 w-4" aria-hidden="true" />
              Currently in the lab
            </h3>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {CURRENTLY_LEARNING.map((item) => (
                <span key={item} className="chip">
                  <span
                    className="animate-pulse-glow h-1.5 w-1.5 rounded-full bg-amber-300"
                    aria-hidden="true"
                  />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
