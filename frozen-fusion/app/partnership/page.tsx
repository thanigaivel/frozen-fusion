"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

/* ─── Data ─────────────────────────────────────────────────────── */
const businessModels = [
  {
    title: "Frozen Fusion Express Partner",
    tagline: "Mobile • Flexible • High-Footfall",
    desc: "A compact mobile business format designed for high-footfall locations, events, markets and emerging opportunities.",
    investment: "₹5 Lakh*",
    note: "Includes initial stock",
    image: "/partnership/cart-byk.jpeg",
    accent: "#3BE8FF",
    gradient: "from-cyan-500/20 to-blue-600/20",
    borderGlow: "rgba(59,232,255,0.3)",
    icon: "🛺",
  },
  {
    title: "Grab & Go Partner",
    tagline: "Compact • Convenient • Scalable",
    desc: "A premium takeaway-focused outlet designed for high-footfall locations, residential catchments and everyday dessert demand.",
    investment: "₹6 – 7 Lakh*",
    note: "Includes initial stock · Price varies by location",
    image: "/partnership/grab-and-go.jpeg",
    accent: "#FF2BC2",
    gradient: "from-pink-500/20 to-purple-600/20",
    borderGlow: "rgba(255,43,194,0.3)",
    icon: "🏪",
  },
  {
    title: "Dining Outlet Partner",
    tagline: "Premium • Experiential • Family-Focused",
    desc: "A premium dessert destination designed to deliver a complete Frozen Fusion experience for families, groups and dessert lovers.",
    investment: "₹12 – 15 Lakh*",
    note: "Includes initial stock · Price varies by location",
    image: "/partnership/dining-outlet.jpeg",
    accent: "#FFB347",
    gradient: "from-amber-500/20 to-orange-600/20",
    borderGlow: "rgba(255,179,71,0.3)",
    icon: "🍽️",
  },
];

const partnerModels = [
  {
    title: "District Partner",
    tagline: "Build Your Territory",
    desc: "Develop the Frozen Fusion network within an assigned district by connecting and supporting partner outlets.",
    bestFor: "Entrepreneurs / Distributors",
    image: "/partnership/district_partners.jpeg",
    accent: "#4ADE80",
    icon: "🗺️",
  },
  {
    title: "Super Stockist",
    tagline: "Power the Supply Network",
    desc: "Manage regional product distribution and support the supply chain across multiple Frozen Fusion partner locations.",
    bestFor: "Distributors / FMCG Operators",
    image: "/partnership/super-stockist.jpeg",
    accent: "#A78BFA",
    icon: "📦",
  },
  {
    title: "Marketing Partner",
    tagline: "Generate • Connect • Earn",
    desc: "Build local awareness, generate B2B opportunities and connect Frozen Fusion with businesses, events and institutional customers.",
    bestFor: "Sales Professionals / Entrepreneurs",
    image: "/partnership/marketing-partners.jpeg",
    accent: "#67E8F9",
    icon: "📣",
  },
];

/* ─── Animated section wrapper ─────────────────────────────────── */
function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-8%" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Section heading ──────────────────────────────────────────── */
function SectionHeading({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <FadeIn className="text-center mb-16 md:mb-20">
      <span className="inline-block px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] font-poppins mb-5 border border-white/10 bg-white/[0.04]"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        {label}
      </span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bungee leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60 mb-4 md:mb-6 px-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto font-poppins leading-relaxed px-4">
          {subtitle}
        </p>
      )}
    </FadeIn>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main Page Component
   ═══════════════════════════════════════════════════════════════════ */
