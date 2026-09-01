"use client";

import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useSound } from "@/hooks/use-sound";

/**
 * Floating sound toggle button. Bottom-left corner. Toggles whether UI blips
 * play on hover/click across the app. Preference persists in localStorage.
 */
export function SoundToggle() {
  const { enabled, toggle } = useSound();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.4 }}
      onClick={toggle}
      aria-label={enabled ? "Mute UI sounds" : "Enable UI sounds"}
      className="group fixed bottom-5 left-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-[oklch(0.82_0.22_165/0.3)] bg-[oklch(0.10_0.02_280/0.8)] backdrop-blur-md transition-all hover:border-[oklch(0.82_0.22_165)] hover:shadow-[0_0_25px_rgba(120,255,200,0.4)] sm:bottom-6 sm:left-6"
    >
      <span className="absolute inset-0 rounded-full bg-[oklch(0.82_0.22_165/0.1)] blur-md transition-all group-hover:bg-[oklch(0.82_0.22_165/0.2)]" />
      {enabled ? (
        <Volume2 className="relative h-4 w-4 text-[oklch(0.82_0.22_165)]" />
      ) : (
        <VolumeX className="relative h-4 w-4 text-muted-foreground" />
      )}
      {/* Sound wave animation when enabled */}
      {enabled && (
        <span className="absolute inset-0 -z-10 animate-ping rounded-full border border-[oklch(0.82_0.22_165/0.4)]" />
      )}
    </motion.button>
  );
}
