"use client"

import { useEffect, useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Loader2, MapPin, PenLine, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import SectionHeading from "./SectionHeading"
import Reveal from "./Reveal"

interface GuestbookEntry {
  id: string
  name: string
  message: string
  country: string
  createdAt: string
}

interface GuestbookListResponse {
  success: boolean
  entries: GuestbookEntry[]
}

interface GuestbookPostResponse {
  success: boolean
  entry?: GuestbookEntry
  error?: string
}

const MAX_MESSAGE_LENGTH = 280

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.charAt(0) ?? ""
  const second = parts[1]?.charAt(0) ?? ""
  const initials = (first + second).toUpperCase()
  return initials.length > 0 ? initials : "?"
}

export default function Guestbook() {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [country, setCountry] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function loadEntries() {
      try {
        const res = await fetch("/api/guestbook")
        const data = (await res.json()) as GuestbookListResponse
        if (!cancelled && data.success) {
          setEntries(data.entries)
        }
      } catch {
        // silent — list stays empty, user can still sign
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadEntries()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmedName = name.trim()
    const trimmedCountry = country.trim()
    const trimmedMessage = message.trim()

    if (trimmedName.length < 2) {
      toast({
        variant: "destructive",
        title: "Name too short",
        description: "Please enter at least 2 characters.",
      })
      return
    }
    if (trimmedMessage.length < 3) {
      toast({
        variant: "destructive",
        title: "Message too short",
        description: "Please write at least 3 characters.",
      })
      return
    }

    setSending(true)
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          country: trimmedCountry,
          message: trimmedMessage,
        }),
      })
      const data = (await res.json()) as GuestbookPostResponse

      if (!res.ok || !data.success || !data.entry) {
        toast({
          variant: "destructive",
          title: "Entry not saved",
          description: data.error ?? "Could not sign the guestbook. Try again.",
        })
        return
      }

      toast({
        title: "Entry saved",
        description: "Thanks for signing!",
      })
      setEntries((prev) => [data.entry as GuestbookEntry, ...prev])
      setName("")
      setCountry("")
      setMessage("")
    } catch {
      toast({
        variant: "destructive",
        title: "Entry not saved",
        description: "Network issue — please try again.",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="guestbook" className="relative overflow-hidden py-24 sm:py-32">
      {/* Ambient layers */}
      <div className="star-field absolute inset-0 opacity-40" aria-hidden="true" />
      <div
        className="absolute -left-28 top-24 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -right-28 bottom-16 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="guestbook"
          title={
            <>
              Guest<span className="text-gradient">book</span>
            </>
          }
          description="Leave a message — notes from visitors appear here."
        />

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          {/* LEFT — form */}
          <Reveal>
            <form noValidate onSubmit={handleSubmit} className="glass rounded-2xl p-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-fuchsia-300">
                New Entry
              </h3>

              <div className="mt-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="guestbook-name" className="text-xs uppercase tracking-widest">
                    Name
                  </Label>
                  <Input
                    id="guestbook-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name, traveler"
                    required
                    maxLength={60}
                    className="border-white/10 bg-white/5 focus-visible:ring-fuchsia-400/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestbook-country" className="text-xs uppercase tracking-widest">
                    Country <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="guestbook-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. India"
                    maxLength={60}
                    className="border-white/10 bg-white/5 focus-visible:ring-fuchsia-400/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestbook-message" className="text-xs uppercase tracking-widest">
                    Message
                  </Label>
                  <Textarea
                    id="guestbook-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write something for the stars..."
                    required
                    rows={4}
                    maxLength={MAX_MESSAGE_LENGTH}
                    className="resize-none border-white/10 bg-white/5 focus-visible:ring-fuchsia-400/50"
                  />
                  <p
                    className="text-right font-mono text-[10px] text-muted-foreground"
                    aria-live="polite"
                  >
                    {message.length}/{MAX_MESSAGE_LENGTH}
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={sending}
                  className="h-11 w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 font-semibold text-white hover:opacity-90 disabled:opacity-60"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <PenLine className="h-4 w-4" aria-hidden="true" />
                      Sign the Guestbook
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Reveal>

          {/* RIGHT — entries */}
          <Reveal delay={0.15}>
            <div>
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Recent Travelers
                </h3>
                <span className="chip text-[10px]">{entries.length} signed</span>
              </div>

              <div className="custom-scroll mt-5 max-h-[480px] space-y-4 overflow-y-auto pr-2">
                {loading ? (
                  [0, 1, 2].map((i) => (
                    <div key={i} className="glass rounded-xl p-4">
                      <div className="flex gap-3.5">
                        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-3.5 w-32" />
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : entries.length === 0 ? (
                  <div className="glass rounded-xl p-10 text-center">
                    <Sparkles className="mx-auto h-6 w-6 text-amber-300" aria-hidden="true" />
                    <p className="font-display mt-4 text-lg font-semibold">
                      Be the first to sign
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Your message will light up this constellation.
                    </p>
                  </div>
                ) : (
                  entries.map((entry) => (
                    <motion.article
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
                      className="glass flex gap-3.5 rounded-xl p-4"
                    >
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-violet-500/40 to-fuchsia-500/40 font-display text-sm font-bold"
                        aria-hidden="true"
                      >
                        {getInitials(entry.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="text-sm font-semibold">{entry.name}</span>
                          {entry.country ? (
                            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                              <MapPin className="h-3 w-3" aria-hidden="true" />
                              {entry.country}
                            </span>
                          ) : null}
                          <time className="ml-auto font-mono text-[10px] text-muted-foreground">
                            {format(new Date(entry.createdAt), "d MMM yyyy")}
                          </time>
                        </div>
                        <p className="mt-1 break-words text-sm leading-relaxed text-muted-foreground">
                          {entry.message}
                        </p>
                      </div>
                    </motion.article>
                  ))
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
