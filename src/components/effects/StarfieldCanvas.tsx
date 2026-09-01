"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number; // depth for parallax
  size: number;
  baseAlpha: number;
  twinkle: number;
  twinkleSpeed: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

const STAR_COLORS = [
  "rgba(180, 255, 220, ", // alien green-white
  "rgba(180, 230, 255, ", // cyan-white
  "rgba(220, 200, 255, ", // plasma-white
  "rgba(255, 255, 255, ",
];

/**
 * Deep-space starfield with parallax depth, twinkling stars, drifting
 * nebula dust and occasional shooting stars. Renders behind all content.
 */
export function StarfieldCanvas({ density = 1 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const shootingRef = useRef<ShootingStar[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const initStars = () => {
      const count = Math.floor(((width * height) / 9000) * density);
      const stars: Star[] = [];
      for (let i = 0; i < count; i++) {
        const z = Math.random();
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          size: z * 1.6 + 0.3,
          baseAlpha: 0.3 + z * 0.7,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.5 + Math.random() * 2,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        });
      }
      starsRef.current = stars;
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current.tx = (e.clientX / width - 0.5) * 2;
      mouseRef.current.ty = (e.clientY / height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    let last = performance.now();
    const spawnShootingStar = () => {
      const fromLeft = Math.random() > 0.5;
      const startX = fromLeft ? -50 : width + 50;
      const startY = Math.random() * height * 0.6;
      const speed = 8 + Math.random() * 6;
      const angle = fromLeft
        ? Math.PI * 0.15 + Math.random() * 0.2
        : Math.PI - Math.PI * 0.15 - Math.random() * 0.2;
      shootingRef.current.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 60 + Math.random() * 40,
      });
    };

    let shootingTimer = 0;

    const render = (now: number) => {
      const dt = Math.min((now - last) / 16.67, 2.5);
      last = now;

      // ease mouse
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // Nebula dust drift (subtle radial gradients)
      const t = now * 0.00005;
      const grd1 = ctx.createRadialGradient(
        width * (0.3 + mouseRef.current.x * 0.05),
        height * (0.35 + mouseRef.current.y * 0.05),
        0,
        width * 0.3,
        height * 0.35,
        Math.max(width, height) * 0.6
      );
      grd1.addColorStop(0, "rgba(120, 60, 180, 0.10)");
      grd1.addColorStop(0.5, "rgba(60, 30, 120, 0.04)");
      grd1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd1;
      ctx.fillRect(0, 0, width, height);

      const grd2 = ctx.createRadialGradient(
        width * (0.75 - mouseRef.current.x * 0.04),
        height * (0.7 - mouseRef.current.y * 0.04),
        0,
        width * 0.75,
        height * 0.7,
        Math.max(width, height) * 0.55
      );
      grd2.addColorStop(0, "rgba(40, 200, 160, 0.08)");
      grd2.addColorStop(0.5, "rgba(20, 120, 100, 0.03)");
      grd2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd2;
      ctx.fillRect(0, 0, width, height);

      void t;

      // Stars
      const px = mouseRef.current.x * 30;
      const py = mouseRef.current.y * 30;
      for (const s of starsRef.current) {
        s.twinkle += s.twinkleSpeed * 0.02 * dt;
        const alpha =
          s.baseAlpha * (0.6 + 0.4 * Math.sin(s.twinkle));
        const drawX = s.x - px * s.z;
        const drawY = s.y - py * s.z;
        ctx.beginPath();
        ctx.arc(drawX, drawY, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color + alpha.toFixed(3) + ")";
        ctx.fill();
        // glow for bigger stars
        if (s.size > 1.1) {
          ctx.beginPath();
          ctx.arc(drawX, drawY, s.size * 2.5, 0, Math.PI * 2);
          const g = ctx.createRadialGradient(
            drawX,
            drawY,
            0,
            drawX,
            drawY,
            s.size * 2.5
          );
          g.addColorStop(0, s.color + (alpha * 0.4).toFixed(3) + ")");
          g.addColorStop(1, s.color + "0)");
          ctx.fillStyle = g;
          ctx.fill();
        }
      }

      // Shooting stars
      shootingTimer += dt;
      if (shootingTimer > 180 && Math.random() < 0.02) {
        spawnShootingStar();
        shootingTimer = 0;
      }
      shootingRef.current = shootingRef.current.filter((sh) => {
        sh.x += sh.vx * dt;
        sh.y += sh.vy * dt;
        sh.life += dt;
        const lifeRatio = sh.life / sh.maxLife;
        const alpha = Math.sin(lifeRatio * Math.PI);
        if (lifeRatio >= 1) return false;
        const tailLen = 80;
        const grad = ctx.createLinearGradient(
          sh.x,
          sh.y,
          sh.x - sh.vx * (tailLen / 8),
          sh.y - sh.vy * (tailLen / 8)
        );
        grad.addColorStop(0, `rgba(180, 255, 220, ${alpha})`);
        grad.addColorStop(0.5, `rgba(120, 200, 255, ${alpha * 0.5})`);
        grad.addColorStop(1, "rgba(120, 200, 255, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(
          sh.x - sh.vx * (tailLen / 8),
          sh.y - sh.vy * (tailLen / 8)
        );
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(sh.x, sh.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 255, 240, ${alpha})`;
        ctx.fill();
        return true;
      });

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      cancelAnimationFrame(animationRef.current);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
