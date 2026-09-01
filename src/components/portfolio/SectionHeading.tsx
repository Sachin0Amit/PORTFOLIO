"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { SECTION_HEADING_NUMBERS } from "@/lib/portfolio-data"

interface SectionHeadingProps {
  id: string
  title: ReactNode
  description?: string
}

export default function SectionHeading({ id, title, description }: SectionHeadingProps) {
  const number = SECTION_HEADING_NUMBERS[id] ?? "00"

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="kicker"
      >
        {number}
        {" // "}
        {id.toUpperCase()}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        className="font-display mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl"
      >
        {title}
      </motion.h2>

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
        aria-hidden="true"
        className="mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300"
      />

      {description ? (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
          className="mt-6 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base"
        >
          {description}
        </motion.p>
      ) : null}
    </div>
  )
}
