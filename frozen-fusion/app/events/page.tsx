"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

/* ─── Event Types Data ─── */
const events = [
  {
    title: "Birthdays",
    description: "Make your birthday unforgettable with our live ice cream counters and customized dessert spreads.",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&auto=format&fit=crop&q=80",
    color: "#FF6BD6", // pink
    glow: "rgba(255,107,214,0.4)"
  },
  {
    title: "Weddings",
    description: "Elegant, premium dessert experiences tailored to your special day. A sweet ending to a beautiful beginning.",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop&q=80",
    color: "#FCD34D", // yellow
    glow: "rgba(252,211,77,0.4)"
  },
  {
    title: "Corporate Events",
    description: "Impress your clients and treat your team. Professional setups for product launches, conferences, and parties.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80",
    color: "#60A5FA", // blue
    glow: "rgba(96,165,250,0.4)"
  },
  {
    title: "School & College Fests",
    description: "High-energy, fun, and vibrant dessert stalls that will be the highlight of any campus festival.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80",
    color: "#34D399", // emerald
    glow: "rgba(52,211,153,0.4)"
  },
  {
    title: "Hotels & Banquets",
    description: "Bulk orders and continuous supply for premium hospitality venues. Authentic taste for your esteemed guests.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
    color: "#A78BFA", // purple
    glow: "rgba(167,139,250,0.4)"
  }
];

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    contactNo: "",
    deliveryAddress: "",
    eventDescription: ""
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
      const url = adminUrl ? `${adminUrl}/api/events` : "http://localhost:3001/api/events";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          eventType: selectedEvent
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit booking");
      }

      setStatus({ type: "success", message: "Your booking request has been sent successfully. We will contact you soon!" });
      setFormData({ name: "", contactNo: "", deliveryAddress: "", eventDescription: "" });
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col relative bg-gray-950 overflow-hidden">
      {/* ── Background Image ── */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1920&auto=format&fit=crop&q=80"
          alt="Mouth-watering Ice Cream"
          fill
          unoptimized
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950/80 to-gray-950" />
      </div>

      <Navbar />

      <div className="flex-1 container mx-auto px-6 max-w-7xl pt-36 pb-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold uppercase tracking-widest font-inter" style={{ background: "rgba(255,107,214,0.1)", border: "1px solid rgba(255,107,214,0.25)", color: "#FF6BD6" }}>
            🎉 Premium Catering
          </div>
          <h1 className="text-5xl md:text-7xl font-bungee leading-none tracking-tight mb-6" style={{
            background: "linear-gradient(135deg, #ffffff 0%, #FF6BD6 50%, #FCD34D 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            MAKE IT MEMORABLE
          </h1>
          <p className="text-lg text-white/60 max-w-2xl font-inter leading-relaxed">
            Elevate your special occasions with Frozen Fusion's premium dessert catering. We bring the luxury lounge experience directly to your event.
          </p>
        </motion.div>
        
        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative rounded-3xl overflow-hidden cursor-pointer flex flex-col h-full"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
                backdropFilter: "blur(10px)",
              }}
              onClick={() => setSelectedEvent(event.title)}
            >
              {/* Hover Glow */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at center, ${event.glow} 0%, transparent 70%)` }}
              />

              <div className="h-52 relative overflow-hidden shrink-0">
                <Image 
                  src={event.image} 
                  alt={event.title} 
                  fill 
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
                <div 
                  className="absolute bottom-4 left-6 w-12 h-1 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-500 group-hover:w-24"
                  style={{ backgroundColor: event.color }}
                />
              </div>

              <div className="p-6 relative z-10 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-2xl font-righteous text-white mb-2 transition-colors duration-300 group-hover:text-pink-300">
                    {event.title}
                  </h3>
                  <p className="text-white/70 font-inter text-sm leading-relaxed mb-6">
                    {event.description}
                  </p>
                </div>
                <button 
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white transition-all duration-300 font-inter relative overflow-hidden flex items-center justify-center gap-2 shadow-lg group-hover:shadow-pink-500/20"
                  style={{
                    background: `linear-gradient(135deg, ${event.color}, #d946ef)`,
                    boxShadow: `0 4px 20px ${event.glow}`
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEvent(event.title);
                  }}
                >
                  <span>Book Now</span>
                  <span className="text-base transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />

      {/* ── Booking Modal ── */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-gray-900/95 border border-white/15 rounded-3xl w-full max-w-lg p-8 relative overflow-hidden shadow-2xl"
              style={{ boxShadow: "0 0 50px rgba(255,107,214,0.15)" }}
            >
              {/* Close Button */}
              <button 
                onClick={() => { setSelectedEvent(null); setStatus({ type: null, message: "" }); }}
                className="absolute top-4 right-4 text-white/50 hover:text-white w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-colors"
              >
                ✕
              </button>

              {status.type === "success" ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500">
                    <span className="text-3xl">🎉</span>
                  </div>
                  <h3 className="text-2xl font-righteous text-white mb-2">Booking Requested!</h3>
                  <p className="text-white/70 font-inter text-sm">{status.message}</p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-righteous text-white mb-2">
                    Book <span className="text-pink-400">{selectedEvent}</span>
                  </h3>
                  <p className="text-white/50 text-sm mb-6 font-inter">Please fill in your details and we will get back to you with a customized quote.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Full Name *</label>
                      <input 
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500 transition-colors placeholder-gray-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Contact Number *</label>
                      <input 
                        required
                        type="tel"
                        value={formData.contactNo}
                        onChange={(e) => setFormData({...formData, contactNo: e.target.value})}
                        className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500 transition-colors placeholder-gray-500"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Event Address *</label>
                      <textarea 
                        required
                        rows={2}
                        value={formData.deliveryAddress}
                        onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                        className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500 transition-colors placeholder-gray-500 resize-none"
                        placeholder="Full venue address..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Event Details</label>
                      <textarea 
                        rows={3}
                        value={formData.eventDescription}
                        onChange={(e) => setFormData({...formData, eventDescription: e.target.value})}
                        className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500 transition-colors placeholder-gray-500 resize-none"
                        placeholder="Guest count, timings, specific requirements..."
                      />
                    </div>

                    {status.type === "error" && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                        {status.message}
                      </div>
                    )}

                    <div className="pt-2">
                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                        {loading ? "Submitting..." : "Submit Request"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
