"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Global smooth-scroll provider.
 * Stores the Lenis instance on `window.__lenis` so any component can drive
 * programmatic scrolling through the shared helpers below.
 */

type LenisWindow = {
  __lenis?: Lenis | null;
};

function getLenis(): Lenis | null | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as LenisWindow).__lenis;
}

/** Smoothly scrolls to a section by element id (with navbar offset). */
export function scrollToSection(id: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset: -84, duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

/** Smoothly scrolls back to the very top of the page. */
export function scrollToTop() {
  if (typeof window === "undefined") return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.4 });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    (window as unknown as LenisWindow).__lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      (window as unknown as LenisWindow).__lenis = null;
    };
  }, []);

  return null;
}
