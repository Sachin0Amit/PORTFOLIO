"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Quote, Star, ShieldCheck, Radio, Inbox } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { TiltCard } from "@/components/effects/TiltCard";
import { TestimonialForm } from "./TestimonialForm";

interface Testimonial {
  id: string;
  author: string;
  role: string;
  relation: string;
  quote: string;
  rating: number;
  accent: "alien" | "cyan" | "plasma";
  verifyLink: string | null;
  createdAt: string;
}

const accentMap = {
  alien: { color: "oklch(0.82 0.22 165)" },
  cyan: { color: "oklch(0.78 0.20 195)" },
  plasma: { color: "oklch(0.72 0.25 320)" },
} as const;

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetch("/api/testimonials", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.testimonials ?? []);
    } catch {
      // silent — empty state will show
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
    // Poll every 30s for new testimonials
    const id = setInterval(fetchTestimonials, 30000);
    return () => clearInterval(id);
  }, [fetchTestimonials]);

  return (
    <section id="testimonials" className="relative px-4 py-20 sm:py-28">
      <div className="pointer-events-none absolute right-1/4 top-1/4 h-72 w-72 rounded-full bg-[oklch(0.72_0.25_320/0.05)] blur-3xl" />
      <div className="pointer-events-none absolute left-1/4 bottom-1/4 h-72 w-72 rounded-full bg-[oklch(0.82_0.22_165/0.04)] blur-3xl" />

      <div className="mx-auto max-w-5xl">
        <SectionHeading
          index="08 // TRANSMISSIONS"
          title="INCOMING SIGNALS"
          subtitle="Decoded transmissions from collaborators, mentors and peers across the network."
          accent="plasma"
        />

        {/* Header row: count + submit button */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 rounded-full border border-[oklch(0.82_0.22_165/0.3)] bg-[oklch(0.10_0.02_280/0.6)] px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.82_0.22_165)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[oklch(0.82_0.22_165)]" />
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
              LIVE · {items.length} {items.length === 1 ? "SIGNAL" : "SIGNALS"} RECEIVED
            </span>
          </div>
          <TestimonialForm onSubmitted={fetchTestimonials} />
        </div>

        {/* Content */}
        {loading ? (
          // Loading skeletons
          <div className="grid gap-5 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-2xl glass-panel"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          // Empty state
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-dashed border-[oklch(0.82_0.22_165/0.25)] bg-[oklch(0.08_0.02_280/0.3)] p-10 text-center sm:p-16"
          >
            <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-20" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.82_0.22_165/0.06)] blur-3xl" />
            <div className="relative mx-auto flex max-w-md flex-col items-center">
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[oklch(0.82_0.22_165/0.3)] bg-[oklch(0.10_0.02_280/0.6)]">
                <Radio className="h-7 w-7 text-[oklch(0.82_0.22_165)] animate-flicker" />
                <span className="absolute inset-[-4px] rounded-full border border-dashed border-[oklch(0.82_0.22_165/0.2)] animate-spin-slow" />
              </span>
              <div className="mt-4 flex items-center gap-2">
                <Inbox className="h-4 w-4 text-[oklch(0.78_0.20_195)]" />
                <span className="font-mono text-[10px] tracking-[0.25em] text-[oklch(0.78_0.20_195)]">
                  AWAITING FIRST TRANSMISSION
                </span>
              </div>
              <h3 className="mt-2 font-display text-xl font-black tracking-wide">
                THE FREQUENCY IS SILENT
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No testimonials have been broadcast yet. Be the first to leave a
                verified signal — tell the network who you are and share your
                experience working with Sachin.
              </p>
            </div>
          </motion.div>
        ) : (
          // Testimonial cards
          <div className="grid gap-5 sm:grid-cols-2">
            {items.map((t, i) => {
              const ac = accentMap[t.accent] ?? accentMap.alien;
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <TiltCard max={7} scale={1.02} glareColor={t.accent} className="h-full">
                    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl glass-panel p-6">
                      <Quote
                        className="absolute -right-2 -top-2 h-20 w-20 opacity-[0.07]"
                        style={{ color: ac.color }}
                        fill="currentColor"
                      />
                      <div
                        className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60"
                        style={{ background: ac.color }}
                      />

                      <div className="relative flex flex-1 flex-col">
                        {/* Stars + verified badge */}
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex gap-0.5">
                            {Array.from({ length: t.rating }).map((_, si) => (
                              <Star
                                key={si}
                                className="h-3.5 w-3.5"
                                style={{ color: ac.color }}
                                fill="currentColor"
                              />
                            ))}
                          </div>
                          {t.verifyLink && (
                            <a
                              href={
                                t.verifyLink.includes("@") && !t.verifyLink.startsWith("http")
                                  ? `mailto:${t.verifyLink}`
                                  : t.verifyLink
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 rounded-full border border-[oklch(0.82_0.22_165/0.3)] bg-[oklch(0.10_0.02_280/0.6)] px-2 py-0.5 transition-all hover:border-[oklch(0.82_0.22_165/0.6)]"
                              aria-label="Verified"
                            >
                              <ShieldCheck
                                className="h-2.5 w-2.5"
                                style={{ color: ac.color }}
                              />
                              <span
                                className="font-mono text-[8px] tracking-[0.15em]"
                                style={{ color: ac.color }}
                              >
                                VERIFIED
                              </span>
                            </a>
                          )}
                        </div>

                        {/* Quote */}
                        <p className="flex-1 text-sm leading-relaxed text-foreground/85">
                          <span className="mr-1 font-display text-2xl leading-none" style={{ color: ac.color }}>
                            &ldquo;
                          </span>
                          {t.quote}
                          <span className="ml-1 font-display text-2xl leading-none" style={{ color: ac.color }}>
                            &rdquo;
                          </span>
                        </p>

                        {/* Author */}
                        <div className="mt-5 flex items-center gap-3 border-t border-[oklch(0.82_0.22_165/0.1)] pt-4">
                          <span
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-sm font-black"
                            style={{
                              background: `${ac.color} / 0.12`,
                              border: `1px solid ${ac.color} / 0.4`,
                              color: ac.color,
                            } as React.CSSProperties}
                          >
                            {t.author.charAt(0).toUpperCase()}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-display text-sm font-bold tracking-wide">
                              {t.author}
                            </div>
                            <div className="truncate font-mono text-[9px] tracking-[0.15em] text-muted-foreground">
                              {t.role}
                              {t.relation ? ` · ${t.relation}` : ""}
                            </div>
                          </div>
                          {/* Signal strength bars */}
                          <div className="flex items-end gap-0.5" aria-hidden="true">
                            {[0.3, 0.55, 0.8, 1].map((h, bi) => (
                              <span
                                key={bi}
                                className="w-0.5 rounded-full"
                                style={{
                                  height: `${h * 14}px`,
                                  background: ac.color,
                                  opacity: 0.4 + bi * 0.15,
                                }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Timestamp */}
                        <div className="mt-2 text-right font-mono text-[8px] tracking-[0.15em] text-muted-foreground/60">
                          {timeAgo(t.createdAt)}
                        </div>
                      </div>

                      {/* Bottom accent bar */}
                      <div
                        className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                        style={{ background: `linear-gradient(90deg, ${ac.color}, transparent)` }}
                      />
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
