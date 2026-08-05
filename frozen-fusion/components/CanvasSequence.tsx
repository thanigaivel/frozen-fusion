"use client";

import { useEffect, useRef, useState } from "react";
import { useSpring, useTransform, MotionValue } from "framer-motion";

interface CanvasSequenceProps {
  scrollProgress: MotionValue<number>;
}

const TOTAL_FRAMES = 240;
// Lerp factor: how quickly the displayed frame chases the target (0–1).
// Lower = smoother but laggier; higher = snappier but more abrupt.
const LERP_FACTOR = 0.12;

export function CanvasSequence({ scrollProgress }: CanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);

  // ── 1. Spring-smoothed scroll progress ──────────────────────────────────
  // The spring adds momentum so the animation decelerates naturally when the
  // user stops scrolling, instead of cutting off abruptly.
  const smoothProgress = useSpring(scrollProgress, {
    stiffness: 60,   // lower = softer spring (slower to reach target)
    damping: 20,     // lower = more oscillation; higher = overdamped
    mass: 0.4,       // lower = lighter feel, reacts faster
    restDelta: 0.0001,
  });

  // Map spring value (0→1) to frame index (0→239)
  const targetFrameMotion = useTransform(smoothProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

  // ── 2. Preload all frames ────────────────────────────────────────────────
  useEffect(() => {
    const arr: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let count = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = (i + 1).toString().padStart(3, "0");
      img.src = `/fusion-icecream/ezgif-frame-${frameNum}.jpg`;
      img.decoding = "async"; // non-blocking decode
      img.onload = () => {
        count++;
        setLoadedCount(count);
      };
      arr[i] = img;
    }
    imagesRef.current = arr;
  }, []);

  // ── 3. RAF draw loop with lerp ───────────────────────────────────────────
  // We keep a mutable ref for the *displayed* frame index and lerp it toward
  // the spring-smoothed *target* frame on every animation frame. This adds a
  // second layer of smoothing that makes individual frame transitions feel
  // physically continuous rather than discrete jumps.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let displayedFrame = 0;
    let rafId: number;

    const draw = (frameIdx: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const img = imagesRef.current[frameIdx];
      if (!img?.complete || img.naturalWidth === 0) return;

      // Cover-fit: scale image to fill canvas, cropping edges (like object-fit: cover)
      // This ensures no black bars on any screen size, especially portrait mobile.
      const hRatio = canvas.width / img.naturalWidth;
      const vRatio = canvas.height / img.naturalHeight;
      const ratio = Math.max(hRatio, vRatio);
      const scaledW = img.naturalWidth * ratio;
      const scaledH = img.naturalHeight * ratio;
      // Center the cropped image
      const dx = (canvas.width - scaledW) / 2;
      const dy = (canvas.height - scaledH) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        img,
        0, 0, img.naturalWidth, img.naturalHeight,
        dx, dy, scaledW, scaledH
      );
    };

    const loop = () => {
      // Get spring-smoothed target from Framer Motion
      const target = Math.max(0, Math.min(TOTAL_FRAMES - 1, targetFrameMotion.get()));

      // Lerp displayed frame toward target
      displayedFrame += (target - displayedFrame) * LERP_FACTOR;

      const frameIdx = Math.round(displayedFrame);
      draw(frameIdx);

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 4. Responsive canvas resize ─────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const isLoading = loadedCount < TOTAL_FRAMES;
  const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#060606]">
      <canvas ref={canvasRef} className="h-full w-full" />

      {/* Loading overlay with progress bar */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-[#060606]">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/40">
            Loading Cinematic Experience
          </p>
          <div className="h-[1px] w-48 bg-white/10 overflow-hidden rounded-full">
            <div
              className="h-full bg-gradient-to-r from-[#e12d6a] to-yellow-400 transition-all duration-150"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-white/20 tabular-nums">{pct}%</p>
        </div>
      )}
    </div>
  );
}
