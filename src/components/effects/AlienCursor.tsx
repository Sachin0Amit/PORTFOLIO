"use client";

import { useEffect, useRef, useState } from "react";

interface TrailDot {
  x: number;
  y: number;
  life: number;
}

/**
 * Alien energy-cursor: a glowing core that follows the pointer with a
 * fading plasma trail. Enables itself on the first mouse movement, so it
 * stays hidden on touch / coarse-pointer devices.
 */
export function AlienCursor() {
  const coreRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Bail out entirely on coarse-pointer (touch) devices.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pos.x, y: pos.y };
    let raf = 0;
    const trail: TrailDot[] = [];
    const MAX_TRAIL = 14;
    // Guards so mousemove only triggers a render when values actually change
    // (React bails out on identical state, but skipping the call avoids the
    // scheduling work entirely on every pointer event).
    let enabledFired = false;
    let hoveringState = false;

    const onMove = (e: MouseEvent) => {
      // Enable on first real mouse movement (event handler — safe to setState).
      if (!enabledFired) {
        enabledFired = true;
        setEnabled(true);
      }
      pos.x = e.clientX;
      pos.y = e.clientY;
      trail.unshift({ x: e.clientX, y: e.clientY, life: 1 });
      if (trail.length > MAX_TRAIL) trail.pop();

      const target = e.target as HTMLElement;
      const interactive = target.closest(
        "a, button, [role='button'], input, textarea, select, [data-cursor='hover']"
      );
      const nextHovering = !!interactive;
      if (nextHovering !== hoveringState) {
        hoveringState = nextHovering;
        setHovering(nextHovering);
      }
    };

    const render = () => {
      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${pos.x - 6}px, ${
          pos.y - 6
        }px, 0)`;
      }
      // ring lags behind
      ring.x += (pos.x - ring.x) * 0.18;
      ring.y += (pos.y - ring.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x - 18}px, ${
          ring.y - 18
        }px, 0)`;
      }
      // trail
      if (trailRef.current) {
        const dots = trailRef.current.children;
        for (let i = 0; i < dots.length; i++) {
          const dot = dots[i] as HTMLElement;
          const t = trail[i];
          if (!t) {
            dot.style.opacity = "0";
            continue;
          }
          t.life *= 0.86;
          dot.style.transform = `translate3d(${t.x - 3}px, ${t.y - 3}px, 0) scale(${
            t.life
          })`;
          dot.style.opacity = String(t.life * 0.6);
        }
      }
      raf = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] hidden md:block"
    >
      {/* Trail */}
      <div ref={trailRef} className="absolute inset-0">
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(120,255,200,0.9), rgba(120,200,255,0.2))",
              boxShadow: "0 0 6px rgba(120,255,200,0.6)",
              opacity: 0,
            }}
          />
        ))}
      </div>
      {/* Core */}
      <div
        ref={coreRef}
        className="absolute h-3 w-3 rounded-full transition-[width,height,background-color] duration-200"
        style={{
          background:
            "radial-gradient(circle, rgba(180,255,220,1), rgba(120,255,200,0.6))",
          boxShadow:
            "0 0 10px rgba(120,255,200,0.9), 0 0 22px rgba(120,255,200,0.5)",
          width: hovering ? "14px" : "12px",
          height: hovering ? "14px" : "12px",
          marginLeft: hovering ? "-1px" : "0",
          marginTop: hovering ? "-1px" : "0",
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="absolute h-9 w-9 rounded-full border transition-[width,height,border-color] duration-200"
        style={{
          borderColor: hovering
            ? "rgba(220,120,255,0.8)"
            : "rgba(120,255,200,0.5)",
          boxShadow: hovering
            ? "0 0 14px rgba(220,120,255,0.5)"
            : "0 0 10px rgba(120,255,200,0.3)",
          width: hovering ? "44px" : "36px",
          height: hovering ? "44px" : "36px",
        }}
      />
    </div>
  );
}
