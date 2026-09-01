"use client";

import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt degrees. */
  max?: number;
  /** Hover scale. */
  scale?: number;
  /** Show glare highlight that follows cursor. */
  glare?: boolean;
  /** Show a subtle 3D "pop" shadow on hover. */
  pop?: boolean;
  /** Invert Y axis tilt. */
  invert?: boolean;
  /** Glare color theme. */
  glareColor?: string;
}

const glareColors: Record<string, string> = {
  alien: "rgba(120, 255, 200,",
  plasma: "rgba(220, 120, 255,",
  cyan: "rgba(120, 220, 255,",
};

/**
 * A mouse-reactive 3D tilt card with perspective, optional glare highlight
 * and depth layering for child content.
 */
export function TiltCard({
  children,
  className,
  max = 10,
  scale = 1.03,
  glare = true,
  pop = true,
  invert = false,
  glareColor = "alien",
}: TiltCardProps) {
  const { ref, state, hovering, handlers } = useTilt({ max, scale, invert });

  return (
    <div
      style={{ perspective: "1000px" }}
      className={cn("relative", className)}
    >
      <div
        ref={ref}
        {...handlers}
        style={{
          transform: `rotateX(${state.rotateX}deg) rotateY(${state.rotateY}deg) scale(${state.scale})`,
          transformStyle: "preserve-3d",
          transition: hovering ? "none" : "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        className="relative h-full w-full"
      >
        {/* Glare overlay */}
        {glare && (
          <div
            className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300"
            style={{
              opacity: hovering ? 1 : 0,
              background: `radial-gradient(circle at ${state.glareX}% ${state.glareY}%, ${glareColors[glareColor]} 0.25), ${glareColors[glareColor]} 0) 60%, transparent 70%)`,
              mixBlendMode: "screen",
            }}
          />
        )}
        {/* Pop shadow */}
        {pop && (
          <div
            className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] transition-all duration-300"
            style={{
              opacity: hovering ? 0.6 : 0,
              transform: "translateZ(-40px) scale(0.96)",
              background: glareColors[glareColor] + " 0.25)",
              filter: "blur(28px)",
            }}
          />
        )}
        {/* Content lifted toward viewer */}
        <div style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
