"use client";

import { motion } from "framer-motion";
import { Heart, Rocket, Github, Linkedin, Mail } from "lucide-react";
import { PROFILE } from "@/lib/portfolio-data";

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-[oklch(0.82_0.22_165/0.15)] bg-[oklch(0.05_0.02_280)]">
      {/* Top glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.82_0.22_165/0.6)] to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[oklch(0.82_0.22_165/0.05)] to-transparent" />

      <div className="relative mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[oklch(0.82_0.22_165/0.4)] bg-[oklch(0.10_0.02_280)]">
                <Rocket className="h-4 w-4 text-[oklch(0.82_0.22_165)] animate-flicker" />
              </span>
              <div>
                <div className="font-display text-sm font-bold tracking-wide">
                  SACHIN<span className="text-[oklch(0.82_0.22_165)]">.</span>KUMAR
                </div>
                <div className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground">
                  {PROFILE.callsign}
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Cosmic-grade portfolio engineered from{" "}
              <span className="text-[oklch(0.82_0.22_165)]">{PROFILE.origin}</span>.
              Built with Next.js, Tailwind & a steady supply of stardust.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <div className="mb-3 font-mono text-[9px] tracking-[0.25em] text-[oklch(0.78_0.20_195)]">
              NAVIGATION
            </div>
            <ul className="space-y-2">
              {[
                { label: "Origin", href: "#hero" },
                { label: "Biography", href: "#about" },
                { label: "Trajectory", href: "#education" },
                { label: "Telemetry", href: "#performance" },
                { label: "Arsenal", href: "#skills" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="font-mono text-xs tracking-wide text-muted-foreground transition-colors hover:text-[oklch(0.82_0.22_165)]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <div className="mb-3 font-mono text-[9px] tracking-[0.25em] text-[oklch(0.72_0.25_320)]">
              FREQUENCIES
            </div>
            <div className="flex gap-2">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Mail, href: "mailto:sachin@example.com", label: "Email" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.10_0.02_280/0.5)] text-muted-foreground transition-all hover:border-[oklch(0.82_0.22_165/0.5)] hover:text-[oklch(0.82_0.22_165)] hover:shadow-[0_0_15px_rgba(120,255,200,0.3)]"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-[oklch(0.82_0.22_165/0.15)] bg-[oklch(0.08_0.02_280/0.5)] p-3">
              <div className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                STATUS
              </div>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.82_0.22_165)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[oklch(0.82_0.22_165)]" />
                </span>
                <span className="font-display text-sm font-bold text-[oklch(0.82_0.22_165)]">
                  ONLINE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[oklch(0.82_0.22_165/0.1)] pt-6 sm:flex-row"
        >
          <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.15em] text-muted-foreground">
            <span>© {new Date().getFullYear()} SACHIN KUMAR</span>
            <span className="text-[oklch(0.72_0.25_320)]">·</span>
            <span>BUILT WITH</span>
            <Heart className="h-3 w-3 fill-[oklch(0.72_0.25_320)] text-[oklch(0.72_0.25_320)]" />
            <span>&amp; STARDUST</span>
          </div>
          <div className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground">
            v1.0 · ORBIT STABLE ·{" "}
            <span className="text-[oklch(0.82_0.22_165)]">SIGNAL CLEAR</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