export default function PartnershipPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
    description: "",
  });

  const openPopup = (title: string) => {
    setSelectedType(title);
    setIsPopupOpen(true);
    setStatus("idle");
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedType(null);
    setFormData({ name: "", contact: "", address: "", description: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL;
      const url = adminUrl
        ? `${adminUrl}/api/partnership`
        : "http://localhost:3001/api/partnership";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, selectedType }),
      });
      if (!res.ok) throw new Error("Failed to submit inquiry.");
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("idle");
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      {/* ─────────────────────────────────────────────────────────
          SECTION 1 — HERO
         ───────────────────────────────────────────────────────── */}
      <section className="relative pt-36 md:pt-44 pb-20 md:pb-32 px-6 overflow-hidden">
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] animate-orb-1"
            style={{ background: "radial-gradient(circle, rgba(124,77,255,0.12) 0%, transparent 70%)" }} />
          <div className="absolute top-20 right-1/3 w-[500px] h-[500px] rounded-full blur-[120px] animate-orb-2"
            style={{ background: "radial-gradient(circle, rgba(255,43,194,0.08) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[140px] animate-orb-3"
            style={{ background: "radial-gradient(circle, rgba(59,232,255,0.08) 0%, transparent 70%)" }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 text-xs font-bold uppercase tracking-[0.2em] font-poppins"
            style={{
              background: "rgba(124,77,255,0.1)",
              border: "1px solid rgba(124,77,255,0.25)",
              color: "#A78BFA",
            }}
          >
            🤝 Partnership
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bungee leading-[1.05] tracking-tight mb-6 md:mb-8"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #FF2BC2 50%, #7C4DFF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 40px rgba(255,43,194,0.2))",
            }}
          >
            Build Your Business with Frozen Fusion
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-base md:text-xl text-white/60 max-w-3xl mx-auto font-poppins leading-relaxed mb-4"
          >
            Join the growing Frozen Fusion partner network and explore flexible business opportunities designed for entrepreneurs, business owners and growth partners.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm md:text-base text-white/40 max-w-2xl mx-auto font-poppins leading-relaxed mb-10"
          >
            From compact mobile formats to premium dessert outlets that fits your investment, location and growth ambitions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href="#business-models"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-sm md:text-base uppercase tracking-wider font-poppins transition-all duration-300 group"
              style={{
                background: "linear-gradient(135deg, #FF2BC2, #7C4DFF)",
                boxShadow: "0 0 30px rgba(255,43,194,0.3), 0 0 60px rgba(124,77,255,0.15)",
              }}
            >
              <span>Explore Partnership Opportunities</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-0.5 transition-transform duration-200">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          SECTION 2 — BUSINESS MODELS
         ───────────────────────────────────────────────────────── */}
      <section id="business-models" className="relative py-20 md:py-28 px-6">
        {/* Subtle bg glow */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[200px]"
          style={{ background: "radial-gradient(circle, rgba(255,43,194,0.05) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeading
            label="Business Models"
            title="Choose the Right Format for Your Business"
            subtitle="Frozen Fusion offers multiple business formats designed for different investment levels, locations and customer opportunities."
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {businessModels.map((model, i) => (
              <FadeIn key={model.title} delay={i * 0.12}>
                <div
                  className="group relative flex flex-col h-full rounded-3xl overflow-hidden border border-white/[0.08] hover:border-white/20 transition-all duration-700"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  {/* Image area */}
                  <div className="relative h-56 md:h-64 overflow-hidden">
                    <img
                      src={model.image}
                      alt={model.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D] via-[#0A0A0D]/60 to-transparent" />

                    {/* Floating icon badge */}
                    <div
                      className="absolute top-4 left-4 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-md border border-white/10"
                      style={{ background: "rgba(0,0,0,0.5)" }}
                    >
                      {model.icon}
                    </div>

                    {/* Glow accent on hover */}
                    <div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${model.accent}, transparent)`,
                        boxShadow: `0 0 20px ${model.borderGlow}`,
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6 md:p-8">
                    {/* Tagline */}
                    <span
                      className="text-[11px] font-bold uppercase tracking-[0.15em] font-poppins mb-3"
                      style={{ color: model.accent }}
                    >
                      {model.tagline}
                    </span>

                    <h3 className="text-xl md:text-2xl font-righteous text-white mb-3 leading-tight">
                      {model.title}
                    </h3>

                    <p className="text-sm text-white/50 font-poppins leading-relaxed mb-6 flex-1">
                      {model.desc}
                    </p>

                    {/* Investment */}
                    <div className="border-t border-white/[0.08] pt-5 mb-5">
                      <span className="text-[10px] uppercase tracking-[0.15em] text-white/30 font-poppins block mb-1.5">
                        Total Investment
                      </span>
                      <div className="text-2xl font-bold font-poppins text-white">
                        {model.investment}
                      </div>
                      <span className="text-xs text-white/30 font-poppins mt-1 block">
                        {model.note}
                      </span>
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => openPopup(model.title)}
                      className="w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider font-poppins transition-all duration-300 border group-hover:scale-[1.02]"
                      style={{
                        background: `linear-gradient(135deg, ${model.accent}10, ${model.accent}05)`,
                        borderColor: `${model.accent}30`,
                        color: model.accent,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `linear-gradient(135deg, ${model.accent}25, ${model.accent}15)`;
                        e.currentTarget.style.boxShadow = `0 0 20px ${model.borderGlow}`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = `linear-gradient(135deg, ${model.accent}10, ${model.accent}05)`;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      Explore Model
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          SECTION 3 — PARTNER MODELS
         ───────────────────────────────────────────────────────── */}
      <section className="relative py-20 md:py-28 px-6">
        {/* Divider line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-4xl h-px overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent animate-divider-slide" />
        </div>

        {/* Background glow */}
        <div className="pointer-events-none absolute bottom-1/3 right-0 w-[600px] h-[600px] rounded-full blur-[180px]"
          style={{ background: "radial-gradient(circle, rgba(124,77,255,0.06) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeading
            label="Partner Models"
            title="Grow with Frozen Fusion"
            subtitle="Beyond operating an outlet, Frozen Fusion offers multiple ways to build a business through our partner ecosystem."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {partnerModels.map((model, i) => (
              <FadeIn key={model.title} delay={i * 0.12}>
                <div className="group relative flex flex-col h-full rounded-3xl overflow-hidden border border-white/[0.08] hover:border-white/20 transition-all duration-700">
                  {/* Image area */}
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <img
                      src={model.image}
                      alt={model.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D] via-[#0A0A0D]/70 to-transparent" />

                    {/* Icon badge */}
                    <div
                      className="absolute top-4 left-4 w-11 h-11 rounded-xl flex items-center justify-center text-xl backdrop-blur-md border border-white/10"
                      style={{ background: "rgba(0,0,0,0.5)" }}
                    >
                      {model.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6 md:p-8" style={{ background: "rgba(255,255,255,0.015)" }}>
                    <span
                      className="text-[11px] font-bold uppercase tracking-[0.15em] font-poppins mb-2"
                      style={{ color: model.accent }}
                    >
                      {model.tagline}
                    </span>

                    <h3 className="text-xl md:text-2xl font-righteous text-white mb-3 leading-tight">
                      {model.title}
                    </h3>

                    <p className="text-sm text-white/50 font-poppins leading-relaxed mb-5 flex-1">
                      {model.desc}
                    </p>

                    {/* Best For */}
                    <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-[10px] uppercase tracking-wider text-white/30 font-poppins">Best for:</span>
                      <span className="text-xs text-white/60 font-poppins font-medium">{model.bestFor}</span>
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => openPopup(model.title)}
                      className="w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider font-poppins transition-all duration-300 bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.1] hover:border-white/25 text-white/70 hover:text-white group-hover:scale-[1.02]"
                    >
                      Inquire Now
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* ─── Inquiry Modal ─────────────────────────────────────── */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-[#0A0A0D] border border-white/15 rounded-3xl p-8 shadow-2xl"
            style={{ boxShadow: "0 0 60px rgba(124,77,255,0.08), 0 25px 50px rgba(0,0,0,0.5)" }}
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>

            {status === "success" ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-500/15 text-green-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-righteous text-white mb-3">Inquiry Received!</h3>
                <p className="text-white/50 font-poppins text-sm">
                  Our representative will contact you soon.
                </p>
                <button
                  onClick={closePopup}
                  className="mt-8 px-8 py-3 bg-white/[0.06] hover:bg-white/[0.12] text-white rounded-full font-poppins text-sm transition-colors border border-white/10"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-righteous text-white mb-1.5">Inquire Now</h3>
                  <p className="text-white/40 text-sm font-poppins">
                    Interested in <span className="font-semibold text-white/60">{selectedType}</span>. Fill out the details below.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5 font-poppins">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-electric-purple/50 transition-colors"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Contact Number"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-electric-purple/50 transition-colors"
                  />
                  <textarea
                    required
                    placeholder="Your Full Address"
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-electric-purple/50 transition-colors resize-none"
                  />
                  <textarea
                    required
                    placeholder="Tell us about your investment capacity, proposed location, business experience..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-electric-purple/50 transition-colors resize-none"
                  />
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full py-4 mt-2 rounded-xl font-bold text-sm tracking-wider text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(135deg, #FF2BC2, #7C4DFF)",
                      boxShadow: "0 0 20px rgba(255,43,194,0.2)",
                    }}
                  >
                    {status === "submitting" ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      "SUBMIT INQUIRY"
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </main>
  );
}
