"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "outline" | "glass";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function MagneticButton({ children, className, variant = "primary", onClick, disabled, type = "button" }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const variants = {
    primary: "bg-gradient-primary text-white shadow-[0_0_20px_rgba(255,43,194,0.4)] border-none",
    outline: "bg-transparent border-2 border-neon-cyan text-neon-cyan shadow-[0_0_15px_rgba(59,232,255,0.2)]",
    glass: "glass-card glass-card-hover text-white",
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={cn(
        "relative rounded-full px-8 py-4 font-bold text-lg overflow-hidden group transition-all duration-300",
        variants[variant],
        className
      )}
    >
      <span className="relative z-10 font-poppins">{children}</span>
      {variant === "primary" && (
        <div className="absolute inset-0 z-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      )}
    </motion.button>
  );
}
