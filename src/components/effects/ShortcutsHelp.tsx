"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard, Command, CornerDownLeft, ArrowUp, ArrowDown } from "lucide-react";

interface ShortcutGroup {
  label: string;
  shortcuts: { keys: string[]; desc: string }[];
}

const GROUPS: ShortcutGroup[] = [
  {
    label: "Navigation",
    shortcuts: [
      { keys: ["⌘", "K"], desc: "Open command palette" },
      { keys: ["?"], desc: "Toggle this shortcuts panel" },
      { keys: ["Esc"], desc: "Close any open modal / palette" },
      { keys: ["G", "H"], desc: "Jump to origin (hero)" },
      { keys: ["G", "C"], desc: "Jump to contact (signal)" },
    ],
  },
  {
    label: "Command Palette",
    shortcuts: [
      { keys: ["↑"], desc: "Move selection up" },
      { keys: ["↓"], desc: "Move selection down" },
      { keys: ["↵"], desc: "Activate selected item" },
    ],
  },
  {
    label: "Easter Eggs",
    shortcuts: [
      { keys: ["↑", "↑", "↓", "↓", "←", "→", "←", "→", "B", "A"], desc: "Summon UFO fleet" },
    ],
  },
  {
    label: "UI",
    shortcuts: [
      { keys: ["Tab"], desc: "Standard focus traversal" },
      { keys: ["Space"], desc: "Scroll down one viewport" },
    ],
  },
];

/**
 * Keyboard shortcuts help modal. Toggled by pressing `?` (Shift+/). Lists
 * all available keyboard interactions across the app: command palette,
 * navigation jumps, easter eggs, etc.
 */
export function ShortcutsHelp() {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // `?` is Shift+/ on most layouts
      if (e.key === "?" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement;
        // Don't trigger when typing in inputs
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        toggle();
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, toggle]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Keyboard jump shortcuts (G H → hero, G C → contact)
  useEffect(() => {
    let gPressed = false;
    let gTimer: ReturnType<typeof setTimeout> | null = null;
    const onKey = (e: KeyboardEvent) => {
      if (open) return;
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }
      const key = e.key.toLowerCase();
      if (key === "g" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        gPressed = true;
        if (gTimer) clearTimeout(gTimer);
        gTimer = setTimeout(() => {
          gPressed = false;
        }, 800);
        return;
      }
      if (gPressed) {
        if (key === "h") {
          e.preventDefault();
          document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
        } else if (key === "c") {
          e.preventDefault();
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        } else if (key === "p") {
          e.preventDefault();
          document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
        } else if (key === "s") {
          e.preventDefault();
          document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
        }
        gPressed = false;
        if (gTimer) clearTimeout(gTimer);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (gTimer) clearTimeout(gTimer);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9996] flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-[oklch(0.04_0.02_280/0.85)] backdrop-blur-md"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl glass-panel holo-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[oklch(0.82_0.22_165/0.15)] px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[oklch(0.82_0.22_165/0.3)] bg-[oklch(0.82_0.22_165/0.1)]">
                  <Keyboard className="h-4 w-4 text-[oklch(0.82_0.22_165)]" />
                </span>
                <div>
                  <div className="font-display text-base font-bold tracking-wide">
                    KEYBOARD MATRIX
                  </div>
                  <div className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                    ALL SHORTCUTS · PRESS ? TO TOGGLE
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.10_0.02_280/0.6)] text-muted-foreground transition-all hover:border-[oklch(0.82_0.22_165/0.5)] hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[65vh] overflow-y-auto scroll-alien p-5 sm:p-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {GROUPS.map((group) => (
                  <div key={group.label}>
                    <div className="mb-3 font-mono text-[10px] tracking-[0.25em] text-[oklch(0.78_0.20_195)]">
                      ▸ {group.label.toUpperCase()}
                    </div>
                    <ul className="space-y-2">
                      {group.shortcuts.map((sc, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between gap-3 rounded-lg border border-[oklch(0.82_0.22_165/0.1)] bg-[oklch(0.08_0.02_280/0.4)] px-3 py-2"
                        >
                          <span className="text-xs text-foreground/80">{sc.desc}</span>
                          <span className="flex shrink-0 items-center gap-1">
                            {sc.keys.map((k, ki) => (
                              <kbd
                                key={ki}
                                className="flex h-6 min-w-[24px] items-center justify-center rounded border border-[oklch(0.82_0.22_165/0.25)] bg-[oklch(0.10_0.02_280/0.6)] px-1.5 font-mono text-[10px] font-medium text-[oklch(0.82_0.22_165)]"
                              >
                                {k === "⌘" ? (
                                  <Command className="h-3 w-3" />
                                ) : k === "↑" ? (
                                  <ArrowUp className="h-3 w-3" />
                                ) : k === "↓" ? (
                                  <ArrowDown className="h-3 w-3" />
                                ) : k === "↵" ? (
                                  <CornerDownLeft className="h-3 w-3" />
                                ) : (
                                  k
                                )}
                              </kbd>
                            ))}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-[oklch(0.82_0.22_165/0.15)] bg-[oklch(0.08_0.02_280/0.5)] px-5 py-3 sm:px-6">
              <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                TIP: G+H JUMPS TO HERO · G+C JUMPS TO CONTACT
              </span>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg bg-[oklch(0.82_0.22_165)] px-4 py-1.5 font-display text-xs font-bold tracking-wider text-[oklch(0.10_0.02_280)] transition-all hover:shadow-[0_0_20px_rgba(120,255,200,0.5)]"
              >
                DISMISS
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
