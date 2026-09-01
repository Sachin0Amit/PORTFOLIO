"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Radio, Search, Keyboard } from "lucide-react";

const LINKS = [
  { label: "ORIGIN", href: "#hero" },
  { label: "BIO", href: "#about" },
  { label: "TIMELINE", href: "#education" },
  { label: "CREDS", href: "#certificates" },
  { label: "TELEMETRY", href: "#performance" },
  { label: "ARSENAL", href: "#skills" },
  { label: "ARCHIVE", href: "#projects" },
  { label: "MISSIONS", href: "#goals" },
  { label: "SIGNAL", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("hero");
  const [time, setTime] = useState("");

  const triggerCmdK = () => {
    // The CommandPalette listens for Cmd/Ctrl+K — synthesize it
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: true, bubbles: true })
    );
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const update = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      const ss = String(d.getSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ids = LINKS.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4"
      >
        <nav
          className={`flex w-full max-w-5xl items-center justify-between gap-3 rounded-2xl px-3 py-2.5 transition-all duration-300 sm:px-4 ${
            scrolled
              ? "glass-panel holo-border shadow-[0_8px_40px_-12px_rgba(120,255,200,0.25)]"
              : "border border-transparent bg-transparent"
          }`}
        >
          {/* Brand */}
          <a href="#hero" className="group flex items-center gap-2.5">
            <span className="relative flex h-8 w-8 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-[oklch(0.82_0.22_165/0.15)] blur-md transition-all group-hover:bg-[oklch(0.82_0.22_165/0.3)]" />
              <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[oklch(0.82_0.22_165/0.5)] bg-[oklch(0.10_0.02_280)]">
                <Radio className="h-4 w-4 text-[oklch(0.82_0.22_165)] animate-flicker" />
              </span>
            </span>
            <div className="hidden flex-col leading-none sm:flex">
              <span className="font-display text-xs font-bold tracking-[0.2em] text-foreground">
                SACHIN<span className="text-[oklch(0.82_0.22_165)]">.</span>K
              </span>
              <span className="font-mono text-[9px] tracking-[0.3em] text-muted-foreground">
                {time || "00:00:00"} IST
              </span>
            </div>
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-0.5 xl:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`relative rounded-lg px-2 py-1.5 font-mono text-[10px] font-medium tracking-[0.12em] transition-colors ${
                  active === l.href.replace("#", "")
                    ? "text-[oklch(0.82_0.22_165)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
                {active === l.href.replace("#", "") && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-lg bg-[oklch(0.82_0.22_165/0.12)] ring-1 ring-[oklch(0.82_0.22_165/0.3)]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Command palette trigger */}
          <button
            onClick={triggerCmdK}
            className="group hidden items-center gap-2 rounded-lg border border-[oklch(0.82_0.22_165/0.25)] bg-[oklch(0.10_0.02_280/0.6)] px-2.5 py-1.5 transition-all hover:border-[oklch(0.82_0.22_165/0.5)] md:flex"
            aria-label="Open command palette"
          >
            <Search className="h-3.5 w-3.5 text-[oklch(0.82_0.22_165)]" />
            <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
              SEARCH
            </span>
            <kbd className="rounded border border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.10_0.02_280/0.5)] px-1 py-0.5 font-mono text-[8px] text-muted-foreground">
              ⌘K
            </kbd>
          </button>

          {/* Shortcuts help trigger */}
          <button
            onClick={() => {
              window.dispatchEvent(new KeyboardEvent("keydown", { key: "?", bubbles: true }));
            }}
            className="group hidden h-8 w-8 items-center justify-center rounded-lg border border-[oklch(0.82_0.22_165/0.25)] bg-[oklch(0.10_0.02_280/0.6)] transition-all hover:border-[oklch(0.82_0.22_165/0.5)] md:flex"
            aria-label="Keyboard shortcuts"
          >
            <Keyboard className="h-3.5 w-3.5 text-[oklch(0.78_0.20_195)] transition-transform group-hover:scale-110" />
          </button>

          {/* Status pill */}
          <div className="hidden items-center gap-2 rounded-full border border-[oklch(0.82_0.22_165/0.3)] bg-[oklch(0.10_0.02_280/0.6)] px-3 py-1 xl:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.82_0.22_165)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[oklch(0.82_0.22_165)]" />
            </span>
            <span className="font-mono text-[9px] font-medium tracking-[0.2em] text-muted-foreground">
              SIGNAL ACTIVE
            </span>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[oklch(0.82_0.22_165/0.3)] bg-[oklch(0.10_0.02_280/0.6)] text-[oklch(0.82_0.22_165)] xl:hidden"
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 xl:hidden"
          >
            <div
              className="absolute inset-0 bg-[oklch(0.04_0.02_280/0.85)] backdrop-blur-xl"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ delay: 0.05 }}
              className="absolute inset-x-3 top-20 overflow-hidden rounded-2xl glass-panel holo-border p-2"
            >
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.05 + i * 0.04 }}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 font-display text-sm font-semibold tracking-[0.2em] transition-colors ${
                    active === l.href.replace("#", "")
                      ? "bg-[oklch(0.82_0.22_165/0.12)] text-[oklch(0.82_0.22_165)]"
                      : "text-foreground hover:bg-[oklch(0.16_0.04_280)]"
                  }`}
                >
                  <span>{l.label}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    0{i + 1}
                  </span>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
