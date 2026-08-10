"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { MagneticButton } from "@/components/MagneticButton";

const partnerships = [
  {
    title: "Frozen Fusion Express",
    desc: "EV Cart Model",
    investment: "₹5L",
    image: "/partnership/cart-byk.jpeg",
    color: "from-cyan-600/80 to-blue-900/80"
  },
  {
    title: "Grab & Go",
    desc: "Compact setups for high footfall areas. Low investment, rapid ROI.",
    investment: "Starting ₹7L",
    image: "/partnership/grab-and-go.jpeg",
    color: "from-pink-600/80 to-purple-900/80"
  },
  {
    title: "Dining Outlet",
    desc: "Premium dessert lounge experience for families and groups.",
    investment: "Starting ₹15L",
    image: "/partnership/dining-outlet.jpeg",
    color: "from-amber-600/80 to-red-900/80"
  },
  {
    title: "District Partner",
    desc: "Exclusive rights to distribute and operate within a district.",
    investment: "Custom",
    image: "/partnership/district_partners.jpeg",
    color: "from-emerald-600/80 to-teal-900/80"
  },
  {
    title: "Super Stockist",
    desc: "Manage the entire supply chain for an entire region or state.",
    investment: "Custom",
    image: "/partnership/super-stockist.jpeg",
    color: "from-purple-600/80 to-indigo-900/80"
  },
  {
    title: "Marketing Partner",
    desc: "Drive brand awareness and manage B2B leads on commission.",
    investment: "Zero Investment",
    image: "/partnership/marketing-partners.jpeg",
    color: "from-blue-600/80 to-cyan-900/80"
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
      const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL;
      if (!adminUrl && process.env.NODE_ENV === "production") {
        throw new Error("NEXT_PUBLIC_ADMIN_URL is not set");
      }
      const url = adminUrl ? `${adminUrl}/api/partnership` : "http://localhost:3001/api/partnership";
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
    <main className="min-h-screen flex flex-col pt-24 md:pt-32 relative overflow-hidden">
      <Navbar />

      {/* Cinematic Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-electric-purple/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="flex-1 container mx-auto px-6 max-w-7xl relative z-10">

        {/* Responsive Header for all devices */}
        <div className="flex flex-col items-center justify-center mb-16 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bungee text-transparent bg-clip-text bg-gradient-to-r from-electric-purple to-neon-pink mb-4 md:mb-6 leading-tight">
            PARTNERSHIP
          </h1>
          <p className="text-base md:text-xl text-white/70 max-w-2xl font-poppins px-4">
            Join the fastest-growing premium dessert brand. Explore lucrative franchise and distribution opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
          {partnerships.map((item, i) => (
            <div key={i} className={`group relative flex flex-col h-full min-h-[420px] !w-full overflow-hidden rounded-3xl border border-white/10 hover:border-white/30 transition-all duration-500 shadow-xl`}>

              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                {/* Gradient Overlay for Readability */}
                <div className={`absolute inset-0 bg-gradient-to-t ${item.color} mix-blend-multiply opacity-80 group-hover:opacity-40 transition-opacity duration-500`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-90" />
              </div>

              <div className="relative z-10 flex flex-col flex-1 p-8">
                {/* Brand Identifier */}
                <div className="flex items-center gap-3 mb-auto">
                  <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md p-2 border border-white/20 flex items-center justify-center">
                    <img src="/logo.png" alt="FF" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-widest uppercase text-white/60 font-inter drop-shadow-md">Verified Partner</div>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-8">
                  <h3 className="text-3xl font-righteous text-white mb-3 drop-shadow-lg group-hover:-translate-y-1 transition-transform duration-300">
                    {item.title}
                  </h3>
                  <p className="text-white/80 font-poppins leading-relaxed mb-8 drop-shadow-md group-hover:-translate-y-1 transition-transform duration-300 delay-75">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-white/20 pt-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-1.5 font-inter drop-shadow-md">Investment required</span>
                      <div className="text-white font-bold font-poppins text-xl drop-shadow-lg">
                        {item.investment}
                      </div>
                    </div>

                    <button
                      onClick={() => openPopup(item.title)}
                      className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-300 bg-white/10 hover:bg-white border border-white/30 hover:border-white text-white hover:text-black backdrop-blur-md`}
                    >
                      Inquire Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>

            {status === "success" ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
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
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-electric-purple transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Contact Number"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-electric-purple transition-colors"
                    />
                  </div>
                  <div>
                    <textarea
                      required
                      placeholder="Your Full Address"
                      rows={2}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-electric-purple transition-colors resize-none"
                    />
                  </div>
                  <div>
                    <textarea
                      required
                      placeholder="Description (e.g., Investment Capacity, Proposed Location, Business Experience...)"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
