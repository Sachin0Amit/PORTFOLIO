"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ParallaxBreakProps {
  image: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

/**
 * Full-bleed parallax cosmic break with overlaid transmission text.
 * Used to punctuate the page between major sections.
 */
export function ParallaxBreak({
  image,
  title,
  subtitle,
  align = "center",
}: ParallaxBreakProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );

  return (
    <section
      ref={ref}
      className="relative my-12 h-[55vh] min-h-[360px] w-full overflow-hidden sm:my-20 sm:h-[60vh]"
    >
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 -z-10"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
      </motion.div>
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.04_0.02_280)] via-[oklch(0.04_0.02_280/0.4)] to-[oklch(0.04_0.02_280)]" />
      <div className="absolute inset-0 bg-grid opacity-25" />
      <div className="absolute inset-0 scanlines" />

      <motion.div
        style={{ y: textY, opacity }}
        className={`absolute inset-0 flex flex-col justify-center px-4 ${
          align === "center" ? "items-center text-center" : "items-start text-left"
        }`}
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="h-px w-8 bg-[oklch(0.82_0.22_165)]" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-[oklch(0.82_0.22_165)] text-glow-alien">
            INCOMING TRANSMISSION
          </span>
          <span className="h-px w-8 bg-[oklch(0.82_0.22_165)]" />
        </div>
        <h2 className="max-w-3xl font-display text-3xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-gradient-alien animate-gradient">{title}</span>
        </h2>
        {subtitle && (
          <p className="mt-4 max-w-xl text-sm text-foreground/70 sm:text-base">
            {subtitle}
          </p>
        )}
      </motion.div>

      {/* Corner brackets */}
      <div className="absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-[oklch(0.82_0.22_165/0.5)]" />
      <div className="absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-[oklch(0.82_0.22_165/0.5)]" />
      <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-[oklch(0.82_0.22_165/0.5)]" />
      <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-[oklch(0.82_0.22_165/0.5)]" />
    </section>
  );
}
