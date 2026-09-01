"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Github,
  Swords,
  RefreshCw,
  ExternalLink,
  SatelliteDish,
  AlertTriangle,
  Radio,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import type {
  CodeforcesHistoryPoint,
  CodeforcesStats,
  DayCount,
  GitHubStats,
  LeetCodeStats,
  PlatformResponse,
} from "@/lib/platform-types";

/* ================= platform visual config ================= */
const PLATFORM_UI = {
  leetcode: {
    name: "LEETCODE",
    icon: Code2,
    channel: "CH·01",
    text: "text-[oklch(0.75_0.22_90)]",
    border: "border-[oklch(0.75_0.22_90/0.22)]",
    bgIcon: "bg-[oklch(0.75_0.22_90/0.12)]",
    edge: "via-[oklch(0.75_0.22_90/0.55)]",
    ring: "oklch(0.75 0.22 90)",
  },
  codeforces: {
    name: "CODEFORCES",
    icon: Swords,
    channel: "CH·02",
    text: "text-[oklch(0.72_0.25_320)]",
    border: "border-[oklch(0.72_0.25_320/0.25)]",
    bgIcon: "bg-[oklch(0.72_0.25_320/0.12)]",
    edge: "via-[oklch(0.72_0.25_320/0.55)]",
    ring: "oklch(0.72 0.25 320)",
  },
  github: {
    name: "GITHUB",
    icon: Github,
    channel: "CH·03",
    text: "text-[oklch(0.78_0.20_195)]",
    border: "border-[oklch(0.78_0.20_195/0.22)]",
    bgIcon: "bg-[oklch(0.78_0.20_195/0.12)]",
    edge: "via-[oklch(0.78_0.20_195/0.55)]",
    ring: "oklch(0.78 0.20 195)",
  },
} as const;

const ORDER = ["leetcode", "codeforces", "github"] as const;

/* ================= Codeforces rank tier ================= */
function cfTier(rank: string | null): { label: string; text: string } {
  const r = (rank ?? "").toLowerCase();
  if (r.includes("legendary"))
    return { label: "LEGENDARY GM", text: "text-[oklch(0.72_0.25_320)]" };
  if (r.includes("grandmaster"))
    return { label: "GRANDMASTER", text: "text-[oklch(0.72_0.25_320/0.9)]" };
  if (r.includes("master"))
    return { label: r.replace(/\b\w/g, (c) => c.toUpperCase()), text: "text-[oklch(0.75_0.22_90)]" };
  if (r.includes("expert"))
    return { label: "EXPERT", text: "text-[oklch(0.78_0.20_195)]" };
  if (r.includes("specialist"))
    return { label: "SPECIALIST", text: "text-[oklch(0.78_0.20_195/0.85)]" };
  if (r.includes("pupil"))
    return { label: "PUPIL", text: "text-foreground/85" };
  return { label: "NEWCOMER", text: "text-muted-foreground" };
}

/* ================= LeetCode ring geometry ================= */
const LC_TOTAL_APPROX = 3600;
const RING_R = 34;
const RING_C = 2 * Math.PI * RING_R;

