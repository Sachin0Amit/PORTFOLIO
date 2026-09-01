"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowUpRight,
  CornerDownLeft,
  Rocket,
  Cpu,
  GraduationCap,
  Gauge,
  Layers,
  Target,
  Send,
  Sparkles,
  X,
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  hint: string;
  icon: typeof Search;
  action: () => void;
  group: string;
}

const SECTIONS = [
  { id: "hero", label: "Origin", icon: Rocket, hint: "Top of the page" },
  { id: "about", label: "Biography", icon: Cpu, hint: "About the unit" },
  { id: "education", label: "Trajectory", icon: GraduationCap, hint: "Educational timeline" },
  { id: "certificates", label: "Credentials", icon: GraduationCap, hint: "Certificate vault" },
  { id: "performance", label: "Telemetry", icon: Gauge, hint: "SGPA & metrics" },
  { id: "achievements", label: "Insignia", icon: Sparkles, hint: "Achievement badges" },
  { id: "skills", label: "Arsenal", icon: Layers, hint: "Tech stack" },
  { id: "projects", label: "Archive", icon: ArrowUpRight, hint: "Project builds" },
  { id: "testimonials", label: "Signals", icon: Sparkles, hint: "Peer testimonials" },
  { id: "goals", label: "Missions", icon: Target, hint: "Future goals" },
  { id: "contact", label: "Signal", icon: Send, hint: "Open a channel" },
] as const;

/**
 * Cmd/Ctrl+K command palette for quick keyboard navigation.
 * Fuzzy-matches section labels. Auto-scrolls to the chosen section.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const goTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Brief flash highlight
      el.classList.add("section-flash");
      window.setTimeout(() => el.classList.remove("section-flash"), 1200);
    }
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const items: CommandItem[] = [
    ...SECTIONS.map((s) => ({
      id: s.id,
      label: s.label,
      hint: s.hint,
      icon: s.icon,
      group: "Navigate",
      action: () => goTo(s.id),
    })),
    {
      id: "konami",
      label: "Summon UFOs",
      hint: "Easter egg",
      icon: Sparkles,
      group: "Actions",
      action: () => {
        const w = window as unknown as { __summonUfos?: () => void };
        w.__summonUfos?.();
        setOpen(false);
      },
    },
    {
      id: "shortcuts",
      label: "Keyboard Shortcuts",
      hint: "Show all keybindings",
      icon: Sparkles,
      group: "Actions",
      action: () => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "?", bubbles: true }));
        setOpen(false);
      },
    },
  ];

  const filtered = items.filter((it) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      it.label.toLowerCase().includes(q) ||
      it.hint.toLowerCase().includes(q) ||
      it.id.toLowerCase().includes(q)
    );
  });

  // Clamp active so it never points past the end of the filtered list.
  const safeActive = Math.min(active, Math.max(0, filtered.length - 1));

  // Global key handler
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Arrow-key navigation inside the palette
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((v) => Math.min(v + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((v) => Math.max(v - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        filtered[safeActive]?.action();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, safeActive]);

  // Group filtered items
  const groups = filtered.reduce<Record<string, CommandItem[]>>((acc, it) => {
    (acc[it.group] = acc[it.group] || []).push(it);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9995] flex items-start justify-center px-4 pt-[15vh]"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[oklch(0.04_0.02_280/0.8)] backdrop-blur-md"
            onClick={() => setOpen(false)}
          />
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl glass-panel holo-border shadow-[0_24px_80px_-20px_rgba(120,255,200,0.4)]"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-[oklch(0.82_0.22_165/0.15)] px-4 py-3.5">
              <Search className="h-4 w-4 text-[oklch(0.82_0.22_165)]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder="Search sectors, missions, transmissions..."
                className="flex-1 bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
              <kbd className="hidden items-center gap-1 rounded border border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.10_0.02_280/0.5)] px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground sm:flex">
                ESC
              </kbd>
              <button
                onClick={() => setOpen(false)}
                className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-[oklch(0.16_0.04_280)] hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {Object.entries(groups).length === 0 && (
                <div className="px-4 py-8 text-center font-mono text-xs text-muted-foreground">
                  No transmissions found for &quot;{query}&quot;
                </div>
              )}
              {Object.entries(groups).map(([group, groupItems]) => (
                <div key={group} className="mb-2">
                  <div className="px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/70">
                    {group.toUpperCase()}
                  </div>
                  {groupItems.map((it) => {
                    const idx = filtered.indexOf(it);
                    const isActive = idx === safeActive;
                    return (
                      <button
                        key={it.id}
                        onMouseEnter={() => setActive(idx)}
                        onClick={it.action}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                          isActive
                            ? "bg-[oklch(0.82_0.22_165/0.12)] text-foreground"
                            : "text-foreground/80 hover:bg-[oklch(0.16_0.04_280/0.6)]"
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                            isActive
                              ? "border-[oklch(0.82_0.22_165/0.4)] bg-[oklch(0.82_0.22_165/0.12)]"
                              : "border-[oklch(0.82_0.22_165/0.15)] bg-[oklch(0.10_0.02_280/0.5)]"
                          }`}
                        >
                          <it.icon
                            className={`h-4 w-4 ${
                              isActive
                                ? "text-[oklch(0.82_0.22_165)]"
                                : "text-muted-foreground"
                            }`}
                          />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="font-display text-sm font-semibold">
                            {it.label}
                          </div>
                          <div className="truncate font-mono text-[10px] text-muted-foreground">
                            {it.hint}
                          </div>
                        </div>
                        {isActive && (
                          <CornerDownLeft className="h-3.5 w-3.5 text-[oklch(0.82_0.22_165)]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-[oklch(0.82_0.22_165/0.15)] px-4 py-2.5">
              <div className="flex items-center gap-3 font-mono text-[9px] tracking-[0.15em] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.10_0.02_280/0.5)] px-1.5 py-0.5">↑</kbd>
                  <kbd className="rounded border border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.10_0.02_280/0.5)] px-1.5 py-0.5">↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.10_0.02_280/0.5)] px-1.5 py-0.5">↵</kbd>
                  select
                </span>
              </div>
              <div className="font-mono text-[9px] tracking-[0.2em] text-[oklch(0.82_0.22_165)]">
                COSMIC.CMD
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
