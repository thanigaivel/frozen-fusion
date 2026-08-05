"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ─────────────────────────── SVG Icons ──────────────────────────── */
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.5h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.06a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.5 16.5z"/>
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);


const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
  </svg>
);

/* ─────────────────────────── Data ──────────────────────────── */
const navLinks = [
  { name: "Products", href: "/products" },
  { name: "Our Story", href: "/story" },
  { name: "Partnership", href: "/partnership" },
  { name: "Corporate Events", href: "/events" },
  { name: "Gallery", href: "/gallery" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];



const contactInfo = [
  {
    icon: MapPinIcon,
    label: "Location",
    value: "No 88, 88/1 Jeyaraj Road, Tuticorin 628003",
    href: "https://maps.google.com",
    color: "#60A5FA",
    glow: "rgba(96,165,250,0.3)",
  },
  {
    icon: MailIcon,
    label: "Email",
    value: "support@frozenfusion.in",
    href: "mailto:support@frozenfusion.in",
    color: "#67E8F9",
    glow: "rgba(103,232,249,0.3)",
  },
  {
    icon: PhoneIcon,
    label: "Phone",
    value: "+91 93630 40409",
    href: "tel:+919363040409",
    color: "#D4AF37",
    glow: "rgba(212,175,55,0.3)",
  },
];

/* ─────────────────────────── Fade Up ──────────────────────────── */
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}




/* ─────────────────────────── Nav Link Item ──────────────────────────── */
function NavLinkItem({ link, index }: { link: (typeof navLinks)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.05 * index, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={link.href}
        className="group relative flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300 font-inter text-sm py-1"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <motion.span
          animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <ArrowRightIcon className="text-[#60A5FA]" />
        </motion.span>
        <span className="relative">
          {link.name}
          <motion.span
            className="absolute -bottom-0.5 left-0 h-px rounded-full"
            style={{ background: "linear-gradient(90deg, #60A5FA, #8B5CF6)" }}
            initial={{ width: 0 }}
            animate={{ width: hovered ? "100%" : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </span>
        <AnimatePresence>
          {hovered && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <ExternalLinkIcon className="text-white/40" />
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    </motion.li>
  );
}

/* ─────────────────────────── Contact Card ──────────────────────────── */
function ContactCard({ info, index }: { info: (typeof contactInfo)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const IconComp = info.icon;
  return (
    <motion.a
      href={info.href}
      target={info.href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 * index, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative flex items-start gap-3.5 rounded-2xl p-4 cursor-pointer overflow-hidden group"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${hovered ? info.color + "40" : "rgba(255,255,255,0.08)"}`,
        backdropFilter: "blur(20px)",
        transition: "border-color 0.4s ease",
      }}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ boxShadow: `0 0 25px ${info.glow}` }}
          />
        )}
      </AnimatePresence>
      <motion.div
        animate={{ y: hovered ? [-2, 2, -2] : 0 }}
        transition={{ duration: 1.5, repeat: hovered ? Infinity : 0, ease: "easeInOut" }}
        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
        style={{
          background: `${info.color}18`,
          border: `1px solid ${info.color}30`,
          color: info.color,
        }}
      >
        <IconComp />
      </motion.div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: info.color }}>
          {info.label}
        </p>
        <p className="text-white/70 text-sm font-inter leading-snug group-hover:text-white transition-colors duration-300">
          {info.value}
        </p>
      </div>
    </motion.a>
  );
}

/* ─────────────────────────── Social Icon ──────────────────────────── */
function SocialButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href="https://www.instagram.com/frozen_fusion_official/"
      target="_blank"
      rel="noopener noreferrer"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.12, rotate: 5 }}
      whileTap={{ scale: 0.94 }}
      className="relative w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(20px)",
      }}
      aria-label="Instagram"
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
              opacity: 0.8,
            }}
          />
        )}
      </AnimatePresence>
      <motion.div
        animate={{ y: hovered ? [-1, 1, -1] : 0 }}
        transition={{ duration: 1.2, repeat: hovered ? Infinity : 0, ease: "easeInOut" }}
        className="relative z-10"
        style={{ color: hovered ? "#fff" : "rgba(255,255,255,0.6)" }}
      >
        <InstagramIcon />
      </motion.div>
      {hovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: "0 0 25px rgba(220,39,67,0.5)" }}
        />
      )}
    </motion.a>
  );
}