/* ================= main component ================= */
export function Platforms() {
  const [data, setData] = useState<PlatformResponse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const load = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const res = await fetch("/api/platforms", { cache: "no-store" });
      const json = (await res.json()) as {
        ok: boolean;
        platforms: PlatformResponse[];
      };
      if (json.ok) {
        setData(json.platforms);
        setLastSync(new Date());
      }
    } catch {
      /* keep previous data on transient failure */
    } finally {
      setLoading(false);
      if (manual) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(() => load(), 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [load]);

  const byPlatform = new Map((data ?? []).map((p) => [p.platform, p]));
  const degradedCount = (data ?? []).filter(
    (p) => p.status === "degraded" || p.status === "disabled"
  ).length;
  const connectedCount = (data ?? []).filter((p) => p.connected).length;
  const syncTime = lastSync
    ? lastSync.toLocaleTimeString("en-GB", { hour12: false })
    : "--:--:--";

  return (
    <section id="platforms" className="relative px-4 py-20 sm:py-28">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute right-1/4 top-16 h-64 w-72 rounded-full bg-[oklch(0.78_0.20_195/0.05)] blur-3xl" />

      <div className="mx-auto max-w-5xl">
        <SectionHeading
          index="07 // UPLINK"
          title="CODING UPLINK"
          subtitle="Live signals from LeetCode, Codeforces and GitHub — synced straight from each platform's public API."
          accent="cyan"
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {ORDER.map((id, i) => (
            <PlatformCard
              key={id}
              index={i}
              data={byPlatform.get(id) ?? null}
              loading={loading}
            />
          ))}
        </div>

        {/* Sync strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[oklch(0.82_0.22_165/0.15)] bg-[oklch(0.09_0.02_280/85)] px-4 py-2.5 backdrop-blur-md"
        >
          <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
            <Radio className="h-3 w-3 text-[oklch(0.82_0.22_165)]" />
            <span>
              UPLINKS {connectedCount}/3 ACTIVE · LAST SYNC {syncTime} · AUTO 10M
            </span>
            {degradedCount > 0 && (
              <span className="text-[oklch(0.75_0.22_90)]">
                · {degradedCount} CHANNEL{degradedCount > 1 ? "S" : ""} DEGRADED
              </span>
            )}
          </div>
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 rounded-lg border border-[oklch(0.82_0.22_165/0.3)] bg-[oklch(0.10_0.02_280/0.6)] px-2.5 py-1.5 font-mono text-[9px] tracking-[0.2em] text-[oklch(0.82_0.22_165)] transition-all hover:border-[oklch(0.82_0.22_165/0.6)] hover:bg-[oklch(0.82_0.22_165/0.1)] disabled:opacity-50"
            aria-label="Refresh platform stats"
          >
            <RefreshCw
              className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`}
            />
            RESYNC
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* ================= card shell ================= */
function PlatformCard({
  index,
  data,
  loading,
}: {
  index: number;
  data: PlatformResponse | null;
  loading: boolean;
}) {
  const id = data?.platform ?? ORDER[index];
  const ui = PLATFORM_UI[id];
  const status = data?.status ?? "standby";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      className={`relative flex flex-col overflow-hidden rounded-2xl border ${ui.border} bg-[oklch(0.09_0.02_280/85)] shadow-[0_0_40px_oklch(0.09_0.02_280/0.8)] backdrop-blur-md`}
    >
      {/* texture + top edge */}
      <div aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-50" />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${ui.edge} to-transparent`}
      />

      {/* header strip */}
      <div className="relative flex items-center gap-2.5 border-b border-white/5 bg-[oklch(0.13_0.04_280/60)] px-4 py-2.5">
        <span className={`flex h-6 w-6 items-center justify-center rounded-md ${ui.bgIcon}`}>
          <ui.icon className={`h-3.5 w-3.5 ${ui.text}`} />
        </span>
        <span className="font-mono text-[10px] tracking-[0.22em] text-foreground/80">
          {ui.name}
        </span>
        <span className="ml-auto font-mono text-[8px] tracking-[0.2em] text-muted-foreground/50">
          {ui.channel}
        </span>
        <StatusBadge status={status} />
      </div>

      {/* body */}
      <div className="relative flex flex-1 flex-col p-5">
        {loading && <CardSkeleton />}
        {!loading && data?.status === "standby" && <StandbyBody />}
        {!loading && data?.status === "degraded" && (
          <DegradedBody error={data.error} />
        )}
        {!loading && data?.status === "live" && data.stats && (
          <LiveBody platform={id} stats={data.stats} />
        )}
        {!loading && !data && <StandbyBody />}
      </div>

      {/* footer */}
      <div className="relative flex items-center justify-between gap-3 border-t border-white/5 px-4 py-2.5">
        <span className="flex min-w-0 items-center gap-2 font-mono text-[9px] tracking-[0.15em] text-muted-foreground">
          {data?.stats &&
            "avatarUrl" in data.stats &&
            data.stats.avatarUrl && (
              <img
                src={data.stats.avatarUrl}
                alt={`${data.label} avatar`}
                className="h-4 w-4 shrink-0 rounded-full border border-white/20 object-cover"
              />
            )}
          <span className="truncate">
            {data?.handle ? `@${data.handle}` : "NO HANDLE LINKED"}
          </span>
        </span>
        {data?.profileUrl ? (
          <a
            href={data.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex shrink-0 items-center gap-1 font-mono text-[9px] tracking-[0.2em] ${ui.text} transition-opacity hover:opacity-70`}
          >
            VIEW PROFILE
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/40">
            OFFLINE
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ================= status badge ================= */
function StatusBadge({ status }: { status: string }) {
  if (status === "live") {
    return (
      <span className="flex items-center gap-1.5 rounded-full border border-[oklch(0.82_0.22_165/0.35)] bg-[oklch(0.82_0.22_165/0.08)] px-2 py-0.5 font-mono text-[8px] tracking-[0.22em] text-[oklch(0.82_0.22_165)]">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.82_0.22_165/0.8)]" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[oklch(0.82_0.22_165)]" />
        </span>
        LIVE
      </span>
    );
  }
  if (status === "degraded") {
    return (
      <span className="flex items-center gap-1.5 rounded-full border border-[oklch(0.72_0.25_320/0.4)] bg-[oklch(0.72_0.25_320/0.1)] px-2 py-0.5 font-mono text-[8px] tracking-[0.22em] text-[oklch(0.72_0.25_320)]">
        <AlertTriangle className="h-2.5 w-2.5" />
        SIGNAL LOST
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-[oklch(0.75_0.22_90/0.35)] bg-[oklch(0.75_0.22_90/0.08)] px-2 py-0.5 font-mono text-[8px] tracking-[0.22em] text-[oklch(0.75_0.22_90)]">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.75_0.22_90)]" />
      STANDBY
    </span>
  );
}

/* ================= body states ================= */
function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3 py-2" aria-hidden>
      <div className="h-10 w-2/3 animate-pulse rounded-lg bg-white/5" />
      <div className="h-3 w-full animate-pulse rounded bg-white/5" />
      <div className="h-3 w-4/5 animate-pulse rounded bg-white/5" />
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-12 animate-pulse rounded-lg bg-white/5"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function StandbyBody() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-6 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-[oklch(0.75_0.22_90/0.4)]">
        <span className="absolute inset-0 animate-ping rounded-full border border-[oklch(0.75_0.22_90/0.15)]" />
        <SatelliteDish className="h-6 w-6 animate-pulse text-[oklch(0.75_0.22_90)]" />
      </div>
      <div className="font-display text-sm font-bold tracking-[0.15em] text-[oklch(0.75_0.22_90)]">
        AWAITING UPLINK
      </div>
      <p className="max-w-[220px] font-mono text-[9px] leading-relaxed tracking-[0.1em] text-muted-foreground">
        PROFILE LINK NOT CONFIGURED — TRANSMIT YOUR HANDLE TO ACTIVATE THIS
        FEED
      </p>
    </div>
  );
}

function DegradedBody({ error }: { error: string | null }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 py-6 text-center">
      <AlertTriangle className="h-7 w-7 text-[oklch(0.72_0.25_320)]" />
      <div className="font-display text-sm font-bold tracking-[0.15em] text-[oklch(0.72_0.25_320)]">
        SIGNAL LOST
      </div>
      <p className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground">
        {error ?? "UPSTREAM UNAVAILABLE"} — AUTO-RETRY ACTIVE
      </p>
    </div>
  );
}

function LiveBody({
  platform,
  stats,
}: {
  platform: (typeof ORDER)[number];
  stats: LeetCodeStats | CodeforcesStats | GitHubStats;
}) {
  if (platform === "leetcode") {
    return <LeetCodeBody stats={stats as LeetCodeStats} />;
  }
  if (platform === "codeforces") {
    return <CodeforcesBody stats={stats as CodeforcesStats} />;
  }
  return <GitHubBody stats={stats as GitHubStats} />;
}

/* ================= activity heatmap (shared) ================= */

const HEAT_WEEKS = 52;
const HEAT_CELL = 4; // px
const HEAT_GAP = 1; // px
const HEAT_STEP = HEAT_CELL + HEAT_GAP;

/** Per-platform intensity palettes (level 0 → 4). */
const HEAT_PALETTES = {
  amber: [
    "bg-white/[0.05]",
    "bg-[oklch(0.75_0.22_90/0.3)]",
    "bg-[oklch(0.75_0.22_90/0.5)]",
    "bg-[oklch(0.75_0.22_90/0.75)]",
    "bg-[oklch(0.75_0.22_90)] shadow-[0_0_5px_oklch(0.75_0.22_90/0.5)]",
  ],
  cyan: [
    "bg-white/[0.05]",
    "bg-[oklch(0.78_0.20_195/0.3)]",
    "bg-[oklch(0.78_0.20_195/0.5)]",
    "bg-[oklch(0.78_0.20_195/0.75)]",
    "bg-[oklch(0.78_0.20_195)] shadow-[0_0_5px_oklch(0.78_0.20_195/0.5)]",
  ],
} as const;

type HeatPalette = keyof typeof HEAT_PALETTES;

interface HeatWeek {
  cells: { date: string; count: number; future: boolean }[];
  monthLabel: string | null;
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

/** Build the trailing 52-week grid (Sun-first columns, last col = current week). */
function buildHeatWeeks(days: DayCount[]): HeatWeek[] {
  const map = new Map(days.map((d) => [d.date, d.count]));
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const lastSunday = new Date(today);
  lastSunday.setDate(today.getDate() - today.getDay());

  const weeks: HeatWeek[] = [];
  let prevMonth = -1;
  for (let w = HEAT_WEEKS - 1; w >= 0; w--) {
    const weekStart = new Date(lastSunday);
    weekStart.setDate(lastSunday.getDate() - w * 7);
    const cells: { date: string; count: number; future: boolean }[] = [];
    for (let dow = 0; dow < 7; dow++) {
      const dt = new Date(weekStart);
      dt.setDate(weekStart.getDate() + dow);
      const future = dt > today;
      cells.push({
        date: future ? "" : dateKey(dt),
        count: future ? 0 : (map.get(dateKey(dt)) ?? 0),
        future,
      });
    }
    const m = weekStart.getMonth();
    const monthLabel = m !== prevMonth ? weekStart.toLocaleDateString("en", { month: "short" }) : null;
    if (m !== prevMonth) prevMonth = m;
    weeks.push({ cells, monthLabel });
  }
  return weeks;
}

function heatLevel(count: number, thresholds: number[]): number {
  if (count <= 0) return 0;
  if (count >= thresholds[2]) return 4;
  if (count >= thresholds[1]) return 3;
  if (count >= thresholds[0]) return 2;
  return 1;
}

function MiniHeatmap({
  days,
  thresholds,
  unit,
  palette,
}: {
  days: DayCount[];
  thresholds: number[];
  unit: string;
  palette: HeatPalette;
}) {
  const weeks = useMemo(() => buildHeatWeeks(days), [days]);
  const activeTotal = days.reduce((s, d) => s + d.count, 0);
  const levels = HEAT_PALETTES[palette];

  return (
    <div>
      <div className="w-fit">
        {/* month labels */}
        <div className="relative mb-1 h-[8px]" aria-hidden>
          {weeks.map((wk, wi) =>
            wk.monthLabel ? (
              <span
                key={wk.cells[0].date || wi}
                className="absolute font-mono text-[7px] leading-none text-muted-foreground/60"
                style={{ left: `${wi * HEAT_STEP}px` }}
              >
                {wk.monthLabel}
              </span>
            ) : null
          )}
        </div>
        {/* grid */}
        <div className="flex" style={{ gap: `${HEAT_GAP}px` }}>
          {weeks.map((wk, wi) => (
            <div key={wk.cells[0].date || `w-${wi}`} className="flex flex-col" style={{ gap: `${HEAT_GAP}px` }}>
              {wk.cells.map((c, di) => (
                <span
                  key={c.date || `f-${wi}-${di}`}
                  title={
                    c.future || c.date === ""
                      ? undefined
                      : c.count > 0
                        ? `${c.count} ${unit} · ${c.date}`
                        : `0 ${unit} · ${c.date}`
                  }
                  className={`h-[4px] w-[4px] rounded-[1px] ${
                    c.future ? "bg-transparent" : levels[heatLevel(c.count, thresholds)]
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* legend */}
      <div className="mt-2 flex items-center justify-between font-mono text-[7px] tracking-[0.15em] text-muted-foreground/70">
        <span>
          {activeTotal.toLocaleString()} {unit} · 52W
        </span>
        <span className="flex items-center gap-1">
          LESS
          {levels.map((cls, i) => (
            <span key={i} className={`h-[4px] w-[4px] rounded-[1px] ${cls}`} />
          ))}
          MORE
        </span>
      </div>
      <span className="sr-only">
        Activity heatmap: {activeTotal} {unit} over the last 52 weeks.
      </span>
    </div>
  );
}

/* ================= LeetCode ================= */

/** LeetCode stores 5000001 as the "unranked" sentinel for new profiles. */
const LC_UNRANKED_SENTINEL = 5000000;

function relTime(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "—";
  const diff = Math.max(0, Date.now() - t);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d`;
  return `${Math.floor(d / 30)}mo`;
}

function LeetCodeBody({ stats }: { stats: LeetCodeStats }) {
  const pct = Math.min(1, stats.totalSolved / LC_TOTAL_APPROX);
  const ranked = stats.ranking != null && stats.ranking < LC_UNRANKED_SENTINEL;
  const bars = [
    { label: "EASY", count: stats.easy, cls: "bg-[oklch(0.82_0.22_165)]", text: "text-[oklch(0.82_0.22_165)]" },
    { label: "MEDIUM", count: stats.medium, cls: "bg-[oklch(0.75_0.22_90)]", text: "text-[oklch(0.75_0.22_90)]" },
    { label: "HARD", count: stats.hard, cls: "bg-[oklch(0.72_0.25_320)]", text: "text-[oklch(0.72_0.25_320)]" },
  ];
  const maxCount = Math.max(1, stats.easy, stats.medium, stats.hard);

  return (
    <div className="flex flex-1 flex-col gap-5">
      {/* ring + big number */}
      <div className="flex items-center gap-5">
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
            <circle
              cx="40"
              cy="40"
              r={RING_R}
              fill="none"
              stroke="oklch(0.17 0.04 280)"
              strokeWidth="7"
            />
            <motion.circle
              cx="40"
              cy="40"
              r={RING_R}
              fill="none"
              stroke={PLATFORM_UI.leetcode.ring}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              initial={{ strokeDashoffset: RING_C }}
              animate={{ strokeDashoffset: RING_C * (1 - pct) }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "40px 40px" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-black leading-none text-foreground">
              {stats.totalSolved}
            </span>
            <span className="mt-0.5 font-mono text-[7px] tracking-[0.2em] text-muted-foreground">
              SOLVED
            </span>
          </div>
        </div>
        <div className="flex-1 space-y-2.5">
          {bars.map((b) => (
            <div key={b.label}>
              <div className="mb-1 flex items-center justify-between font-mono text-[8px] tracking-[0.18em]">
                <span className={b.text}>{b.label}</span>
                <span className="text-muted-foreground">{b.count}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(b.count / maxCount) * 100}%` }}
                  transition={{ duration: 0.9, delay: 0.25 }}
                  className={`h-full rounded-full ${b.cls}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* meta row */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-white/5 pt-3 font-mono text-[8px] tracking-[0.15em] text-muted-foreground">
        <span>
          GLOBAL RANK{" "}
          {ranked ? (
            <span className="text-[oklch(0.75_0.22_90)]">
              #{stats.ranking?.toLocaleString()}
            </span>
          ) : (
            <span className="text-muted-foreground/60">PENDING</span>
          )}
        </span>
        {stats.contestRating != null ? (
          <span>
            CONTEST <span className="text-[oklch(0.75_0.22_90)]">{stats.contestRating}</span>
          </span>
        ) : (
          <span>
            CONTESTS{" "}
            <span className="text-muted-foreground/60">
              {stats.contestsAttended ?? 0}
            </span>
          </span>
        )}
      </div>

      {/* solving grid */}
      <div className="border-t border-white/5 pt-3">
        <div className="mb-1.5 flex items-center justify-between font-mono text-[8px] tracking-[0.2em] text-muted-foreground">
          <span>SOLVING GRID · 52W</span>
          <span>
            STREAK <span className="text-[oklch(0.75_0.22_90)]">{stats.streak ?? 0}d</span>
            {" · "}ACTIVE{" "}
            <span className="text-[oklch(0.75_0.22_90)]">{stats.totalActiveDays ?? 0}d</span>
          </span>
        </div>
        <MiniHeatmap
          days={stats.submissionDays}
          thresholds={[1, 3, 5, 8]}
          unit="solves"
          palette="amber"
        />
      </div>

      {/* skill signals */}
      {stats.skillTags.length > 0 && (
        <div className="border-t border-white/5 pt-3">
          <div className="mb-1.5 font-mono text-[8px] tracking-[0.2em] text-muted-foreground">
            SKILL SIGNALS
          </div>
          <div className="flex flex-wrap gap-1.5">
            {stats.skillTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[oklch(0.82_0.22_165/0.3)] bg-[oklch(0.82_0.22_165/0.08)] px-2.5 py-0.5 font-mono text-[8px] tracking-[0.1em] text-[oklch(0.82_0.22_165)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* recent solves feed */}
      {stats.recentSolves.length > 0 && (
        <div className="border-t border-white/5 pt-3">
          <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[8px] tracking-[0.2em] text-muted-foreground">
            <span className="h-1 w-1 animate-pulse rounded-full bg-[oklch(0.82_0.22_165)]" />
            RECENT SOLVES
          </div>
          <ul className="space-y-1">
            {stats.recentSolves.map((solve) => (
              <li key={solve.titleSlug}>
                <a
                  href={`https://leetcode.com/problems/${solve.titleSlug}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-white/[0.03]"
                >
                  <span
                    aria-hidden
                    className="font-mono text-[8px] text-[oklch(0.82_0.22_165)]"
                  >
                    ▸
                  </span>
                  <span className="min-w-0 flex-1 truncate font-mono text-[9px] tracking-[0.08em] text-foreground/75 transition-colors group-hover:text-foreground">
                    {solve.title}
                  </span>
                  <span className="shrink-0 font-mono text-[8px] text-muted-foreground/60">
                    {relTime(solve.timestamp)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ================= Codeforces ================= */

/** SVG rating-trajectory chart (client-rendered from fetched data). */
function RatingTrajectory({ history }: { history: CodeforcesHistoryPoint[] }) {
  if (history.length === 0) {
    return (
      <div className="flex h-[64px] items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/[0.02] font-mono text-[8px] tracking-[0.18em] text-muted-foreground/60">
        NO CONTESTS LOGGED — TRAJECTORY ARMED
      </div>
    );
  }

  const W = 320;
  const H = 88;
  const PX = 10;
  const TOP = 12;
  const BOT = 78;
  const n = history.length;
  const ratings = history.map((h) => h.rating);
  let min = Math.min(...ratings);
  let max = Math.max(...ratings);
  if (min === max) {
    min -= 50;
    max += 50;
  } else {
    const pad = (max - min) * 0.08;
    min -= pad;
    max += pad;
  }

  const x = (i: number) => (n === 1 ? W / 2 : PX + (i / (n - 1)) * (W - 2 * PX));
  const y = (r: number) => BOT - ((r - min) / (max - min)) * (BOT - TOP);

  const r2 = (v: number) => v.toFixed(2);
  const line = history
    .map((h, i) => `${i === 0 ? "M" : "L"}${r2(x(i))},${r2(y(h.rating))}`)
    .join(" ");
  const area = `${line} L${r2(x(n - 1))},${BOT} L${r2(x(0))},${BOT} Z`;
  const peakIdx = ratings.indexOf(Math.max(...ratings));
  const lastIdx = n - 1;
  // Label side depends on peak position so text never clips the viewBox.
  const peakLeft = x(peakIdx) < W / 2;
  const peakTextX = peakLeft ? x(peakIdx) + 6 : x(peakIdx) - 6;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Codeforces rating history across ${n} contests`}
    >
      <defs>
        <linearGradient id="cfAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.20 195)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="oklch(0.72 0.25 320)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* baseline */}
      <line
        x1={PX}
        y1={BOT}
        x2={W - PX}
        y2={BOT}
        stroke="oklch(1 0 0 / 0.08)"
        strokeWidth="1"
      />
      <path d={area} fill="url(#cfAreaGrad)" />
      <motion.path
        d={line}
        fill="none"
        stroke="oklch(0.82 0.22 165)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* data points (with tooltips when sparse) */}
      {history.map((h, i) =>
        n <= 24 || i === peakIdx || i === lastIdx ? (
          <circle
            key={i}
            cx={r2(x(i))}
            cy={r2(y(h.rating))}
            r="1.5"
            fill="oklch(0.82 0.22 165 / 0.75)"
          >
            <title>{`${h.contest} · ${h.rating} · ${h.date.slice(0, 10)}`}</title>
          </circle>
        ) : null
      )}
      {/* peak marker */}
      <circle
        cx={r2(x(peakIdx))}
        cy={r2(y(ratings[peakIdx]))}
        r="2.5"
        fill="oklch(0.72 0.25 320)"
      >
        <title>{`Peak ${ratings[peakIdx]} · ${history[peakIdx].contest}`}</title>
      </circle>
      {/* latest marker */}
      <circle
        cx={r2(x(lastIdx))}
        cy={r2(y(ratings[lastIdx]))}
        r="2.5"
        fill="oklch(0.82 0.22 165)"
      >
        <title>{`Latest ${ratings[lastIdx]} · ${history[lastIdx].contest}`}</title>
      </circle>
      <text
        x={r2(peakTextX)}
        y={TOP}
        textAnchor={peakLeft ? "start" : "end"}
        fontSize="7"
        fontFamily="ui-monospace, monospace"
        fill="oklch(0.72 0.25 320)"
      >
        PEAK {ratings[peakIdx]}
      </text>
    </svg>
  );
}

function CodeforcesBody({ stats }: { stats: CodeforcesStats }) {
  const tier = cfTier(stats.rank);
  const bestRank = stats.ratingHistory.length
    ? Math.min(
        ...stats.ratingHistory.map((h) => h.rank).filter((r): r is number => r != null)
      )
    : null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1 py-1 text-center">
      <div className="font-mono text-[8px] tracking-[0.25em] text-muted-foreground">
        CURRENT RATING
      </div>
      <div className={`font-display text-5xl font-black leading-none ${tier.text}`}>
        {stats.rating ?? "—"}
      </div>
      <div
        className={`mt-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-0.5 font-mono text-[8px] tracking-[0.2em] ${tier.text}`}
      >
        {tier.label}
      </div>

      {/* rating trajectory */}
      <div className="mt-4 w-full">
        <div className="mb-1.5 flex items-center justify-between font-mono text-[8px] tracking-[0.2em] text-muted-foreground">
          <span>RATING TRAJECTORY</span>
          <span>
            {stats.contestsCount ?? stats.ratingHistory.length} CONTESTS
          </span>
        </div>
        <RatingTrajectory history={stats.ratingHistory} />
      </div>

      {/* meta row */}
      <div className="flex w-full flex-wrap justify-center gap-x-4 gap-y-1 border-t border-white/5 pt-3 font-mono text-[8px] tracking-[0.15em] text-muted-foreground">
        <span>
          PEAK <span className="text-[oklch(0.72_0.25_320)]">{stats.maxRating ?? "—"}</span>
        </span>
        {bestRank != null && (
          <span>
            BEST RANK <span className="text-[oklch(0.78_0.20_195)]">#{bestRank}</span>
          </span>
        )}
        <span>
          CONTRIBUTION{" "}
          <span className={stats.contribution >= 0 ? "text-[oklch(0.82_0.22_165)]" : "text-[oklch(0.72_0.25_320)]"}>
            {stats.contribution >= 0 ? "+" : ""}
            {stats.contribution}
          </span>
        </span>
      </div>
    </div>
  );
}

/* ================= GitHub ================= */
function GitHubBody({ stats }: { stats: GitHubStats }) {
  const cells = [
    { label: "REPOS", value: stats.repos },
    { label: "STARS", value: stats.stars },
    { label: "FOLLOWERS", value: stats.followers.toLocaleString() },
    { label: "FOLLOWING", value: stats.following },
  ];
  const since = stats.memberSince
    ? new Date(stats.memberSince).getFullYear()
    : null;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid grid-cols-2 gap-2.5">
        {cells.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5"
          >
            <div className="font-display text-xl font-bold text-[oklch(0.78_0.20_195)]">
              {c.value}
            </div>
            <div className="mt-0.5 font-mono text-[8px] tracking-[0.18em] text-muted-foreground">
              {c.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* contribution grid */}
      {stats.contributions != null && (
        <div className="border-t border-white/5 pt-3">
          <div className="mb-1.5 flex items-center justify-between font-mono text-[8px] tracking-[0.2em] text-muted-foreground">
            <span>CONTRIBUTION GRID · 1Y</span>
            <span>
              <span className="text-[oklch(0.78_0.20_195)]">
                {(stats.totalContributions ?? 0).toLocaleString()}
              </span>{" "}
              EVENTS
            </span>
          </div>
          <MiniHeatmap
            days={stats.contributions}
            thresholds={[1, 3, 6, 10]}
            unit="contributions"
            palette="cyan"
          />
        </div>
      )}

      {stats.topLanguages.length > 0 && (
        <div>
          <div className="mb-1.5 font-mono text-[8px] tracking-[0.2em] text-muted-foreground">
            TOP LANGUAGES
          </div>
          <div className="flex flex-wrap gap-1.5">
            {stats.topLanguages.map((lang) => (
              <span
                key={lang}
                className="rounded-full border border-[oklch(0.78_0.20_195/0.3)] bg-[oklch(0.78_0.20_195/0.08)] px-2.5 py-0.5 font-mono text-[8px] tracking-[0.1em] text-[oklch(0.78_0.20_195)]"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {since && (
        <div className="mt-auto border-t border-white/5 pt-3 font-mono text-[8px] tracking-[0.15em] text-muted-foreground">
          TRANSMITTING SINCE <span className="text-[oklch(0.78_0.20_195)]">{since}</span>
        </div>
      )}
    </div>
  );
}
