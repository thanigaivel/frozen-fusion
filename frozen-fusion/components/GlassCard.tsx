"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  headline?: string;
  body?: string;
  children?: React.ReactNode;
  index?: number;
  className?: string;
}

export function GlassCard({ headline, body, children, index = 0, className }: GlassCardProps) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: false, margin: "-10%" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -10 }}
      className={cn(
        "glass-card glass-card-hover rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 relative overflow-hidden flex flex-col gap-3 md:gap-5",
        index !== undefined && index >= 0 ? (isEven ? "md:self-start md:mr-auto w-full md:w-[52%]" : "md:self-end md:ml-auto w-full md:w-[52%]") : "w-full",
        className
      )}
    >
      {/* Subtle glow effect inside the card */}
      <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-neon-pink opacity-20 blur-[80px] pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-neon-cyan opacity-10 blur-[80px] pointer-events-none" />

      {headline && (
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight font-righteous">
          {headline}
        </h2>
      )}
      {body && (
        <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white/70 font-poppins">
          {body}
        </p>
      )}
      {children}
    </motion.div>
  );
}
