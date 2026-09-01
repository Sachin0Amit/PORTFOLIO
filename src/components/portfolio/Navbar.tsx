"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, Sparkles, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/portfolio-data";
import { scrollToSection, scrollToTop } from "./SmoothScroll";

/**
 * Floating glass navigation: scroll progress hairline, active-section
 * tracking, and a full-screen staggered mobile menu.
 */
export default function Navbar() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  // Active section detection (mid-viewport band)
  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      document.getElementById(link.id),
    ).filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const goTo = (id: string) => {
    if (open) {
      setOpen(false);
      // One frame later so the body-scroll unlock effect can commit first.
      requestAnimationFrame(() => scrollToSection(id));
      return;
    }
    scrollToSection(id);
  };

  return (
    <>
      {/* Scroll progress hairline */}
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300"
        style={{ scaleX }}
      />

      {/* Floating pill nav */}
      <header className="fixed inset-x-0 top-3 z-50 flex justify-center px-4">
        <nav
          aria-label="Primary navigation"
          className="glass-strong flex max-w-fit items-center gap-6 rounded-full py-2.5 pl-5 pr-3 shadow-[0_8px_44px_-14px_rgba(167,139,250,0.45)]"
        >
          {/* Logo */}
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="font-display text-lg font-bold text-foreground transition-transform hover:scale-105"
          >
            SK<span className="text-amber-300">.</span>
          </button>

          {/* Desktop links */}
          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => goTo(link.id)}
                  className={`group relative py-1 font-mono text-xs uppercase tracking-widest transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className="flex items-center gap-1.5">
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 rounded-full bg-fuchsia-400"
                      />
                    )}
                    {link.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 transition-transform duration-300 group-hover:scale-x-100"
                  />
                </button>
              );
            })}
          </div>

          {/* Hire me chip */}
          <button
            type="button"
            onClick={() => goTo("contact")}
            className="hidden items-center gap-1.5 rounded-full border border-amber-300/50 bg-amber-300/10 px-4 py-1.5 font-mono text-xs tracking-wider text-amber-300 transition hover:bg-amber-300/20 hover:shadow-[0_0_24px_-6px_rgba(252,211,77,0.5)] sm:inline-flex"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Hire Me
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition hover:bg-white/5 md:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[55] flex flex-col bg-background/90 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation menu"
              className="absolute right-5 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-foreground transition hover:bg-white/5"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.id}
                  type="button"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{
                    delay: 0.05 + i * 0.06,
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                  onClick={() => goTo(link.id)}
                  className={`font-display text-3xl font-bold transition-colors sm:text-4xl ${
                    active === link.id
                      ? "text-gradient"
                      : "text-foreground/90 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>

            <p className="pb-8 text-center font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
              SACHIN KUMAR — PORTFOLIO
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
