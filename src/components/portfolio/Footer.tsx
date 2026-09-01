"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUp, Orbit } from "lucide-react"
import { NAV_LINKS, PERSONAL } from "@/lib/portfolio-data"
import { scrollToSection, scrollToTop } from "@/components/portfolio/SmoothScroll"

interface VisitsResponse {
  success: boolean
  total: number
}

const SESSION_FLAG = "sk-visited"

export default function Footer() {
  const [total, setTotal] = useState<number | null>(null)
  const [showTop, setShowTop] = useState(false)

  // visit counter — register once per session
  useEffect(() => {
    let cancelled = false
    async function registerVisit() {
      try {
        const alreadyVisited = sessionStorage.getItem(SESSION_FLAG)
        const res = await fetch("/api/visits", alreadyVisited ? { method: "GET" } : {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: "/" }),
        })
        const data = (await res.json()) as VisitsResponse
        if (!cancelled && data.success) {
          setTotal(data.total)
          if (!alreadyVisited) sessionStorage.setItem(SESSION_FLAG, "1")
        }
      } catch {
        // counter is decorative — fail silently
      }
    }
    registerVisit()
    return () => {
      cancelled = true
    }
  }, [])

  // back-to-top visibility
  useEffect(() => {
    function handleScroll() {
      setShowTop(window.scrollY > 600)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <footer className="relative mt-auto border-t border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row">
            {/* brand */}
            <div>
              <p className="font-display text-xl font-bold">
                {PERSONAL.initials}
                <span className="text-amber-300" aria-hidden="true">
                  .
                </span>
              </p>
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                {PERSONAL.tagline}
              </p>
            </div>

            {/* nav */}
            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(link.id)}
                      className="focus-visible:ring-2 focus-visible:ring-fuchsia-400/60 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* meta */}
            <div className="flex flex-col items-start gap-3 md:items-end">
              <span className="chip text-[11px]">
                <Orbit className="h-3.5 w-3.5 text-fuchsia-300" aria-hidden="true" />
                {total === null ? (
                  "counting..."
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={total}
                        initial={{ y: -8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 8, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="inline-block tabular-nums"
                      >
                        {total}
                      </motion.span>
                    </AnimatePresence>
                    visitors so far
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="my-8 h-px w-full bg-white/5" aria-hidden="true" />

          <div className="flex flex-col justify-between gap-3 font-mono text-[11px] text-muted-foreground sm:flex-row">
            <p>
              &copy; {new Date().getFullYear()} {PERSONAL.name} — All rights reserved
            </p>
            <p>Built with Next.js &amp; Tailwind CSS</p>
          </div>
        </div>
      </footer>

      {/* back to top */}
      <AnimatePresence>
        {showTop ? (
          <motion.button
            key="back-to-top"
            type="button"
            aria-label="Back to top"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="glass-strong focus-visible:ring-2 focus-visible:ring-fuchsia-400/60 fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 hover:glow-violet hover:border-fuchsia-400/50 focus-visible:outline-none"
          >
            <ArrowUp className="h-5 w-5 text-fuchsia-300" aria-hidden="true" />
          </motion.button>
        ) : null}
      </AnimatePresence>
    </>
  )
}
