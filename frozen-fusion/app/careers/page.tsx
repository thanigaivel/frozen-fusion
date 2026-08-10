"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

/* ─── Culture & Perks Data ─── */
const PERKS = [
  {
    icon: "🍦",
    title: "Unlimited Tasting Perks",
    description: "Sample every new fusion creation and enjoy complimentary daily dessert privileges across our parlours.",
    color: "#FF6BD6",
    glow: "rgba(255,107,214,0.3)",
  },
  {
    icon: "🚀",
    title: "Fast-Track Career Growth",
    description: "Join India's fastest-growing luxury dessert brand with clear promotion pathways and leadership coaching.",
    color: "#60A5FA",
    glow: "rgba(96,165,250,0.3)",
  },
  {
    icon: "🎨",
    title: "Culinary & Creative Freedom",
    description: "Collaborate directly with master chefs to experiment, craft, and launch groundbreaking ice cream flavors.",
    color: "#FCD34D",
    glow: "rgba(252,211,77,0.3)",
  },
  {
    icon: "💖",
    title: "Vibrant Lounge Culture",
    description: "Work in high-energy, neon-lit, state-of-the-art lounge environments built around joy and hospitality.",
    color: "#34D399",
    glow: "rgba(52,211,153,0.3)",
  },
];

/* ─── Open Roles Data ─── */
const ROLES = [
  { title: "Dessert Chef / Flavor Alchemist", department: "Kitchen & R&D", location: "Tuticorin Flagship", badge: "Hot Role" },
  { title: "Store Lounge Manager", department: "Operations", location: "Tuticorin Flagship", badge: "Leadership" },
  { title: "Customer Experience Specialist", department: "Front of House", location: "Tuticorin Flagship", badge: "Full-Time" },
  { title: "Brand & Social Media Storyteller", department: "Marketing", location: "Hybrid / Tuticorin", badge: "Creative" },
];

