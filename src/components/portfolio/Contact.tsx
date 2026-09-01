"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Send, Radio, Mail, Github, Linkedin, CheckCircle2 } from "lucide-react";
import { PROFILE } from "@/lib/portfolio-data";
import { SectionHeading } from "./SectionHeading";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TransmissionCounter } from "./TransmissionCounter";

export function Contact() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    frequency: "EARTH",
    message: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({
        title: "Signal incomplete",
        description: "Name, email and message are required to transmit.",
        variant: "destructive",
      });
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("transmission failed");
      setSent(true);
      toast({
        title: "Signal transmitted",
        description: "Your message has been beamed across the cosmos.",
      });
      setForm({ name: "", email: "", frequency: "EARTH", message: "" });
    } catch {
      toast({
        title: "Transmission failed",
        description: "Cosmic interference detected. Try again later.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
      setTimeout(() => setSent(false), 4000);
    }
  };

  return (
    <section id="contact" className="relative px-4 py-20 sm:py-28">
      <div className="pointer-events-none absolute right-1/4 top-0 h-72 w-72 rounded-full bg-[oklch(0.82_0.22_165/0.06)] blur-3xl" />

      <div className="mx-auto max-w-5xl">
        <SectionHeading
          index="11 // SIGNAL"
          title="OPEN A CHANNEL"
          subtitle="Transmit a message across the void — I monitor all incoming frequencies."
          accent="cyan"
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <div className="relative overflow-hidden rounded-2xl glass-panel p-6">
              <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-[oklch(0.78_0.20_195/0.1)] blur-3xl" />
              <div className="relative">
                <div className="mb-4 flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.82_0.22_165)] opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[oklch(0.82_0.22_165)]" />
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground">
                    RECEIVER ONLINE
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold">
                  Receiver: <span className="text-gradient-alien">Sachin Kumar</span>
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Currently docked at Government Engineering College, Sheikhpura.
                  Open to collaboration, mentorship and cosmic-grade projects.
                </p>
                {/* Live transmission counter */}
                <div className="mt-4">
                  <TransmissionCounter />
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="grid gap-3">
              {[
                {
                  icon: Mail,
                  label: "EMAIL",
                  value: "sachin@example.com",
                  href: "mailto:sachin@example.com",
                  color: "alien",
                },
                {
                  icon: Github,
                  label: "GITHUB",
                  value: "@sachinkumar",
                  href: "#",
                  color: "cyan",
                },
                {
                  icon: Linkedin,
                  label: "LINKEDIN",
                  value: "in/sachinkumar",
                  href: "#",
                  color: "plasma",
                },
              ].map((s) => {
                const color =
                  s.color === "alien"
                    ? "oklch(0.82 0.22 165)"
                    : s.color === "cyan"
                    ? "oklch(0.78 0.20 195)"
                    : "oklch(0.72 0.25 320)";
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    className="group flex items-center gap-3 rounded-xl border border-[oklch(0.82_0.22_165/0.15)] bg-[oklch(0.10_0.02_280/0.5)] p-3.5 transition-all hover:border-[oklch(0.82_0.22_165/0.4)] hover:bg-[oklch(0.12_0.03_280/0.6)]"
                  >
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
                      style={{
                        background: `${color} / 0.12`,
                        border: `1px solid ${color} / 0.3`,
                      } as React.CSSProperties}
                    >
                      <s.icon className="h-4.5 w-4.5" style={{ color }} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                        {s.label}
                      </div>
                      <div className="truncate text-sm font-medium text-foreground">
                        {s.value}
                      </div>
                    </div>
                    <Send
                      className="h-3.5 w-3.5 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-[oklch(0.82_0.22_165)]"
                    />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Transmission form */}
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 scanlines"
          >
            <div className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-[oklch(0.72_0.25_320/0.1)] blur-3xl" />
            <div className="relative">
              {/* Terminal header */}
              <div className="mb-5 flex items-center justify-between border-b border-[oklch(0.82_0.22_165/0.15)] pb-3">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-[oklch(0.82_0.22_165)] animate-flicker" />
                  <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                    /transmit/new-signal
                  </span>
                </div>
                <span className="font-mono text-[9px] tracking-[0.2em] text-[oklch(0.82_0.22_165)]">
                  ENCRYPTED
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                    SENDER NAME *
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Your identifier"
                    className="border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.08_0.02_280/0.6)] font-mono text-sm placeholder:text-muted-foreground/50 focus-visible:border-[oklch(0.82_0.22_165)] focus-visible:ring-[oklch(0.82_0.22_165/0.3)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                    RETURN FREQUENCY *
                  </label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="you@sector.io"
                    className="border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.08_0.02_280/0.6)] font-mono text-sm placeholder:text-muted-foreground/50 focus-visible:border-[oklch(0.82_0.22_165)] focus-visible:ring-[oklch(0.82_0.22_165/0.3)]"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                  MESSAGE PAYLOAD *
                </label>
                <Textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Encode your transmission here..."
                  rows={5}
                  className="resize-none border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.08_0.02_280/0.6)] font-mono text-sm placeholder:text-muted-foreground/50 focus-visible:border-[oklch(0.82_0.22_165)] focus-visible:ring-[oklch(0.82_0.22_165/0.3)]"
                />
              </div>

              <Button
                type="submit"
                disabled={sending}
                className="group relative mt-5 h-12 w-full overflow-hidden bg-[oklch(0.82_0.22_165)] font-display text-sm font-bold tracking-wider text-[oklch(0.10_0.02_280)] hover:bg-[oklch(0.88_0.22_165)] hover:shadow-[0_0_30px_rgba(120,255,200,0.5)] disabled:opacity-60"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                {sent ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    SIGNAL RECEIVED
                  </>
                ) : sending ? (
                  <>
                    <Radio className="mr-2 h-4 w-4 animate-pulse" />
                    TRANSMITTING...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    TRANSMIT SIGNAL
                  </>
                )}
              </Button>

              <p className="mt-3 text-center font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                AVG RESPONSE: 24 EARTH HOURS · ENCRYPTED CHANNEL
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
