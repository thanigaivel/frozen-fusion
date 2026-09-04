"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface SocialItem {
  id: "instagram" | "facebook";
  name: "Instagram" | "Facebook";
  handle: string;
  href: string;
  gradient: string;
  neonShadow: string;
  hoverNeonShadow: string;
  glowColor: string;
  borderColor: string;
  floatDuration: number;
  floatDelay: number;
  rotationHover: number;
  icon: React.ReactNode;
}

const SOCIAL_LINKS: SocialItem[] = [
  {
    id: "instagram",
    name: "Instagram",
    handle: "@frozen_fusion_official",
    href: "https://www.instagram.com/frozen_fusion_official/",
    gradient: "from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]",
    neonShadow:
      "0 0 20px rgba(225,48,108,0.7), 0 0 45px rgba(131,58,180,0.4), inset 0 0 14px rgba(253,29,29,0.3)",
    hoverNeonShadow:
      "0 0 35px rgba(225,48,108,1), 0 0 70px rgba(131,58,180,0.65), inset 0 0 18px rgba(255,107,214,0.5)",
    glowColor: "rgba(225,48,108,0.85)",
    borderColor: "rgba(255,107,214,0.6)",
    floatDuration: 3.2,
    floatDelay: 0,
    rotationHover: 8,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    id: "facebook",
    name: "Facebook",
    handle: "Frozen Fusion",
    href: "https://www.facebook.com/profile.php?id=61594211000925",
    gradient: "from-[#0D47A1] via-[#1877F2] to-[#00D2FF]",
    neonShadow:
      "0 0 20px rgba(24,119,242,0.8), 0 0 45px rgba(0,210,255,0.45), inset 0 0 14px rgba(0,210,255,0.35)",
    hoverNeonShadow:
      "0 0 35px rgba(24,119,242,1), 0 0 70px rgba(0,210,255,0.7), inset 0 0 18px rgba(0,240,255,0.6)",
    glowColor: "rgba(24,119,242,0.9)",
    borderColor: "rgba(59,232,255,0.6)",
    floatDuration: 3.8,
    floatDelay: 0.5,
    rotationHover: -8,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export function FloatingSocialIcons() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <aside
      aria-label="Social Media Links"
      className="fixed bottom-6 left-4 sm:left-6 z-50 flex flex-col items-center gap-3.5 pointer-events-none select-none"
    >
      {SOCIAL_LINKS.map((item, index) => {
        const isHovered = hoveredId === item.id;

        return (
          <motion.div
            key={item.id}
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, x: -35, scale: 0.7 }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    y: [0, -6, 0],
                  }
            }
            transition={{
              opacity: { duration: 0.5, delay: 0.2 + index * 0.15 },
              scale: {
                type: "spring",
                stiffness: 350,
                damping: 22,
                delay: 0.2 + index * 0.15,
              },
              x: {
                type: "spring",
                stiffness: 320,
                damping: 24,
                delay: 0.2 + index * 0.15,
              },
              y: {
                duration: item.floatDuration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: item.floatDelay,
              },
            }}
            className="relative pointer-events-auto group"
            onHoverStart={() => setHoveredId(item.id)}
            onHoverEnd={() => setHoveredId(null)}
          >
            {/* Ambient Pulsating Neon Cloud Behind */}
            <motion.div
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: isHovered ? [1.3, 1.45, 1.3] : [0.9, 1.15, 0.9],
                      opacity: isHovered ? [0.9, 1, 0.9] : [0.45, 0.75, 0.45],
                    }
              }
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -inset-1.5 rounded-full blur-xl pointer-events-none transition-all duration-300"
              style={{
                background: item.glowColor,
              }}
            />

            {/* Ripple Sonar Ring Expanding on Hover */}
            {isHovered && !shouldReduceMotion && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0.9 }}
                animate={{ scale: 1.65, opacity: 0 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border border-white/60 pointer-events-none"
              />
            )}

            {/* Interactive Neon Button */}
            <motion.a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit Frozen Fusion on ${item.name}`}
              whileHover={{
                scale: 1.16,
                rotate: item.rotationHover,
                transition: { type: "spring", stiffness: 420, damping: 15 },
              }}
              whileTap={{ scale: 0.92 }}
              className={`relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full bg-gradient-to-tr ${item.gradient} border transition-all duration-300 overflow-hidden shadow-2xl cursor-pointer`}
              style={{
                borderColor: item.borderColor,
                boxShadow: isHovered ? item.hoverNeonShadow : item.neonShadow,
              }}
            >
              {/* Glossy top highlight */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-full pointer-events-none" />

              {/* Shimmer sweep light */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />

              {/* Icon */}
              <div className="relative z-10 flex items-center justify-center">
                {item.icon}
              </div>
            </motion.a>

            {/* Futuristic Cyber Neon Tooltip Pill (Desktop/Tablet) */}
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.9, pointerEvents: "none" }}
              animate={
                isHovered
                  ? { opacity: 1, x: 0, scale: 1, pointerEvents: "auto" }
                  : { opacity: 0, x: -10, scale: 0.9, pointerEvents: "none" }
              }
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
              className="absolute left-full top-1/2 -translate-y-1/2 ml-3.5 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#09090f]/90 backdrop-blur-2xl border text-xs shadow-2xl z-50 whitespace-nowrap"
              style={{
                borderColor: item.borderColor,
                boxShadow: `0 0 25px ${item.glowColor}`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: item.borderColor }}
              />
              <span className="font-poppins font-medium text-white/80 text-[11px] uppercase tracking-wider">
                {item.name}
              </span>
              <span className="font-poppins font-semibold text-white text-[12px]">
                {item.handle}
              </span>
              <span className="text-[11px] text-white/60 ml-0.5">↗</span>
            </motion.div>
          </motion.div>
        );
      })}
    </aside>
  );
}
