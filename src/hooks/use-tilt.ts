"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface TiltState {
  rotateX: number;
  rotateY: number;
  glareX: number;
  glareY: number;
  scale: number;
}

const IDLE: TiltState = {
  rotateX: 0,
  rotateY: 0,
  glareX: 50,
  glareY: 50,
  scale: 1,
};

interface UseTiltOptions {
  /** Max rotation in degrees on each axis. */
  max?: number;
  /** Scale on hover. */
  scale?: number;
  /** Spring factor (0-1). Higher = snappier. */
  speed?: number;
  /** Invert the Y axis (some layouts feel more natural inverted). */
  invert?: boolean;
}

/**
 * Mouse-reactive 3D tilt hook. Returns a ref to attach, the live transform
 * state, and whether the element is currently hovered. Uses a stable rAF
 * loop (driven via refs) to ease toward the target rotation for smooth motion.
 */
export function useTilt({
  max = 12,
  scale = 1.04,
  speed = 0.15,
  invert = false,
}: UseTiltOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<TiltState>(IDLE);
  const [hovering, setHovering] = useState(false);

  const target = useRef<TiltState>(IDLE);
  const current = useRef<TiltState>(IDLE);
  const raf = useRef<number>(0);
  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // Stable loop: reads from refs, never recreates. Uses a ref to break
  // the self-reference so it can schedule itself without lint complaints.
  const loopRef = useRef<() => void>(() => {});
  useEffect(() => {
    loopRef.current = () => {
      const c = current.current;
      const t = target.current;
      const s = speedRef.current;
      c.rotateX += (t.rotateX - c.rotateX) * s;
      c.rotateY += (t.rotateY - c.rotateY) * s;
      c.glareX += (t.glareX - c.glareX) * s;
      c.glareY += (t.glareY - c.glareY) * s;
      c.scale += (t.scale - c.scale) * s;

      setState((prev) => {
        if (
          Math.abs(c.rotateX - prev.rotateX) < 0.05 &&
          Math.abs(c.rotateY - prev.rotateY) < 0.05 &&
          Math.abs(c.scale - prev.scale) < 0.001
        ) {
          return prev; // no meaningful change, skip re-render
        }
        return { ...c };
      });
      raf.current = requestAnimationFrame(loopRef.current);
    };
  }, []);
  const loop = useCallback(() => loopRef.current(), []);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0..1
      const py = (e.clientY - rect.top) / rect.height; // 0..1
      const ry = (px - 0.5) * 2 * max; // rotateY follows X
      const rx = (0.5 - py) * 2 * max * (invert ? -1 : 1); // rotateX follows Y
      target.current = {
        rotateX: rx,
        rotateY: ry,
        glareX: px * 100,
        glareY: py * 100,
        scale,
      };
      // Ensure the easing loop is running (robust against missed enter events).
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(loop);
    },
    [max, scale, invert, loop]
  );

  const onEnter = useCallback(() => {
    setHovering(true);
    target.current = { ...target.current, scale };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(loop);
  }, [scale, loop]);

  const onLeave = useCallback(() => {
    setHovering(false);
    target.current = { ...IDLE, scale: 1 };
    const stop = () => {
      const c = current.current;
      if (
        Math.abs(c.rotateX) < 0.1 &&
        Math.abs(c.rotateY) < 0.1 &&
        Math.abs(c.scale - 1) < 0.001
      ) {
        current.current = { ...IDLE };
        setState({ ...IDLE });
        raf.current = 0;
        return;
      }
      raf.current = requestAnimationFrame(stop);
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(stop);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return {
    ref,
    state,
    hovering,
    handlers: {
      onMouseMove: onMove,
      onMouseEnter: onEnter,
      onMouseLeave: onLeave,
    },
  };
}
