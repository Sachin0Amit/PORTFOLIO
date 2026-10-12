"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, Cpu, Globe2 } from "lucide-react";
import { PROFILE } from "@/lib/portfolio-data";
import { TiltCard } from "@/components/effects/TiltCard";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yNebula = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // 3D parallax for the name layer
  const nameZ = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const nameRotX = useTransform(scrollYProgress, [0, 1], [0, 8]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-24 pb-16"
    >
      {/* Background nebula image */}
      <motion.div
        style={{ y: yNebula }}
        className="absolute inset-0 -z-[5]"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url(/assets/hero-nebula.png)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.04_0.02_280/0.5)] via-transparent to-[oklch(0.04_0.02_280)]" />
        <div className="absolute inset-0 bg-grid opacity-40" />
      </motion.div>

      <motion.div
        style={{ y: yContent, opacity }}
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        {/* Callsign */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-3 font-mono text-xs tracking-[0.4em] text-[oklch(0.78_0.20_195)] text-glow-cyan"
        >
          {PROFILE.callsign}
        </motion.p>

        {/* Name with 3D depth + glitch */}
        <motion.div style={{ perspective: "800px" }}>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9, rotateX: 40 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ z: nameZ, rotateX: nameRotX, transformStyle: "preserve-3d" }}
            className="font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl"
          >
            <span
              className="block text-[oklch(0.82_0.22_165)] text-glow-alien"
              style={{ transform: "translateZ(40px)" }}
            >
              SACHIN
            </span>
            <span
              className="block text-foreground"
              style={{ transform: "translateZ(20px)" }}
            >
              KUMAR
            </span>
          </motion.h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg"
        >
          {PROFILE.tagline}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#about"
            className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-[oklch(0.82_0.22_165)] px-6 py-3 font-display text-sm font-bold tracking-wider text-[oklch(0.10_0.02_280)] transition-all hover:shadow-[0_0_30px_rgba(120,255,200,0.6)] hover:-translate-y-0.5"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <Cpu className="h-4 w-4" />
            INITIATE CONTACT
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 rounded-xl border border-[oklch(0.72_0.25_320/0.5)] bg-[oklch(0.10_0.02_280/0.4)] px-6 py-3 font-display text-sm font-bold tracking-wider text-foreground backdrop-blur-md transition-all hover:border-[oklch(0.72_0.25_320)] hover:shadow-[0_0_30px_rgba(220,120,255,0.3)] hover:-translate-y-0.5"
          >
            <Globe2 className="h-4 w-4 text-[oklch(0.72_0.25_320)]" />
            SEND SIGNAL
          </a>
        </motion.div>

        {/* 3D Tilt Stat Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-14 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {PROFILE.stats.map((s, i) => (
            <TiltCard
              key={s.label}
              max={14}
              scale={1.06}
              glareColor={i % 2 === 0 ? "alien" : "plasma"}
              className="h-full"
            >
              <div className="relative h-full overflow-hidden rounded-xl border border-[oklch(0.82_0.22_165/0.15)] bg-[oklch(0.10_0.02_280/0.5)] p-3 backdrop-blur-md">
                <div className="absolute -right-4 -top-4 h-12 w-12 rounded-full bg-[oklch(0.82_0.22_165/0.1)] blur-xl" />
                <div className="relative">
                  <div className="font-display text-2xl font-black text-gradient-alien">
                    {s.value}
                    <span className="ml-0.5 text-[10px] font-medium text-muted-foreground">
                      {s.unit}
                    </span>
                  </div>
                  <div className="mt-0.5 font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              </div>
            </TiltCard>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        style={{ opacity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <span className="font-mono text-[9px] tracking-[0.3em]">SCROLL TO TRAVERSE</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="flex h-8 w-5 items-start justify-center rounded-full border border-[oklch(0.82_0.22_165/0.4)] p-1"
        >
          <ArrowDown className="h-3 w-3 text-[oklch(0.82_0.22_165)]" />
        </motion.div>
      </motion.a>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[oklch(0.04_0.02_280)] to-transparent" />
    </section>
  );
}
