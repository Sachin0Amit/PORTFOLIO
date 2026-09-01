"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Star, ShieldCheck, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { playSound } from "@/hooks/use-sound";

interface TestimonialFormProps {
  onSubmitted: () => void;
}

const ACCENT_OPTIONS = [
  { value: "alien", label: "Biolume", color: "oklch(0.82 0.22 165)" },
  { value: "cyan", label: "Cyan", color: "oklch(0.78 0.20 195)" },
  { value: "plasma", label: "Plasma", color: "oklch(0.72 0.25 320)" },
] as const;

/**
 * Testimonial submission form. Collects: author name, role/what they do,
 * relationship to Sachin, an optional verification link (LinkedIn/email),
 * a star rating, and the quote. Plays success sound on submit.
 */
export function TestimonialForm({ onSubmitted }: TestimonialFormProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [rating, setRating] = useState(5);
  const [accent, setAccent] = useState<"alien" | "cyan" | "plasma">("alien");
  const [form, setForm] = useState({
    author: "",
    role: "",
    relation: "",
    quote: "",
    verifyLink: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.author || !form.role || !form.quote) {
      toast({
        title: "Signal incomplete",
        description: "Name, role and your testimonial are required.",
        variant: "destructive",
      });
      return;
    }
    if (form.quote.trim().length < 10) {
      toast({
        title: "Testimonial too short",
        description: "Please write at least 10 characters.",
        variant: "destructive",
      });
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating, accent }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "transmission failed");
      }
      playSound("success");
      toast({
        title: "Testimonial broadcast",
        description: "Your signal has been added to the network.",
      });
      setForm({ author: "", role: "", relation: "", quote: "", verifyLink: "" });
      setRating(5);
      setAccent("alien");
      setOpen(false);
      onSubmitted();
    } catch (err) {
      toast({
        title: "Broadcast failed",
        description: err instanceof Error ? err.message : "Cosmic interference detected.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => {
          setOpen(true);
          playSound("open");
        }}
        className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-[oklch(0.82_0.22_165)] px-5 py-2.5 font-display text-xs font-bold tracking-wider text-[oklch(0.10_0.02_280)] transition-all hover:shadow-[0_0_25px_rgba(120,255,200,0.5)]"
      >
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <Send className="h-3.5 w-3.5" />
        LEAVE A TESTIMONIAL
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9996] flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-[oklch(0.04_0.02_280/0.85)] backdrop-blur-md"
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl glass-panel holo-border"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[oklch(0.82_0.22_165/0.15)] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[oklch(0.82_0.22_165/0.3)] bg-[oklch(0.82_0.22_165/0.1)]">
                    <ShieldCheck className="h-4 w-4 text-[oklch(0.82_0.22_165)]" />
                  </span>
                  <div>
                    <div className="font-display text-sm font-bold tracking-wide">
                      VERIFY & BROADCAST
                    </div>
                    <div className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                      TELL THE NETWORK WHO YOU ARE
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.10_0.02_280/0.6)] text-muted-foreground transition-all hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={onSubmit} className="max-h-[70vh] overflow-y-auto scroll-alien p-5">
                {/* Verification notice */}
                <div className="mb-4 rounded-xl border border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.10_0.02_280/0.4)] p-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-[oklch(0.82_0.22_165)]" />
                    <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                      IDENTITY VERIFICATION
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-foreground/70">
                    Tell the network who you are and how you know Sachin. Add a
                    LinkedIn or email link so your signal can be verified.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                      YOUR NAME *
                    </label>
                    <Input
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                      placeholder="e.g. Rakesh Deka"
                      maxLength={120}
                      className="border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.08_0.02_280/0.6)] font-mono text-sm placeholder:text-muted-foreground/50 focus-visible:border-[oklch(0.82_0.22_165)] focus-visible:ring-[oklch(0.82_0.22_165/0.3)]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                      WHAT YOU DO *
                    </label>
                    <Input
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      placeholder="e.g. Faculty Mentor"
                      maxLength={120}
                      className="border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.08_0.02_280/0.6)] font-mono text-sm placeholder:text-muted-foreground/50 focus-visible:border-[oklch(0.82_0.22_165)] focus-visible:ring-[oklch(0.82_0.22_165/0.3)]"
                    />
                  </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                      RELATION TO SACHIN
                    </label>
                    <Input
                      value={form.relation}
                      onChange={(e) => setForm({ ...form, relation: e.target.value })}
                      placeholder="e.g. Senior Batchmate"
                      maxLength={120}
                      className="border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.08_0.02_280/0.6)] font-mono text-sm placeholder:text-muted-foreground/50 focus-visible:border-[oklch(0.82_0.22_165)] focus-visible:ring-[oklch(0.82_0.22_165/0.3)]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                      VERIFY LINK (OPTIONAL)
                    </label>
                    <Input
                      value={form.verifyLink}
                      onChange={(e) => setForm({ ...form, verifyLink: e.target.value })}
                      placeholder="LinkedIn / email / URL"
                      maxLength={300}
                      className="border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.08_0.02_280/0.6)] font-mono text-sm placeholder:text-muted-foreground/50 focus-visible:border-[oklch(0.82_0.22_165)] focus-visible:ring-[oklch(0.82_0.22_165/0.3)]"
                    />
                  </div>
                </div>

                {/* Rating + accent */}
                <div className="mt-3 flex items-center justify-between gap-4 rounded-xl border border-[oklch(0.82_0.22_165/0.15)] bg-[oklch(0.08_0.02_280/0.4)] p-3">
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                      RATING
                    </div>
                    <div className="mt-1 flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setRating(n)}
                          aria-label={`${n} stars`}
                        >
                          <Star
                            className={`h-5 w-5 transition-all ${
                              n <= rating
                                ? "fill-[oklch(0.82_0.22_165)] text-[oklch(0.82_0.22_165)]"
                                : "text-muted-foreground/40 hover:text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                      ACCENT
                    </div>
                    <div className="mt-1 flex gap-1.5">
                      {ACCENT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setAccent(opt.value as typeof accent)}
                          aria-label={opt.label}
                          className={`h-6 w-6 rounded-full border-2 transition-all ${
                            accent === opt.value
                              ? "scale-110 border-white"
                              : "border-transparent opacity-50 hover:opacity-100"
                          }`}
                          style={{ background: opt.color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <div className="mt-3 space-y-1.5">
                  <label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                    YOUR TESTIMONIAL *
                  </label>
                  <Textarea
                    value={form.quote}
                    onChange={(e) => setForm({ ...form, quote: e.target.value })}
                    placeholder="Share your experience working with Sachin..."
                    rows={4}
                    maxLength={600}
                    className="resize-none border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.08_0.02_280/0.6)] font-mono text-sm placeholder:text-muted-foreground/50 focus-visible:border-[oklch(0.82_0.22_165)] focus-visible:ring-[oklch(0.82_0.22_165/0.3)]"
                  />
                  <div className="text-right font-mono text-[9px] text-muted-foreground">
                    {form.quote.length}/600
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={sending}
                  className="group relative mt-2 h-11 w-full overflow-hidden bg-[oklch(0.82_0.22_165)] font-display text-sm font-bold tracking-wider text-[oklch(0.10_0.02_280)] hover:bg-[oklch(0.88_0.22_165)] hover:shadow-[0_0_25px_rgba(120,255,200,0.5)] disabled:opacity-60"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  {sending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      BROADCASTING...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      BROADCAST TESTIMONIAL
                    </>
                  )}
                </Button>
                <p className="mt-2 text-center font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                  YOUR SIGNAL APPEARS IMMEDIATELY · BE RESPECTFUL
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
