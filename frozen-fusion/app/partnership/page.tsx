"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { MagneticButton } from "@/components/MagneticButton";

const partnerships = [
  {
    title: "Grab & Go",
    desc: "Compact setups for high footfall areas. Low investment, rapid ROI.",
    investment: "Starting ₹5L"
  },
  {
    title: "Dining Outlet",
    desc: "Premium dessert lounge experience for families and groups.",
    investment: "Starting ₹15L"
  },
  {
    title: "District Partner",
    desc: "Exclusive rights to distribute and operate within a district.",
    investment: "Custom"
  },
  {
    title: "Super Stockist",
    desc: "Manage the entire supply chain for an entire region or state.",
    investment: "Custom"
  },
  {
    title: "Marketing Partner",
    desc: "Drive brand awareness and manage B2B leads on commission.",
    investment: "Zero Investment"
  }
];

export default function PartnershipPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
    description: ""
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
      const res = await fetch("http://localhost:3001/api/partnership", {
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
    <main className="min-h-screen flex flex-col pt-32 relative">
      <Navbar />
      <div className="flex-1 container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col items-center justify-center mb-16 text-center">
          <h1 className="text-6xl md:text-8xl font-bungee text-transparent bg-clip-text bg-gradient-to-r from-electric-purple to-neon-pink mb-6">
            PARTNERSHIP
          </h1>
          <p className="text-xl text-white/70 max-w-2xl font-poppins">
            Join the fastest-growing premium dessert brand. Explore lucrative franchise and distribution opportunities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
          {partnerships.map((item, i) => (
            <GlassCard key={i} className="group flex flex-col justify-between h-[320px] !w-full !p-8">
              <div className="flex-1">
                <h3 className="text-2xl font-righteous text-white mb-4 group-hover:text-neon-pink transition-colors">
                  {item.title}
                </h3>
                <p className="text-white/70 font-poppins mb-4">
                  {item.desc}
                </p>
                <div className="text-neon-cyan font-bold font-poppins">
                  {item.investment}
                </div>
              </div>
              <div className="mt-auto self-end">
                <div onClick={() => openPopup(item.title)}>
                  <MagneticButton variant="outline" className="scale-75 origin-bottom-right">
                    Inquire Now
                  </MagneticButton>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
      <Footer />

      {/* Inquiry Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#0A0A0D] border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Close Button */}
            <button 
              onClick={closePopup}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            {status === "success" ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="text-2xl font-righteous text-white mb-4">Inquiry Received!</h3>
                <p className="text-white/70 font-poppins">
                  Our representative will contact you soon.
                </p>
                <button 
                  onClick={closePopup}
                  className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-poppins transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-righteous text-white mb-2">Inquire Now</h3>
                <p className="text-white/50 text-sm mb-6 font-poppins">
                  Interested in the <span className="text-neon-cyan font-bold">{selectedType}</span> partnership. Fill out the details below.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4 font-poppins">
                  <div>
                    <input 
                      type="text" 
                      required
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-electric-purple transition-colors"
                    />
                  </div>
                  <div>
                    <input 
                      type="tel" 
                      required
                      placeholder="Contact Number"
                      value={formData.contact}
                      onChange={(e) => setFormData({...formData, contact: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-electric-purple transition-colors"
                    />
                  </div>
                  <div>
                    <textarea 
                      required
                      placeholder="Your Full Address"
                      rows={2}
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-electric-purple transition-colors resize-none"
                    />
                  </div>
                  <div>
                    <textarea 
                      required
                      placeholder="Description (e.g., Investment Capacity, Proposed Location, Business Experience...)"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-electric-purple transition-colors resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={status === "submitting"}
                    className="w-full py-4 mt-4 bg-gradient-to-r from-electric-purple to-neon-pink text-white rounded-xl font-bold tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "submitting" ? "Submitting..." : "SUBMIT INQUIRY"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
