"use client";

import { motion } from "framer-motion";

export function CinematicBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none">
      {/* Noise Texture */}
      <div className="bg-noise" />

      {/* Animated Glowing Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-neon-pink/20 blur-[120px]"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.1, 0.12, 0.1],
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[40%] right-[0%] w-[40%] h-[60%] rounded-full bg-neon-cyan/15 blur-[150px]"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.1, 0.05],
          x: [0, 30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-electric-purple/15 blur-[120px]"
      />
    </div>
  );
}
