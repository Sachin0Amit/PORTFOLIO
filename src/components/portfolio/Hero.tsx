"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { ArrowDown, ChevronDown, Send } from "lucide-react";
import { HERO_STATS, PERSONAL } from "@/lib/portfolio-data";
import { scrollToSection } from "./SmoothScroll";

/** Base delay so entrance choreography starts as the preloader lifts away. */
const BASE_DELAY = 2.5;

const LETTER_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Cycles through phrases: type -> hold -> delete -> next. */
function useTypewriter(
  words: string[],
  typeMs = 70,
  holdMs = 1600,
  deleteMs = 35,
) {
  const [text, setText] = useState("");

  useEffect(() => {
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = words[wordIndex];
      if (!word) return;

      if (!deleting) {
        charIndex += 1;
        setText(word.slice(0, charIndex));
        if (charIndex === word.length) {
          deleting = true;
          timer = setTimeout(tick, holdMs);
        } else {
          timer = setTimeout(tick, typeMs);
        }
      } else {
        charIndex -= 1;
        setText(word.slice(0, charIndex));
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          timer = setTimeout(tick, 400);
        } else {
          timer = setTimeout(tick, deleteMs);
        }
      }
    };

    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [words, typeMs, holdMs, deleteMs]);

  return text;
}

interface StatCardProps {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
}

/** Animated count-up stat tile. Delays itself when visible on first paint. */
function StatCard({ value, decimals, suffix, label }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mountedAt = useRef(Date.now());
  const [display, setDisplay] = useState((0).toFixed(decimals));

  useEffect(() => {
    if (!inView) return;
    // If we became visible immediately (first load, behind the preloader),
    // hold the count-up until the stats row enters.
    const elapsed = Date.now() - mountedAt.current;
    const delay = elapsed < 600 ? 3.6 : 0.2;

    const controls = animate(0, value, {
      duration: 1.5,
      delay,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, value, decimals]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3.65, duration: 0.7, ease: "easeOut" }}
      className="glass rounded-2xl p-4 text-center"
    >
      <div className="font-display text-2xl tabular-nums sm:text-3xl">
        <span className="text-foreground">{display}</span>
        {suffix && <span className="text-gradient">{suffix}</span>}
      </div>
      <p className="mt-1.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
    </motion.div>
  );
}

function StaggeredWord({
  word,
  gradient,
  delay,
}: {
  word: string;
  gradient: boolean;
  delay: number;
}) {
  return (
    <span aria-hidden="true" className="block overflow-hidden pb-1">
      {word.split("").map((letter, i) => (
        <motion.span
          key={`${letter}-${i}`}
          className={`inline-block ${gradient ? "text-gradient" : "text-foreground"}`}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: delay + i * 0.055,
            duration: 0.7,
            ease: LETTER_EASE,
          }}
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  const typed = useTypewriter(PERSONAL.heroRoles);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* CSS ambient background */}
      <div className="star-field absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="grid-bg absolute inset-0 opacity-30" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: BASE_DELAY, duration: 0.7, ease: "easeOut" }}
          className="chip"
        >
          <span className="text-[11px] tracking-[0.25em]">MY PORTFOLIO</span>
        </motion.div>

        {/* Headline */}
        <h1
          aria-label="Sachin Kumar"
          className="mt-8 font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl lg:text-[6.5rem]"
        >
          <StaggeredWord word="SACHIN" gradient={false} delay={BASE_DELAY + 0.1} />
          <StaggeredWord word="KUMAR" gradient delay={BASE_DELAY + 0.25} />
        </h1>

        {/* Typewriter */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2, duration: 0.6 }}
          className="mt-6 min-h-[1.75rem] font-mono text-sm text-fuchsia-300 sm:min-h-[2rem] sm:text-base"
        >
          <span className="text-amber-300/80">&gt; </span>
          {typed}
          <span className="animate-caret text-amber-300">|</span>
        </motion.p>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.35, duration: 0.7, ease: "easeOut" }}
          className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base"
        >
          {PERSONAL.heroIntro}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 0.7, ease: "easeOut" }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <button
            type="button"
            onClick={() => scrollToSection("about")}
            className="glow-violet flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-fuchsia-400 px-8 py-4 text-sm font-semibold text-white transition-transform hover:scale-[1.04] active:scale-95"
          >
            More About Me
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("contact")}
            className="glass flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-foreground transition hover:border-fuchsia-400/40"
          >
            Say Hello
            <Send className="h-4 w-4 text-fuchsia-300" aria-hidden="true" />
          </button>
        </motion.div>

        {/* Stats */}
        <div className="mt-10 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          {HERO_STATS.map((stat) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              decimals={stat.decimals}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <button
          type="button"
          onClick={() => scrollToSection("about")}
          aria-label="Scroll to the about section"
          className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="font-mono text-[10px] tracking-[0.3em]">SCROLL</span>
          <motion.span
            aria-hidden="true"
            animate={{ y: [0, 6, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1.6,
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="h-4 w-4 text-fuchsia-300" />
          </motion.span>
        </button>
      </motion.div>
    </section>
  );
}