/* ─────────────────────────── Animated Divider ──────────────────────────── */
function GlowingDivider() {
  return (
    <div className="relative w-full h-px my-16 overflow-visible">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
        className="absolute top-0 h-px w-1/3"
        style={{
          background:
            "linear-gradient(90deg, transparent, #60A5FA, #8B5CF6, #D4AF37, transparent)",
          filter: "blur(1px)",
        }}
      />
      {/* spark particles */}
      {[0.2, 0.5, 0.8].map((pos, i) => (
        <motion.div
          key={i}
          animate={{ y: [-4, -12, -4], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.7, ease: "easeInOut" }}
          className="absolute top-0 w-1 h-1 rounded-full"
          style={{ left: `${pos * 100}%`, background: "#60A5FA", boxShadow: "0 0 6px #60A5FA" }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────── Floating Particles ──────────────────────────── */
// Static data defined outside component to prevent hydration mismatch from Math.random()
const PARTICLE_DATA = [
  { id: 0,  x: 83.27, y: 23.85, size: 2.1, duration: 10.2, delay: 0.5,  color: "#60A5FA" },
  { id: 1,  x: 16.80, y: 74.33, size: 1.4, duration: 7.8,  delay: 1.2,  color: "#8B5CF6" },
  { id: 2,  x: 47.62, y: 11.90, size: 3.2, duration: 12.1, delay: 0.0,  color: "#D4AF37" },
  { id: 3,  x: 91.44, y: 56.78, size: 1.8, duration: 9.4,  delay: 2.3,  color: "#67E8F9" },
  { id: 4,  x: 5.33,  y: 89.12, size: 2.5, duration: 11.6, delay: 0.8,  color: "#60A5FA" },
  { id: 5,  x: 63.19, y: 35.44, size: 1.2, duration: 6.9,  delay: 3.1,  color: "#8B5CF6" },
  { id: 6,  x: 28.75, y: 67.21, size: 3.8, duration: 13.5, delay: 1.7,  color: "#D4AF37" },
  { id: 7,  x: 72.50, y: 4.60,  size: 2.0, duration: 8.3,  delay: 0.3,  color: "#67E8F9" },
  { id: 8,  x: 39.88, y: 92.37, size: 1.6, duration: 14.0, delay: 2.9,  color: "#60A5FA" },
  { id: 9,  x: 55.41, y: 48.15, size: 2.9, duration: 7.2,  delay: 1.5,  color: "#8B5CF6" },
  { id: 10, x: 10.22, y: 31.70, size: 1.3, duration: 9.8,  delay: 3.7,  color: "#D4AF37" },
  { id: 11, x: 78.65, y: 79.55, size: 2.4, duration: 11.0, delay: 0.6,  color: "#67E8F9" },
  { id: 12, x: 23.98, y: 18.44, size: 3.5, duration: 6.5,  delay: 2.1,  color: "#60A5FA" },
  { id: 13, x: 49.10, y: 61.83, size: 1.7, duration: 12.7, delay: 0.9,  color: "#8B5CF6" },
  { id: 14, x: 86.32, y: 42.09, size: 2.2, duration: 8.9,  delay: 1.4,  color: "#D4AF37" },
  { id: 15, x: 34.57, y: 85.60, size: 1.1, duration: 10.6, delay: 3.3,  color: "#67E8F9" },
  { id: 16, x: 67.83, y: 27.34, size: 2.7, duration: 7.4,  delay: 0.2,  color: "#60A5FA" },
  { id: 17, x: 12.46, y: 52.88, size: 3.1, duration: 13.2, delay: 2.6,  color: "#8B5CF6" },
  { id: 18, x: 58.79, y: 96.17, size: 1.9, duration: 9.1,  delay: 1.0,  color: "#D4AF37" },
  { id: 19, x: 43.25, y: 7.43,  size: 2.6, duration: 11.8, delay: 3.8,  color: "#67E8F9" },
];

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLE_DATA.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────── Mouse Glow ──────────────────────────── */
function MouseGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const footerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!footerRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return { footerRef, pos };
}

/* ─────────────────────────── Main Footer ──────────────────────────── */
export function Footer() {
  const { footerRef, pos } = MouseGlow();
  const year = new Date().getFullYear();

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden mt-24"
      style={{
        background:
          "radial-gradient(ellipse at 20% 50%, #141A24 0%, #111316 40%, #1C2333 70%, #111316 100%)",
      }}
    >
      {/* ── Layered Radial Background Gradients ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-[100%] blur-[120px]"
          style={{ background: "radial-gradient(ellipse, rgba(212,175,55,0.04) 0%, transparent 70%)" }}
        />
        {/* Moving blurred blobs */}
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-16 left-[10%] w-[350px] h-[350px] rounded-full blur-[100px]"
          style={{ background: "rgba(103,232,249,0.05)" }}
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-20 right-[10%] w-[300px] h-[300px] rounded-full blur-[90px]"
          style={{ background: "rgba(212,175,55,0.05)" }}
        />
        {/* Noise texture */}
        <div className="bg-noise opacity-50" />
        {/* Glass reflection */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }}
        />
      </div>

      {/* ── Mouse Follow Glow ── */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, rgba(96,165,250,0.06) 0%, transparent 70%)`,
        }}
      />

      {/* ── Floating Particles ── */}
      <FloatingParticles />

      {/* ── Main Content ── */}
      <div className="relative z-10 mx-auto px-6 max-w-[1400px] pt-16 pb-0">

        {/* ══ MAIN GRID ══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-6">



          {/* ── Col 1: Navigation ── */}
          <FadeUp delay={0.1} className="xl:col-span-1">
            <div
              className="h-full rounded-[28px] p-7"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
                backdropFilter: "blur(30px)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#60A5FA] to-[#8B5CF6]" />
                <h4 className="text-white/80 text-xs font-semibold uppercase tracking-[0.2em] font-inter">
                  Quick Links
                </h4>
              </div>
              <ul className="space-y-1.5">
                {navLinks.map((link, i) => (
                  <NavLinkItem key={link.name} link={link} index={i} />
                ))}
              </ul>
            </div>
          </FadeUp>

          {/* ── Col 2: Contact ── */}
          <FadeUp delay={0.2} className="xl:col-span-2">
            <div
              className="h-full rounded-[28px] p-7"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
                backdropFilter: "blur(30px)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#67E8F9] to-[#D4AF37]" />
                <h4 className="text-white/80 text-xs font-semibold uppercase tracking-[0.2em] font-inter">
                  Get in Touch
                </h4>
              </div>
              <div className="space-y-3">
                {contactInfo.map((info, i) => (
                  <ContactCard key={info.label} info={info} index={i} />
                ))}
              </div>

              {/* Decorative aurora strip */}
              <div className="mt-6 relative overflow-hidden rounded-xl h-12 flex items-center px-5">
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(96,165,250,0.1), rgba(139,92,246,0.1), rgba(212,175,55,0.1))",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
                  className="absolute inset-y-0 w-1/3"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
                  }}
                />
                <p className="relative z-10 text-white/40 text-xs font-inter tracking-wide">
                  ✦ &nbsp; Tuticorin&apos;s first premium dessert brand — crafting joy since 2016 &nbsp; ✦
                </p>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* ══ GLOWING DIVIDER ══ */}
        <GlowingDivider />

        {/* ══ LARGE WATERMARK TEXT ══ */}
        <div className="w-full flex justify-center mb-0 overflow-hidden">
          <motion.p
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[11vw] sm:text-[10vw] font-bungee leading-none select-none"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.02em",
            }}
          >
            FROZEN FUSION
          </motion.p>
        </div>

        {/* ══ BOTTOM BAR ══ */}
        <div
          className="relative mt-0 pt-6 pb-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
            className="absolute top-0 left-0 h-px w-1/4"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.5), transparent)",
            }}
          />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-inter text-xs">
            {/* Left */}
            <div className="text-center md:text-left">
              <p className="text-white/40">
                © {year} Frozen Fusion. All rights reserved.
              </p>
              <p className="text-white/25 mt-0.5">
                Crafted with passion, precision, and purpose.
              </p>
            </div>

            {/* Center */}
            <div className="flex items-center gap-6">
              {["Privacy Policy", "Terms of Service"].map((label) => (
                <BottomBarLink key={label} label={label} />
              ))}
            </div>

            {/* Right */}
            <motion.p
              className="text-white/30 flex items-center gap-1.5"
              whileHover={{ color: "rgba(255,255,255,0.6)" }}
              transition={{ duration: 0.3 }}
            >
              Designed &amp; Engineered with Excellence
              <motion.span
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                ✨
              </motion.span>
            </motion.p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────── Bottom Bar Link ──────────────────────────── */
function BottomBarLink({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href="#"
      className="relative text-white/40 hover:text-white/80 transition-colors duration-300 font-inter text-xs"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
      <motion.span
        className="absolute -bottom-0.5 left-0 h-px rounded-full"
        style={{ background: "linear-gradient(90deg, #60A5FA, #8B5CF6)" }}
        initial={{ width: 0 }}
        animate={{ width: hovered ? "100%" : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </Link>
  );
}
