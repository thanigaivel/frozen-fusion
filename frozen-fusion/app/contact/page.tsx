"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

/* ─── Contact Cards Data (Matching exact footer details) ─── */
const CONTACT_DETAILS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    title: "Visit Our Parlour",
    subtitle: "Location & Address",
    value: "No 88, 88/1 Jeyaraj Road, Tuticorin 628003",
    actionText: "Open in Maps →",
    href: "https://maps.google.com/?q=No+88+88/1+Jeyaraj+Road+Tuticorin+628003",
    color: "#60A5FA",
    glow: "rgba(96,165,250,0.3)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
    title: "Email Support",
    subtitle: "24/7 Response Desk",
    value: "support@frozenfusion.in",
    actionText: "Send Mail →",
    href: "mailto:support@frozenfusion.in",
    color: "#67E8F9",
    glow: "rgba(103,232,249,0.3)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    title: "Call or WhatsApp",
    subtitle: "Customer Helpline",
    value: "+91 93630 40409",
    actionText: "Call Now →",
    href: "tel:+919363040409",
    color: "#FCD34D",
    glow: "rgba(252,211,77,0.3)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    ),
    title: "Official Instagram",
    subtitle: "Follow & Tag Us",
    value: "@frozen_fusion_official",
    actionText: "Visit Profile →",
    href: "https://www.instagram.com/frozen_fusion_official/",
    color: "#FF6BD6",
    glow: "rgba(255,107,214,0.3)",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL;
      if (!adminUrl && process.env.NODE_ENV === "production") {
        throw new Error("NEXT_PUBLIC_ADMIN_URL is not set");
      }
      const url = adminUrl ? `${adminUrl}/api/contact` : "http://localhost:3001/api/contact";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit message");
      }

      setStatus({ type: "success", message: "Your message has been sent successfully! Our team will respond shortly." });
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col relative bg-gray-950 text-white overflow-hidden">
      {/* ── Background Image & Overlay ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1920&auto=format&fit=crop&q=80"
          alt="Frozen Fusion Ice Cream"
          fill
          unoptimized
          className="object-cover opacity-20 filter blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950/85 to-gray-950" />
      </div>

      {/* ── Ambient Radial Orbs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div 
          className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px]"
          style={{ background: "radial-gradient(circle, rgba(255,107,214,0.12) 0%, transparent 70%)" }} 
        />
        <div 
          className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full blur-[130px]"
          style={{ background: "radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)" }} 
        />
      </div>

      <Navbar />

      <div className="flex-1 container mx-auto px-6 max-w-7xl pt-36 pb-24 relative z-10">
        {/* ── Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center mb-16 text-center"
        >
          <div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold uppercase tracking-widest font-inter" 
            style={{ background: "rgba(255,107,214,0.1)", border: "1px solid rgba(255,107,214,0.25)", color: "#FF6BD6" }}
          >
            💬 We'd Love To Hear From You
          </div>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bungee leading-none tracking-tight mb-6 uppercase"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #FF6BD6 50%, #60A5FA 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 40px rgba(255,107,214,0.3))",
            }}
          >
            CONTACT US
          </h1>
          <p className="text-lg text-white/60 max-w-2xl font-inter leading-relaxed">
            Have questions about our dessert menu, corporate event catering, or franchise opportunities? Get in touch with our team.
          </p>
        </motion.div>

        {/* ── Contact Info Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {CONTACT_DETAILS.map((item, i) => (
            <motion.a
              key={i}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative p-6 rounded-3xl overflow-hidden backdrop-blur-xl flex flex-col justify-between"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 4px 30px rgba(0,0,0,0.2)",
              }}
            >
              {/* Glow overlay on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at center, ${item.glow} 0%, transparent 75%)` }}
              />

              <div>
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: `${item.color}20`, border: `1px solid ${item.color}40`, color: item.color }}
                >
                  {item.icon}
                </div>
                <p className="text-white/40 font-inter text-xs uppercase tracking-widest mb-1">{item.subtitle}</p>
                <h3 className="text-lg font-righteous text-white mb-2 group-hover:text-pink-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-white/80 font-inter text-sm font-medium leading-snug break-words">
                  {item.value}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-inter font-semibold" style={{ color: item.color }}>
                <span>{item.actionText}</span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* ── Main Section: Form + Location Info ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 p-8 md:p-12 rounded-3xl relative overflow-hidden backdrop-blur-2xl"
            style={{
              background: "rgba(20,20,28,0.85)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 0 50px rgba(255,107,214,0.12), 0 20px 50px rgba(0,0,0,0.5)",
            }}
          >
            <h3 className="text-3xl font-righteous text-white mb-2">Send Us a Message</h3>
            <p className="text-white/50 font-inter text-sm mb-8">Fill out the form below and our customer experience team will reply within 24 hours.</p>

            {status.type === "success" ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500">
                  <span className="text-3xl">🎉</span>
                </div>
                <h3 className="text-2xl font-righteous text-white mb-2">Message Sent!</h3>
                <p className="text-white/70 font-inter text-sm mb-8">{status.message}</p>
                <button 
                  onClick={() => setStatus({ type: null, message: "" })}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white font-medium transition-all text-sm font-inter"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider font-inter">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-gray-800/60 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500 transition-colors placeholder-gray-500 font-inter" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider font-inter">Email Address *</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-gray-800/60 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500 transition-colors placeholder-gray-500 font-inter" 
                      placeholder="john@example.com" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider font-inter">Subject *</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-gray-800/80 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500 transition-colors appearance-none cursor-pointer font-inter"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Event & Catering Inquiry">Event & Catering Inquiry</option>
                    <option value="Franchise & Partnership">Franchise & Partnership</option>
                    <option value="Feedback & Support">Feedback & Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider font-inter">Your Message *</label>
                  <textarea 
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-gray-800/60 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500 transition-colors placeholder-gray-500 resize-none font-inter" 
                    placeholder="Tell us how we can help you…" 
                  />
                </div>

                {status.type === "error" && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-inter">
                    {status.message}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 font-inter"
                >
                  {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {loading ? "Sending Message..." : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>

          {/* Location & Hours Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <div 
              className="p-8 rounded-3xl relative overflow-hidden backdrop-blur-2xl"
              style={{
                background: "rgba(20,20,28,0.85)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-semibold font-inter text-xs uppercase tracking-widest">
                  Parlour Open Daily
                </span>
              </div>
              <h3 className="text-2xl font-righteous text-white mb-3">Store Working Hours</h3>
              <div className="space-y-3 font-inter text-sm">
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Monday – Sunday</span>
                  <span className="text-white font-semibold">11:00 AM – 11:30 PM</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Weekend Special</span>
                  <span className="text-pink-400 font-semibold">Open till Midnight</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-white font-righteous text-lg mb-2">Location Address</h4>
                <p className="text-white/70 font-inter text-sm leading-relaxed mb-4">
                  No 88, 88/1 Jeyaraj Road, Tuticorin 628003, Tamil Nadu, India.
                </p>
                <a
                  href="https://maps.google.com/?q=No+88+88/1+Jeyaraj+Road+Tuticorin+628003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all font-inter"
                >
                  Get Directions on Google Maps ↗
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