export default function CareersPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Dessert Chef / Flavor Alchemist" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    if (!formData.name || !formData.email) {
      setStatus({ type: "error", message: "Please fill in all required fields." });
      return;
    }

    setLoading(true);

    try {
      let fileBase64 = null;
      let fileName = null;
      let fileType = null;

      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setStatus({ type: "error", message: "File size exceeds 5MB limit." });
          setLoading(false);
          return;
        }
        fileBase64 = await fileToBase64(file);
        fileName = file.name;
        fileType = file.type;
      }

      const payload = { ...formData, fileBase64, fileName, fileType };

      const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL;
      if (!adminUrl && process.env.NODE_ENV === "production") {
        throw new Error("NEXT_PUBLIC_ADMIN_URL is not set");
      }
      const url = adminUrl ? `${adminUrl}/api/careers` : "http://localhost:3001/api/careers";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: "Application submitted successfully! Our talent team will review your profile shortly." });
        setFormData({ name: "", email: "", role: "Dessert Chef / Flavor Alchemist" });
        setFile(null);
      } else {
        setStatus({ type: "error", message: data.error || "Failed to submit application." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col relative bg-gray-950 text-white overflow-hidden">
      {/* ── Glowing Ice Cream Hero Background ── */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=1920&auto=format&fit=crop&q=80"
          alt="Glowing Ice Cream Dessert"
          fill
          unoptimized
          className="object-cover opacity-20 filter blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950/85 to-gray-950" />
      </div>

      {/* ── Ambient Radial Orbs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div 
          className="absolute -top-32 left-1/3 w-[600px] h-[600px] rounded-full blur-[140px]"
          style={{ background: "radial-gradient(circle, rgba(255,107,214,0.12) 0%, transparent 70%)" }} 
        />
        <div 
          className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full blur-[130px]"
          style={{ background: "radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)" }} 
        />
      </div>

      <Navbar />

      <div className="flex-1 container mx-auto px-6 max-w-6xl pt-36 pb-24 relative z-10">
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
            🍨 Join The Frozen Revolution
          </div>
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bungee leading-none tracking-tight mb-6"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #FF6BD6 50%, #FCD34D 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 40px rgba(255,107,214,0.3))",
            }}
          >
            CRAFT THE FUTURE OF DESSERT
          </h1>
          <p className="text-lg text-white/60 max-w-2xl font-inter leading-relaxed">
            We are looking for passionate flavor alchemists, hospitality leaders, and innovators to build Tuticorin's most iconic luxury frozen dessert brand.
          </p>
        </motion.div>

        {/* ── Why Work With Us Perks Grid ── */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-righteous text-white mb-2">Why You'll Love Working Here</h2>
            <p className="text-white/50 text-sm font-inter">Sweet perks, unmatched culture, and continuous innovation.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PERKS.map((perk, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="p-6 rounded-3xl relative overflow-hidden backdrop-blur-xl group"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 4px 30px rgba(0,0,0,0.2)",
                }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at center, ${perk.glow} 0%, transparent 75%)` }}
                />
                <div className="text-4xl mb-4">{perk.icon}</div>
                <h3 className="text-lg font-righteous text-white mb-2 group-hover:text-pink-300 transition-colors">
                  {perk.title}
                </h3>
                <p className="text-white/60 font-inter text-xs leading-relaxed">
                  {perk.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Open Roles Spotlight ── */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-righteous text-white mb-2">Featured Open Positions</h2>
            <p className="text-white/50 text-sm font-inter">Explore active opportunities to join our team.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ROLES.map((role, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-pink-500/40 transition-all flex items-center justify-between group cursor-pointer"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, role: role.title }));
                  document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      {role.badge}
                    </span>
                    <span className="text-white/40 text-xs font-inter">{role.department}</span>
                  </div>
                  <h4 className="text-white font-righteous text-base group-hover:text-pink-300 transition-colors">
                    {role.title}
                  </h4>
                  <p className="text-white/40 text-xs font-inter mt-1">📍 {role.location}</p>
                </div>
                <span className="text-sm font-semibold text-pink-400 group-hover:translate-x-1 transition-transform">
                  Apply →
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Application Form Section ── */}
        <div id="apply-form" className="scroll-mt-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 md:p-12 rounded-3xl relative overflow-hidden backdrop-blur-2xl"
            style={{
              background: "rgba(20,20,28,0.85)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 0 50px rgba(255,107,214,0.15), 0 20px 50px rgba(0,0,0,0.5)",
            }}
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-righteous text-white mb-2">Apply Online</h2>
              <p className="text-white/50 font-inter text-sm">Complete the form below to submit your application to Frozen Fusion HR.</p>
            </div>

            {status.type === "success" ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500">
                  <span className="text-3xl">🎉</span>
                </div>
                <h3 className="text-2xl font-righteous text-white mb-2">Application Received!</h3>
                <p className="text-white/70 font-inter text-sm mb-8">{status.message}</p>
                <button 
                  onClick={() => setStatus({ type: null, message: "" })}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white font-medium transition-all text-sm font-inter"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
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
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider font-inter">Position / Role *</label>
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-gray-800/80 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500 transition-colors appearance-none cursor-pointer font-inter"
                  >
                    <option value="Dessert Chef / Flavor Alchemist">Dessert Chef / Flavor Alchemist</option>
                    <option value="Store Lounge Manager">Store Lounge Manager</option>
                    <option value="Customer Experience Specialist">Customer Experience Specialist</option>
                    <option value="Brand & Social Media Storyteller">Brand & Social Media Storyteller</option>
                    <option value="Marketing Specialist">Marketing Specialist</option>
                    <option value="Other Positions">Other Positions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider font-inter">Resume Upload (PDF, DOC, DOCX - Max 5MB)</label>
                  <div 
                    className={`relative w-full h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 transition-all duration-300 ${dragActive ? 'border-pink-500 bg-pink-500/10' : 'border-gray-700 hover:border-gray-500 bg-gray-800/30'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {file ? (
                      <div className="text-center">
                        <p className="text-pink-400 font-bold mb-1 truncate max-w-[280px] mx-auto text-sm font-inter">{file.name}</p>
                        <p className="text-xs text-white/50 font-inter">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <button type="button" onClick={() => setFile(null)} className="mt-3 text-xs text-red-400 hover:underline font-inter">Remove file</button>
                      </div>
                    ) : (
                      <div className="text-center pointer-events-none">
                        <svg className="w-8 h-8 mx-auto text-white/40 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p className="text-white/70 font-inter text-sm">Drag & drop your resume here or <span className="text-pink-400 underline">browse</span></p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
                      }} 
                    />
                  </div>
                </div>

                {status.type === "error" && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-inter">
                    {status.message}
                  </div>
                )}

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 font-inter"
                  >
                    {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    {loading ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
