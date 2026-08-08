"use client";

export function CinematicBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none">
      {/* Noise Texture */}
      <div className="bg-noise" />

      {/* CSS-animated Glowing Orbs — compositor thread, no JS per-frame cost */}
      <div
        className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-neon-pink/20 blur-[60px] md:blur-[120px] animate-orb-1"
        style={{ willChange: "transform, opacity" }}
      />

      <div
        className="absolute top-[40%] right-[0%] w-[40%] h-[60%] rounded-full bg-neon-cyan/15 blur-[70px] md:blur-[150px] animate-orb-2 hidden md:block"
        style={{ willChange: "transform, opacity" }}
      />

      <div
        className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-electric-purple/15 blur-[60px] md:blur-[120px] animate-orb-3 hidden md:block"
        style={{ willChange: "transform, opacity" }}
      />
    </div>
  );
}
