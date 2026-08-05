"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { MagneticButton } from "@/components/MagneticButton";

const flavours = [
  "Belgian Dark Chocolate", "Madagascar Vanilla", "Almond Praline", 
  "Strawberry Cheesecake", "Roasted Hazelnut", "Alphonso Mango",
  "Tender Coconut", "Pistachio Crunch", "Blueberry Blast", "Caramel Macchiato"
];

export default function BulkIceCreamPage() {
  const [activeFlavour, setActiveFlavour] = useState(flavours[0]);

  return (
    <main className="min-h-screen flex flex-col pt-32">
      <Navbar />
      <div className="flex-1 container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col items-center justify-center mb-16 text-center">
          <h1 className="text-6xl md:text-8xl font-bungee text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-electric-purple mb-6 uppercase">
            Bulk Ice Cream
          </h1>
          <p className="text-xl text-white/70 max-w-2xl font-poppins">
            Premium scoops for your business. Available in 22 signature flavours.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 pb-24">
          <GlassCard className="lg:w-1/3 !w-full !self-start flex flex-col h-[500px] overflow-hidden !p-0">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h3 className="text-2xl font-righteous text-neon-cyan">22 Flavours</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {flavours.map((f, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveFlavour(f)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-poppins
                    ${activeFlavour === f ? 'bg-neon-pink/20 border border-neon-pink/50 text-white' : 'hover:bg-white/5 text-white/70'}`}
                >
                  {f}
                </button>
              ))}
              <div className="text-center p-4 text-white/40 text-sm italic">...and 12 more</div>
            </div>
          </GlassCard>

          <div className="lg:w-2/3 flex flex-col items-center justify-center min-h-[500px] relative">
            {/* Ambient glow behind the active container */}
            <div className="absolute w-64 h-64 bg-neon-cyan/20 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-64 h-64 rounded-full border-4 border-white/10 bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(59,232,255,0.1)] backdrop-blur-md relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/5 group-hover:scale-110 transition-transform duration-700" />
                <span className="text-white/20 font-righteous text-2xl z-10 group-hover:text-white/50 transition-colors">4L TUB</span>
              </div>
              <h2 className="text-4xl font-righteous text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500" key={activeFlavour}>
                {activeFlavour}
              </h2>
              <p className="text-white/60 max-w-md mb-8">Premium quality, dense and creamy texture perfectly crafted for scooping.</p>
              <MagneticButton variant="primary">Order Bulk Supply</MagneticButton>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
