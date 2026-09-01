"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Award,
  Hash,
  Calendar,
  ExternalLink,
  ShieldCheck,
  ZoomIn,
} from "lucide-react";
import { PROFILE } from "@/lib/portfolio-data";
import type { Profile } from "@/lib/portfolio-data";
import { SectionHeading } from "./SectionHeading";
import { TiltCard } from "@/components/effects/TiltCard";
import { CertificateDialog } from "./CertificateDialog";

type Certificate = Profile["certificates"][number];

const accentMap = {
  alien: { color: "oklch(0.82 0.22 165)" },
  cyan: { color: "oklch(0.78 0.20 195)" },
  plasma: { color: "oklch(0.72 0.25 320)" },
} as const;

export function Certificates() {
  const [selected, setSelected] = useState<Certificate | null>(null);

  return (
    <section id="certificates" className="relative px-4 py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-72 w-72 rounded-full bg-[oklch(0.82_0.22_165/0.05)] blur-3xl" />

      <div className="mx-auto max-w-5xl">
        <SectionHeading
          index="04 // CREDENTIALS"
          title="CERTIFICATE VAULT"
          subtitle="Verified credentials and completions — each one a beacon of acquired knowledge."
          accent="alien"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROFILE.certificates.map((cert, i) => {
            const ac = accentMap[cert.accent];
            return (
              <motion.div
                key={cert.certId}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}
              >
                <TiltCard max={10} scale={1.03} glareColor={cert.accent} className="h-full">
                  <button
                    type="button"
                    onClick={() => setSelected(cert)}
                    className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl glass-panel p-5 text-left"
                  >
                    {/* Verified ribbon */}
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-[oklch(0.82_0.22_165/0.3)] bg-[oklch(0.10_0.02_280/0.6)] px-2 py-0.5">
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
                    </div>

                    {/* Certificate thumbnail */}
                    <div className="relative mb-4 overflow-hidden rounded-xl border border-[oklch(0.82_0.22_165/0.15)]">
                      <img
                        src={cert.image}
                        alt={`${cert.title} certificate`}
                        className="aspect-[1.414/1] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Dark gradient overlay for legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.04_0.02_280/0.6)] via-transparent to-transparent" />
                      {/* Hover zoom hint */}
                      <div className="absolute inset-0 flex items-center justify-center bg-[oklch(0.04_0.02_280/0.5)] opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100">
                        <span
                          className="flex h-10 w-10 items-center justify-center rounded-full border"
                          style={{
                            borderColor: `${ac.color} / 0.6`,
                            background: `${ac.color} / 0.15)`,
                          } as React.CSSProperties}
                        >
                          <ZoomIn className="h-4 w-4" style={{ color: ac.color }} />
                        </span>
                      </div>
                      {/* Corner brackets */}
                      <span className="absolute left-1.5 top-1.5 h-3 w-3 border-l border-t border-[oklch(0.82_0.22_165/0.5)]" />
                      <span className="absolute right-1.5 top-1.5 h-3 w-3 border-r border-t border-[oklch(0.82_0.22_165/0.5)]" />
                      <span className="absolute bottom-1.5 left-1.5 h-3 w-3 border-b border-l border-[oklch(0.82_0.22_165/0.5)]" />
                      <span className="absolute bottom-1.5 right-1.5 h-3 w-3 border-b border-r border-[oklch(0.82_0.22_165/0.5)]" />
                    </div>

                    {/* Codename */}
                    <div
                      className="mb-1 font-mono text-[9px] tracking-[0.25em]"
                      style={{ color: ac.color }}
                    >
                      {cert.codename}
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-base font-bold leading-tight tracking-wide">
                      {cert.title}
                    </h3>

                    {/* Issuer */}
                    <p
                      className="mt-1 text-xs font-medium"
                      style={{ color: ac.color }}
                    >
                      {cert.issuer}
                    </p>

                    {/* Meta row */}
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Calendar className="h-3 w-3" style={{ color: ac.color }} />
                        <span>{cert.issueDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Hash className="h-3 w-3" style={{ color: ac.color }} />
                        <span className="font-mono">{cert.certId}</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-center gap-1">
                        <Award className="h-3.5 w-3.5" style={{ color: ac.color }} />
                        <span className="font-mono text-[9px] tracking-[0.15em] text-muted-foreground">
                          {cert.skills.length} SKILLS
                        </span>
                      </div>
                      <span
                        className="flex items-center gap-1 font-display text-[10px] font-bold tracking-wider transition-transform group-hover:translate-x-0.5"
                        style={{ color: ac.color }}
                      >
                        VIEW
                        <ExternalLink className="h-3 w-3" />
                      </span>
                    </div>

                    {/* Bottom accent bar */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                      style={{ background: `linear-gradient(90deg, ${ac.color}, transparent)` }}
                    />
                  </button>
                </TiltCard>
              </motion.div>
            );
          })}

          {/* Add-more placeholder card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: PROFILE.certificates.length * 0.1 }}
          >
            <div className="relative flex h-full min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.08_0.02_280/0.3)] p-5 text-center">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-[oklch(0.82_0.22_165/0.3)]"
              >
                <Award className="h-5 w-5 text-[oklch(0.82_0.22_165/0.5)]" />
              </div>
              <div className="mt-3 font-display text-sm font-bold tracking-wide text-muted-foreground">
                MORE VAULTING INCOMING
              </div>
              <div className="mt-1 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60">
                ADDITIONAL CREDENTIALS PENDING
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Certificate detail modal */}
      <CertificateDialog
        certificate={selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
