"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

/**
 * A floating "return to origin" button that fades in after the user scrolls
 * past the first viewport. Clicking smoothly scrolls back to the hero.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          aria-label="Return to origin"
          className="group fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-[oklch(0.82_0.22_165/0.4)] bg-[oklch(0.10_0.02_280/0.8)] backdrop-blur-md transition-all hover:border-[oklch(0.82_0.22_165)] hover:shadow-[0_0_25px_rgba(120,255,200,0.5)] sm:bottom-6 sm:right-6"
        >
          <span className="absolute inset-0 rounded-full bg-[oklch(0.82_0.22_165/0.1)] blur-md transition-all group-hover:bg-[oklch(0.82_0.22_165/0.25)]" />
          <ArrowUp className="relative h-4 w-4 text-[oklch(0.82_0.22_165)] transition-transform group-hover:-translate-y-0.5" />
          <span className="sr-only">Return to top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
