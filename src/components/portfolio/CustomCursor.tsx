"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const HOVER_SELECTOR =
  'a, button, [role="button"], [data-cursor-hover], input, textarea, select';

/**
 * Dual-layer custom cursor: a snappy violet dot + a lagging fuchsia ring.
 * Only activates on devices with a fine pointer (mouse / trackpad).
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Dot: fast, tight spring (~80ms feel). Ring: soft, trailing spring (~250ms feel).
  const dotX = useSpring(cursorX, { stiffness: 1000, damping: 60, mass: 0.35 });
  const dotY = useSpring(cursorY, { stiffness: 1000, damping: 60, mass: 0.35 });
  const ringX = useSpring(cursorX, { stiffness: 240, damping: 24, mass: 0.75 });
  const ringY = useSpring(cursorY, { stiffness: 240, damping: 24, mass: 0.75 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;

    // Defer the state flip by one frame (avoid synchronous setState in effect).
    const raf = requestAnimationFrame(() => setEnabled(true));
    document.documentElement.classList.add("custom-cursor-active");

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      setHovered(Boolean(target?.closest?.(HOVER_SELECTOR)));
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, cursorX, cursorY]);

  if (!enabled) return null;

  return (
    <>
      {/* Dot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[110] h-2 w-2 rounded-full bg-violet-400 will-change-transform"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: hovered ? 0.5 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      />
      {/* Ring */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[110] h-9 w-9 rounded-full border will-change-transform"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: pressed ? 0.85 : hovered ? 2 : 1,
          opacity: visible ? 1 : 0,
          borderColor: hovered
            ? "rgba(252, 211, 77, 0.8)"
            : "rgba(232, 121, 249, 0.6)",
          backgroundColor: hovered
            ? "rgba(252, 211, 77, 0.1)"
            : "rgba(252, 211, 77, 0)",
        }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      />
    </>
  );
}
