"use client";

import { useEffect, useRef, useState } from "react";
import { useSpring, useTransform, MotionValue } from "framer-motion";

interface CanvasSequenceProps {
  scrollProgress: MotionValue<number>;
}

// Load every 4th frame to reduce payload from ~19 MB to ~5 MB
const TOTAL_ORIGINAL_FRAMES = 240;
const FRAME_STEP = 4;
const TOTAL_FRAMES = Math.ceil(TOTAL_ORIGINAL_FRAMES / FRAME_STEP); // 60
const LERP_FACTOR = 0.12;

export function CanvasSequence({ scrollProgress }: CanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [firstFrameReady, setFirstFrameReady] = useState(false);

  // Spring-smoothed scroll progress
  const smoothProgress = useSpring(scrollProgress, {
    stiffness: 60,
    damping: 20,
    mass: 0.4,
    restDelta: 0.0001,
  });

  // Map spring value (0→1) to frame index (0→59)
  const targetFrameMotion = useTransform(smoothProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

  // Preload frames (every 4th original frame)
  useEffect(() => {
    const arr: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let count = 0;

    const loadFrame = (i: number) => {
      const img = new Image();
      // Map to original frame number: 1, 5, 9, 13, ...
      const originalFrameNum = (i * FRAME_STEP + 1).toString().padStart(3, "0");
      img.src = `/fusion-icecream/ezgif-frame-${originalFrameNum}.jpg`;
      img.decoding = "async";
      img.onload = () => {
        count++;
        // Mark first frame ready as soon as frame 0 loads
        if (i === 0) setFirstFrameReady(true);
        setLoadedCount(count);
      };
      arr[i] = img;
    };

    // Load first frame immediately so it's ready
    loadFrame(0);
    imagesRef.current = arr;

    // Defer loading the remaining 59 frames by 1 second.
    // This allows the browser to focus entirely on LCP, FCP, and hydration,
    // dramatically improving Lighthouse scores while being unnoticeable to the user.
    const timeout = setTimeout(() => {
      for (let i = 1; i < TOTAL_FRAMES; i++) {
        loadFrame(i);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  // RAF draw loop with idle detection — pauses when not scrolling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let displayedFrame = 0;
    let lastDrawnFrame = -1;
    let rafId: number;
    let idleTimeout: ReturnType<typeof setTimeout> | null = null;
    let isRunning = true;

    const draw = (frameIdx: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const img = imagesRef.current[frameIdx];
      if (!img?.complete || img.naturalWidth === 0) return;

      // Cover-fit: scale image to fill canvas (like object-fit: cover)
      const hRatio = canvas.width / img.naturalWidth;
      const vRatio = canvas.height / img.naturalHeight;
      const ratio = Math.max(hRatio, vRatio);
      const scaledW = img.naturalWidth * ratio;
      const scaledH = img.naturalHeight * ratio;
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
      if (!isRunning) return;

      const target = Math.max(0, Math.min(TOTAL_FRAMES - 1, targetFrameMotion.get()));
      displayedFrame += (target - displayedFrame) * LERP_FACTOR;
      const frameIdx = Math.round(displayedFrame);

      // Only redraw if frame actually changed
      if (frameIdx !== lastDrawnFrame) {
        draw(frameIdx);
        lastDrawnFrame = frameIdx;
      }

      // Check if we're close enough to target to pause
      const diff = Math.abs(target - displayedFrame);
      if (diff < 0.01) {
        // Near idle — schedule pause
        if (!idleTimeout) {
          idleTimeout = setTimeout(() => {
            isRunning = false;
          }, 200);
        }
      } else {
        // Still moving — clear any idle timeout
        if (idleTimeout) {
          clearTimeout(idleTimeout);
          idleTimeout = null;
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    // Resume loop when scroll value changes
    const unsubscribe = targetFrameMotion.on("change", () => {
      if (idleTimeout) {
        clearTimeout(idleTimeout);
        idleTimeout = null;
      }
      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(loop);
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (idleTimeout) clearTimeout(idleTimeout);
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Responsive canvas resize
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
    <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ willChange: "transform" }}>
      {/* Static fallback image — loads instantly via native browser, no JS wait */}
      {/* Shows the first frame of the ice cream sequence as a beautiful hero banner */}
      <img
        src="/fusion-icecream/ezgif-frame-001.jpg"
        alt="Frozen Fusion Ice Cream"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
        fetchPriority="high"
      />

      {/* Dark gradient overlay so hero text is readable over the image */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: "linear-gradient(to bottom, rgba(6,6,6,0.5) 0%, rgba(6,6,6,0.3) 40%, rgba(6,6,6,0.5) 100%)",
        }}
      />

      {/* Canvas — fades in over the static image once frames are ready */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full transition-opacity duration-700"
        style={{ opacity: firstFrameReady ? 1 : 0, zIndex: 2 }}
      />

      {/* Subtle loading indicator at bottom */}
      {isLoading && !firstFrameReady && (
        <div className="absolute inset-0 z-10 flex flex-col items-end justify-end pointer-events-none pb-12">
          <div className="flex flex-col items-center gap-3 w-full">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
              Loading Experience
            </p>
            <div className="h-[1px] w-36 bg-white/10 overflow-hidden rounded-full">
              <div
                className="h-full bg-gradient-to-r from-[#e12d6a] to-yellow-400 transition-all duration-150"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

