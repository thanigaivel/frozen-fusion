"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Link from "next/link";
import { CanvasSequence } from "@/components/CanvasSequence";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { Footer } from "@/components/Footer";
import { MagneticButton } from "@/components/MagneticButton";

const gatewaySections = [
  {
    headline: "Taste The Fusion",
    body: "Experience the finest frozen desserts, crafted with passion and pure ingredients. A luxury dessert lounge awaits you.",
    link: "/products",
    cta: "Explore Our Menu",
  },
  {
    headline: "Our Legacy",
    body: "Founded by three visionary women in 2025, Frozen Fusion redefines the art of premium dessert experiences.",
    link: "/story",
    cta: "Read Our Story",
  },
  {
    headline: "Join the Revolution",
    body: "Become part of the fastest-growing luxury dessert brand in India. Discover franchise and partnership opportunities.",
    link: "/partnership",
    cta: "Partner With Us",
  },
  {
    headline: "Visual Feast",
    body: "Immerse yourself in the world of Frozen Fusion. Browse our premium cinematic gallery.",
    link: "/gallery",
    cta: "View Gallery",
  },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <main className="relative text-white min-h-screen bg-transparent">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Hero Intro Overlay - Fades out as you scroll */}
      <motion.div 
        className="fixed inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
      >
        <div className="text-center mt-[-10vh]">
          <h1 className="text-5xl md:text-8xl lg:text-[120px] font-bungee tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            FROZEN FUSION
          </h1>
          <p className="mt-4 text-xl md:text-3xl font-poppins font-light text-neon-cyan tracking-[0.2em] uppercase">
            Crafting the Finest Frozen Experiences
          </p>
        </div>
      </motion.div>

      {/* Scroll-driven animation container */}
      <div ref={containerRef} className="relative h-[500vh]">
        {/* Sticky canvas – sits behind the glass cards */}
        <CanvasSequence scrollProgress={scrollYProgress} />

        {/* Floating glass-card gateway layer – positioned over the canvas */}
        <div className="pointer-events-none absolute inset-0 z-20 w-full px-4 sm:px-6 md:px-8">
          <div className="h-[100vh]" /> {/* Spacing for hero text */}
          
          {gatewaySections.map((card, index) => (
            <div
              key={index}
              className="flex w-full items-center justify-center md:justify-start md:max-w-7xl md:mx-auto"
              style={{
                minHeight: "100vh",
              }}
            >
              <GlassCard
                headline={card.headline}
                body={card.body}
                index={index}
                className="pointer-events-auto items-start"
              >
                <Link href={card.link} className="mt-6 inline-block">
                  <MagneticButton variant="outline">{card.cta}</MagneticButton>
                </Link>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cinematic CTA Section ────────────────────────────────────── */}
      <section className="relative z-30 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-center">
        {/* Ambient glow */}
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-pink opacity-15 blur-[140px]" />
        
        <div className="relative z-10 flex max-w-4xl flex-col items-center gap-8">
          <h2 className="text-5xl font-extrabold tracking-tighter text-white md:text-7xl lg:text-8xl font-righteous">
            Real Cream.{" "}
            <span className="text-gradient-primary">
              Real Indulgence.
            </span>
          </h2>
          <p className="max-w-2xl text-xl leading-relaxed text-white/70">
            Premium ice cream made with real full-fat dairy, the finest cocoa,
            and absolutely no shortcuts. This is what ice cream is supposed to taste like.
          </p>
          <Link href="/products" className="mt-8">
             <MagneticButton variant="primary">Order Now</MagneticButton>
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <div className="relative z-30 bg-background">
        <Footer />
      </div>
    </main>
  );
}
