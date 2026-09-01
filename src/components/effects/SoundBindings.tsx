"use client";

import { useEffect } from "react";
import { playSound } from "@/hooks/use-sound";

/**
 * Global sound bindings. Listens for mouseenter/click events at the document
 * level (event delegation) and plays the appropriate UI blip when the target
 * is an interactive element. This avoids threading sound calls through every
 * component — just mount this once and all buttons/links get sound.
 */
export function SoundBindings() {
  useEffect(() => {
    const onHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(
          "a, button, [role='button'], input, textarea, select, [data-sound='hover']"
        )
      ) {
        playSound("hover");
      }
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(
          "a, button, [role='button'], [data-sound='click']"
        )
      ) {
        playSound("click");
      }
    };

    document.addEventListener("mouseover", onHover, { passive: true });
    document.addEventListener("click", onClick, { passive: true });
    return () => {
      document.removeEventListener("mouseover", onHover);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
