"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

/* ─────────────────────────── SVG Icons ──────────────────────────── */
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.5h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.06a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.5 16.5z" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
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
    href: "https://maps.google.com/?q=No+88,+88/1+Jeyaraj+Road,+Tuticorin+628003",
    color: "#60A5FA",
  },
  {
    icon: MailIcon,
    label: "Email",
    value: "support@frozenfusion.in",
    href: "mailto:support@frozenfusion.in",
    color: "#67E8F9",
  },
  {
    icon: PhoneIcon,
    label: "Phone",
    value: "+91 93630 40409",
    href: "tel:+919363040409",
    color: "#D4AF37",
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
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────── Nav Link Item ──────────────────────────── */
function NavLinkItem({ link, index }: { link: (typeof navLinks)[0]; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.05 * index, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={link.href}
        className="group relative flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300 font-poppins text-sm py-1"
      >
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ArrowRightIcon className="text-[#60A5FA]" />
        </span>
        <span className="relative">
          {link.name}
          <span
            className="absolute -bottom-0.5 left-0 h-px rounded-full w-0 group-hover:w-full transition-all duration-300"
            style={{ background: "linear-gradient(90deg, #60A5FA, #8B5CF6)" }}
          />
        </span>
      </Link>
    </motion.li>
  );
}

/* ─────────────────────────── Contact Card ──────────────────────────── */
function ContactCard({ info, index }: { info: (typeof contactInfo)[0]; index: number }) {
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
      className="relative flex items-start gap-3.5 rounded-2xl p-4 cursor-pointer overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid rgba(255,255,255,0.08)`,
        transition: "border-color 0.4s ease, transform 0.3s ease",
      }}
    >
      <div
        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
        style={{
          background: `${info.color}18`,
          border: `1px solid ${info.color}30`,
          color: info.color,
        }}
      >
        <IconComp />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: info.color }}>
          {info.label}
        </p>
        <p className="text-white/70 text-sm font-poppins leading-snug group-hover:text-white transition-colors duration-300">
          {info.value}
        </p>
      </div>
    </motion.a>
  );
}

/* ─────────────────────────── Social Icon ──────────────────────────── */
function SocialButton() {
  return (
    <a
      href="https://www.instagram.com/frozen_fusion_official/"
      target="_blank"
      rel="noopener noreferrer"
      className="relative w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden group hover:scale-110 transition-transform duration-200"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
      }}
      aria-label="Instagram"
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-80 transition-opacity duration-300"
        style={{
          background: "linear-gradient(135deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
        }}
      />
      <div className="relative z-10 text-white/60 group-hover:text-white transition-colors duration-200">
        <InstagramIcon />
      </div>
    </a>
  );
}

/* ─────────────────────────── Simplified Divider ──────────────────────────── */
function GlowingDivider() {
  return (
    <div className="relative w-full h-px my-16 overflow-visible">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div
        className="absolute top-0 h-px w-1/3 animate-divider-slide"
        style={{
          background: "linear-gradient(90deg, transparent, #60A5FA, #8B5CF6, #D4AF37, transparent)",
          filter: "blur(1px)",
        }}
      />
    </div>
  );
}

/* ─────────────────────────── Main Footer ──────────────────────────── */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden mt-24"
      style={{
        background:
          "radial-gradient(ellipse at 20% 50%, #141A24 0%, #111316 40%, #1C2333 70%, #111316 100%)",
      }}
    >
      {/* ── Static Background Gradients (no JS animation) ── */}
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
        {/* Noise texture */}
        <div className="bg-noise opacity-50" />
        {/* Glass reflection */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }}
        />
      </div>

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
                boxShadow: "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#60A5FA] to-[#8B5CF6]" />
                <h4 className="text-white/80 text-xs font-semibold uppercase tracking-[0.2em] font-poppins">
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
                boxShadow: "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#67E8F9] to-[#D4AF37]" />
                <h4 className="text-white/80 text-xs font-semibold uppercase tracking-[0.2em] font-poppins">
                  Get in Touch
                </h4>
              </div>
              <div className="space-y-3">
                {contactInfo.map((info, i) => (
                  <ContactCard key={info.label} info={info} index={i} />
                ))}
              </div>

              {/* Decorative aurora strip — CSS animation instead of framer-motion */}
              <div className="mt-6 relative overflow-hidden rounded-xl h-12 flex items-center px-5">
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(96,165,250,0.1), rgba(139,92,246,0.1), rgba(212,175,55,0.1))",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
                <div
                  className="absolute inset-y-0 w-1/3 animate-aurora-shimmer"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
                  }}
                />
                <p className="relative z-10 text-white/40 text-xs font-poppins tracking-wide">
                  ✦ &nbsp; Tuticorin&apos;s first premium dessert brand — crafting joy since 2025 &nbsp; ✦
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
          {/* CSS-animated glow line instead of framer-motion */}
          <div
            className="absolute top-0 left-0 h-px w-1/4 animate-bottom-bar-glow"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.5), transparent)",
            }}
          />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-poppins text-xs">
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
                <Link
                  key={label}
                  href="#"
                  className="relative text-white/40 hover:text-white/80 transition-colors duration-300 font-poppins text-xs group"
                >
                  {label}
                  <span
                    className="absolute -bottom-0.5 left-0 h-px rounded-full w-0 group-hover:w-full transition-all duration-300"
                    style={{ background: "linear-gradient(90deg, #60A5FA, #8B5CF6)" }}
                  />
                </Link>
              ))}
            </div>

            {/* Right */}
            <p className="text-white/30 flex items-center gap-1.5">
              Designed &amp; Engineered with Excellence ✨
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
