"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Award,
  Calendar,
  Hash,
  User,
  Mail,
  ShieldCheck,
  Download,
  ExternalLink,
} from "lucide-react";
import { useEffect } from "react";
import type { Profile } from "@/lib/portfolio-data";
import { playSound } from "@/hooks/use-sound";

type Certificate = Profile["certificates"][number];

const accentMap = {
  alien: { color: "oklch(0.82 0.22 165)" },
  cyan: { color: "oklch(0.78 0.20 195)" },
  plasma: { color: "oklch(0.72 0.25 320)" },
} as const;

interface CertificateDialogProps {
  certificate: Certificate | null;
  onClose: () => void;
}

/**
 * Alien-styled certificate viewer modal. Shows the full certificate image
 * with zoom, plus metadata: issuer, cert ID, issue date, duration, trainer,
 * verification instructions, and skills acquired.
 */
export function CertificateDialog({ certificate, onClose }: CertificateDialogProps) {
  useEffect(() => {
    if (!certificate) return;
    playSound("open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      playSound("close");
    };
  }, [certificate, onClose]);

  return (
    <AnimatePresence>
      {certificate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9997] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[oklch(0.04_0.02_280/0.9)] backdrop-blur-md"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={certificate.title}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl glass-panel holo-border"
          >
            <div className="pointer-events-none absolute inset-0 z-10 scanlines" />

            {/* Header */}
            <div
              className="relative overflow-hidden border-b border-[oklch(0.82_0.22_165/0.15)] p-5 sm:p-6"
              style={{
                background: `linear-gradient(135deg, ${accentMap[certificate.accent].color.replace(")", " / 0.12)")}, transparent 70%)`,
              }}
            >
              <div
                className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl opacity-40"
                style={{ background: accentMap[certificate.accent].color }}
              />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: `${accentMap[certificate.accent].color} / 0.12`,
                      border: `1px solid ${accentMap[certificate.accent].color} / 0.4`,
                    } as React.CSSProperties}
                  >
                    <Award
                      className="h-6 w-6"
                      style={{ color: accentMap[certificate.accent].color }}
                    />
                  </span>
                  <div>
                    <div
                      className="font-mono text-[10px] tracking-[0.25em]"
                      style={{ color: accentMap[certificate.accent].color }}
                    >
                      {certificate.codename}
                    </div>
                    <h2 className="mt-0.5 font-display text-lg font-black tracking-wide sm:text-xl">
                      {certificate.title}
                    </h2>
                    <p className="text-xs font-medium" style={{ color: accentMap[certificate.accent].color }}>
                      {certificate.issuer} · {certificate.issuerTagline}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.10_0.02_280/0.6)] text-muted-foreground transition-all hover:border-[oklch(0.82_0.22_165/0.5)] hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="max-h-[calc(90vh-200px)] overflow-y-auto scroll-alien p-5 sm:p-6">
              {/* Certificate image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="relative mb-5 overflow-hidden rounded-xl border border-[oklch(0.82_0.22_165/0.2)]"
              >
                <img
                  src={certificate.image}
                  alt={`${certificate.title} certificate`}
                  className="w-full"
                />
                {/* Corner brackets */}
                <span className="absolute left-2 top-2 h-4 w-4 border-l border-t border-[oklch(0.82_0.22_165/0.6)]" />
                <span className="absolute right-2 top-2 h-4 w-4 border-r border-t border-[oklch(0.82_0.22_165/0.6)]" />
                <span className="absolute bottom-2 left-2 h-4 w-4 border-b border-l border-[oklch(0.82_0.22_165/0.6)]" />
                <span className="absolute bottom-2 right-2 h-4 w-4 border-b border-r border-[oklch(0.82_0.22_165/0.6)]" />
                {/* Caption */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-[oklch(0.82_0.22_165/0.3)] bg-[oklch(0.04_0.02_280/0.8)] px-3 py-0.5 font-mono text-[8px] tracking-[0.2em] text-[oklch(0.82_0.22_165)] backdrop-blur-sm">
                  ▸ VERIFIED DOCUMENT · {certificate.certId}
                </div>
              </motion.div>

              {/* Metadata grid */}
              <div className="mb-5 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Hash, label: "CERT ID", value: certificate.certId },
                  { icon: Calendar, label: "ISSUED", value: certificate.issueDate },
                  { icon: Calendar, label: "DURATION", value: certificate.duration },
                  { icon: User, label: "TRAINER", value: certificate.trainer },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center gap-3 rounded-xl border border-[oklch(0.82_0.22_165/0.12)] bg-[oklch(0.08_0.02_280/0.4)] p-3"
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: `${accentMap[certificate.accent].color} / 0.12)` }}
                    >
                      <row.icon
                        className="h-4 w-4"
                        style={{ color: accentMap[certificate.accent].color }}
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                        {row.label}
                      </div>
                      <div className="truncate text-sm font-medium text-foreground">
                        {row.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills acquired */}
              <div className="mb-5">
                <div className="mb-2 font-mono text-[10px] tracking-[0.2em] text-[oklch(0.78_0.20_195)]">
                  ▸ SKILLS ACQUIRED
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {certificate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[oklch(0.82_0.22_165/0.15)] bg-[oklch(0.10_0.02_280/0.5)] px-2.5 py-1 font-mono text-[11px] text-foreground/80"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: accentMap[certificate.accent].color }}
                      />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Verification notice */}
              <div className="rounded-xl border border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.10_0.02_280/0.4)] p-4">
                <div className="mb-2 flex items-center gap-2">
                  <ShieldCheck
                    className="h-4 w-4"
                    style={{ color: accentMap[certificate.accent].color }}
                  />
                  <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                    VERIFICATION PROTOCOL
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-foreground/75">
                  Email{" "}
                  <a
                    href={`mailto:${certificate.verifyEmail}?subject=Certificate Validation - ${certificate.certId}`}
                    className="inline-flex items-center gap-0.5 font-medium underline decoration-dotted underline-offset-2"
                    style={{ color: accentMap[certificate.accent].color }}
                  >
                    {certificate.verifyEmail}
                    <Mail className="h-3 w-3" />
                  </a>{" "}
                  with the certificate number ({certificate.certId}), name, and
                  &quot;certificate validation&quot; in the subject heading to verify
                  authenticity.
                </p>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="flex items-center justify-between gap-3 border-t border-[oklch(0.82_0.22_165/0.15)] bg-[oklch(0.08_0.02_280/0.5)] p-4 sm:px-6">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.82_0.22_165)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[oklch(0.82_0.22_165)]" />
                </span>
                <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                  AUTHENTIC · ISSUED {certificate.issueDate.toUpperCase()}
                </span>
              </div>
              <div className="flex gap-2">
                <a
                  href={certificate.image}
                  download
                  className="flex items-center gap-1.5 rounded-xl border border-[oklch(0.82_0.22_165/0.3)] bg-[oklch(0.10_0.02_280/0.6)] px-3 py-2 font-display text-xs font-bold tracking-wider transition-all hover:border-[oklch(0.82_0.22_165/0.6)]"
                >
                  <Download className="h-3.5 w-3.5 text-[oklch(0.82_0.22_165)]" />
                  <span className="hidden sm:inline">DOWNLOAD</span>
                </a>
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 rounded-xl bg-[oklch(0.82_0.22_165)] px-4 py-2 font-display text-xs font-bold tracking-wider text-[oklch(0.10_0.02_280)] transition-all hover:shadow-[0_0_20px_rgba(120,255,200,0.5)]"
                >
                  CLOSE
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
