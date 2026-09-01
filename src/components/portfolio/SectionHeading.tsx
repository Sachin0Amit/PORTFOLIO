"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  index: string;
  title: string;
  subtitle?: string;
  accent?: "alien" | "plasma" | "cyan";
  children?: ReactNode;
}

const accentMap = {
  alien: {
    text: "text-[oklch(0.82_0.22_165)]",
    glow: "text-glow-alien",
    bar: "bg-[oklch(0.82_0.22_165)]",
    border: "border-[oklch(0.82_0.22_165/0.4)]",
  },
  plasma: {
    text: "text-[oklch(0.72_0.25_320)]",
    glow: "text-glow-plasma",
    bar: "bg-[oklch(0.72_0.25_320)]",
    border: "border-[oklch(0.72_0.25_320/0.4)]",
  },
  cyan: {
    text: "text-[oklch(0.78_0.20_195)]",
    glow: "text-glow-cyan",
    bar: "bg-[oklch(0.78_0.20_195)]",
    border: "border-[oklch(0.78_0.20_195/0.4)]",
  },
};

export function SectionHeading({
  index,
  title,
  subtitle,
  accent = "alien",
  children,
}: SectionHeadingProps) {
  const a = accentMap[accent];
  return (
    <div className="mb-10 sm:mb-14">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3"
      >
        <span className={`h-px w-10 ${a.bar}`} />
        <span
          className={`font-mono text-xs tracking-[0.3em] ${a.text} ${a.glow}`}
        >
          {index}
        </span>
        <span className={`h-px flex-1 ${a.bar} opacity-30`} />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-3 font-display text-3xl font-black tracking-tight sm:text-4xl md:text-5xl"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base"
        >
          {subtitle}
        </motion.p>
      )}
      {children}
    </div>
  );
}
