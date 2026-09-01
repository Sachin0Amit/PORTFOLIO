"use client";

import { useEffect, useState } from "react";
import { Radio, Activity } from "lucide-react";

interface CounterData {
  total: number;
  unread: number;
  buffered: number;
  degraded?: boolean;
}

/**
 * Polls the GET /api/contact endpoint and shows a live count of total
 * transmissions received. Adds a "live data" feel to the contact section.
 */
export function TransmissionCounter() {
  const [data, setData] = useState<CounterData | null>(null);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/contact", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as CounterData;
        if (cancelled) return;
        setData((prev) => {
          if (prev && json.total > prev.total) {
            setPulse(true);
            window.setTimeout(() => setPulse(false), 1500);
          }
          return json;
        });
      } catch {
        // silent fail — counter is decorative
      }
    };
    fetchCount();
    const id = setInterval(fetchCount, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const total = data?.total ?? 0;

  return (
    <div
      className={`relative flex items-center gap-2.5 rounded-xl border px-3 py-2 transition-all ${
        pulse
          ? "border-[oklch(0.82_0.22_165)] bg-[oklch(0.82_0.22_165/0.08)]"
          : "border-[oklch(0.82_0.22_165/0.2)] bg-[oklch(0.10_0.02_280/0.5)]"
      }`}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${
            pulse ? "animate-ping" : ""
          } bg-[oklch(0.82_0.22_165)] opacity-75`}
        />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[oklch(0.82_0.22_165)]" />
      </span>
      <div className="flex flex-col leading-none">
        <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
          TOTAL TRANSMISSIONS
        </span>
        <span className="mt-0.5 font-display text-base font-black text-gradient-alien">
          {String(total).padStart(3, "0")}
        </span>
      </div>
      <Activity className="ml-1 h-3.5 w-3.5 text-[oklch(0.78_0.20_195)]" />
    </div>
  );
}
