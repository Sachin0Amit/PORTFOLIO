"use client"

import { useState, type FormEvent } from "react"
import {
  Github,
  GraduationCap,
  Instagram,
  Languages,
  Linkedin,
  Loader2,
  Send,
  Twitter,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import SectionHeading from "./SectionHeading"
import Reveal from "./Reveal"
import { PERSONAL } from "@/lib/portfolio-data"

interface ContactPostResponse {
  success: boolean
  message?: string
  error?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const INFO_ITEMS = [
  {
    icon: GraduationCap,
    label: "Currently",
    value: "B.Tech CSE — Government Engineering College, Sheikhpura",
  },
  {
    icon: Languages,
    label: "Learning",
    value: "German (Deutsch) · Japanese (日本語)",
  },
] as const

const SOCIALS = [
  { icon: Github, label: "Sachin Kumar on GitHub" },
  { icon: Linkedin, label: "Sachin Kumar on LinkedIn" },
  { icon: Twitter, label: "Sachin Kumar on Twitter" },
  { icon: Instagram, label: "Sachin Kumar on Instagram" },
] as const

export default function Contact() {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("Hello")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [delivered, setDelivered] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedMessage = message.trim()

    if (trimmedName.length < 2) {
      toast({
        variant: "destructive",
        title: "Invalid name",
        description: "Please enter at least 2 characters.",
      })
      return
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please provide a valid email address.",
      })
      return
    }
    if (trimmedMessage.length < 10) {
      toast({
        variant: "destructive",
        title: "Message too short",
        description: "Please write at least 10 characters.",
      })
      return
    }

    setSending(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          subject: subject.trim() || "Hello",
          message: trimmedMessage,
        }),
      })
      const data = (await res.json()) as ContactPostResponse

      if (!res.ok || !data.success) {
        toast({
          variant: "destructive",
          title: "Message not sent",
          description: data.error ?? "Something went wrong. Please try again later.",
        })
        return
      }

      toast({
        title: "Message sent",
        description: data.message ?? "Sachin will get back to you soon.",
      })
      setName("")
      setEmail("")
      setSubject("Hello")
      setMessage("")
      setDelivered(true)
      window.setTimeout(() => setDelivered(false), 5000)
    } catch {
      toast({
        variant: "destructive",
        title: "Message not sent",
        description: "Network issue — please try again.",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-32">
      {/* Ambient layers */}
      <div className="grid-bg absolute inset-0 opacity-40" aria-hidden="true" />
      <div
        className="absolute -left-28 bottom-12 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="contact"
          title={
            <>Get in <span className="text-gradient">Touch</span></>
          }
          description="Have a question, an idea, or just want to say hello? Send me a message and I'll get back to you."
        />

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-2">
          {/* LEFT — statement + info */}
          <Reveal>
            <p className="font-display text-2xl leading-snug sm:text-3xl">
              Have an idea, an opportunity, or just want to say{" "}
              <span className="text-gradient">hello</span>?
            </p>

            <ul className="mt-8 space-y-4">
              {INFO_ITEMS.map((item) => (
                <li key={item.label} className="flex items-center gap-3.5">
                  <div className="glass flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                    <item.icon className="h-5 w-5 text-fuchsia-300" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium">{item.value}</p>
                  </div>
                </li>
              ))}
              <li className="flex items-center gap-3.5">
                <div className="glass flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                  <Zap className="h-5 w-5 text-fuchsia-300" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Status
                  </p>
                  <p className="flex items-center gap-2 text-sm font-medium text-amber-300">
                    <span
                      className="animate-pulse-glow h-1.5 w-1.5 rounded-full bg-amber-300"
                      aria-hidden="true"
                    />
                    {PERSONAL.availability}
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-8 flex gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="glass focus-visible:ring-2 focus-visible:ring-fuchsia-400/60 flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-400/50 hover:text-fuchsia-300 focus-visible:outline-none"
                >
                  <social.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </Reveal>

          {/* RIGHT — message form */}
          <Reveal delay={0.15}>
            <div className="glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-8">
              <div
                className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-fuchsia-500/15 blur-3xl"
                aria-hidden="true"
              />

              <p className="kicker relative">{"// SEND A MESSAGE"}</p>

              <form noValidate onSubmit={handleSubmit} className="relative mt-6 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name" className="text-xs uppercase tracking-widest">
                      Name
                    </Label>
                    <Input
                      id="contact-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      maxLength={80}
                      className="border-white/10 bg-white/5 focus-visible:ring-fuchsia-400/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email" className="text-xs uppercase tracking-widest">
                      Email
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      maxLength={120}
                      className="border-white/10 bg-white/5 focus-visible:ring-fuchsia-400/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-subject" className="text-xs uppercase tracking-widest">
                    Subject
                  </Label>
                  <Input
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Hello"
                    maxLength={120}
                    className="border-white/10 bg-white/5 focus-visible:ring-fuchsia-400/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message" className="text-xs uppercase tracking-widest">
                    Message
                  </Label>
                  <Textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me about your idea, opportunity, or just say hello..."
                    required
                    rows={5}
                    maxLength={2000}
                    className="resize-none border-white/10 bg-white/5 focus-visible:ring-fuchsia-400/50"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={sending}
                  className="glow-violet h-12 w-full rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400 font-semibold text-white hover:opacity-90 disabled:opacity-60"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" aria-hidden="true" />
                      Send Message
                    </>
                  )}
                </Button>

                {delivered ? (
                  <p
                    className="chip justify-center border-amber-300/40 text-center text-amber-300"
                    role="status"
                  >
                    Message delivered — talk soon!
                  </p>
                ) : null}
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
