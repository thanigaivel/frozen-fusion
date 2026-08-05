import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";

export default function StoryPage() {
  return (
    <main className="min-h-screen flex flex-col pt-32">
      <Navbar />
      <div className="flex-1 container mx-auto px-6 max-w-7xl">
        <h1 className="text-6xl md:text-8xl font-bungee text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-electric-purple mb-12">
          OUR STORY
        </h1>
        
        <div className="relative border-l border-white/20 ml-6 md:ml-12 pl-12 space-y-24 py-12">
          {/* Timeline Nodes */}
          <div className="relative">
             <div className="absolute -left-[57px] top-4 w-6 h-6 rounded-full bg-neon-pink shadow-[0_0_20px_#FF2BC2]" />
             <GlassCard headline="2025: The Genesis" body="Founded by three visionary women, Frozen Fusion was born from a desire to bring true premium dessert experiences to Tuticorin." className="w-full md:w-3/4" />
          </div>

          <div className="relative">
             <div className="absolute -left-[57px] top-4 w-6 h-6 rounded-full bg-neon-cyan shadow-[0_0_20px_#3BE8FF]" />
             <GlassCard headline="Retail Launch" body="The first flagship lounge opens, introducing a futuristic, neon-lit environment that instantly captivates the city." className="w-full md:w-3/4" />
          </div>

          <div className="relative">
             <div className="absolute -left-[57px] top-4 w-6 h-6 rounded-full bg-neon-orange shadow-[0_0_20px_#FF8C42]" />
             <GlassCard headline="Expansion & Distribution" body="Scaling across districts with super stockists and grabbing the attention of dessert lovers nationwide." className="w-full md:w-3/4" />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
