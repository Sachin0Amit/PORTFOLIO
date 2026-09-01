"use client";

import { useEffect, useState, useCallback } from "react";

type SoundType = "hover" | "click" | "success" | "open" | "close";

interface SoundConfig {
  freq: number;
  duration: number;
  type: OscillatorType;
  gain: number;
  sweep?: number;
}

const SOUNDS: Record<SoundType, SoundConfig> = {
  hover: { freq: 880, duration: 0.06, type: "sine", gain: 0.04, sweep: 1320 },
  click: { freq: 440, duration: 0.08, type: "triangle", gain: 0.07, sweep: 660 },
  open: { freq: 220, duration: 0.18, type: "sine", gain: 0.08, sweep: 880 },
  close: { freq: 660, duration: 0.12, type: "sine", gain: 0.06, sweep: 220 },
  success: { freq: 523, duration: 0.3, type: "sine", gain: 0.08, sweep: 1046 },
};

const STORAGE_KEY = "alien-sound-enabled";

// ── Singleton audio engine (module scope, shared across all hook callers) ──
let ctx: AudioContext | null = null;
let enabled = false;
const listeners = new Set<(v: boolean) => void>();

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      ctx = new AC();
    } catch {
      ctx = null;
    }
  }
  return ctx;
}

function notify() {
  listeners.forEach((fn) => fn(enabled));
}

/** Play a UI sound. No-op if sounds are disabled or audio is unavailable. */
export function playSound(type: SoundType) {
  if (!enabled) return;
  const audio = getCtx();
  if (!audio) return;
  try {
    if (audio.state === "suspended") audio.resume();
    const cfg = SOUNDS[type];
    const now = audio.currentTime;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = cfg.type;
    osc.frequency.setValueAtTime(cfg.freq, now);
    if (cfg.sweep) {
      osc.frequency.exponentialRampToValueAtTime(cfg.sweep, now + cfg.duration);
    }
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(cfg.gain, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + cfg.duration);
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start(now);
    osc.stop(now + cfg.duration + 0.02);
  } catch {
    // silent fail
  }
}

function setEnabled(v: boolean) {
  enabled = v;
  try {
    localStorage.setItem(STORAGE_KEY, String(v));
  } catch {
    // ignore
  }
  notify();
}

/**
 * React hook for the sound engine. Returns the current enabled state and a
 * toggle function. The actual sound playing is done via the module-scope
 * `playSound` function so any component can call it without prop drilling.
 */
export function useSound() {
  // Read persisted preference lazily during state init (avoids effect-based setState).
  const [isOn, setIsOn] = useState(() => {
    if (typeof window === "undefined") return enabled;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") {
        enabled = true;
      }
    } catch {
      // ignore
    }
    return enabled;
  });

  useEffect(() => {
    listeners.add(setIsOn);
    return () => {
      listeners.delete(setIsOn);
    };
  }, []);

  const toggle = useCallback(() => {
    setEnabled(!enabled);
    // Play a confirmation blip when enabling
    if (!enabled) {
      window.setTimeout(() => playSound("click"), 20);
    }
  }, []);

  return { enabled: isOn, toggle, play: playSound };
}
