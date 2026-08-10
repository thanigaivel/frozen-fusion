"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface GalleryImage {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  glowColor?: string;
}

/* ─── Default Showcase Fallbacks if Admin API is empty ─── */
const DEFAULT_GALLERY: GalleryImage[] = [
  {
    _id: "def-1",
    title: "Signature Stick Kulfi",
    description: "Authentic Malai & Kesar Pista kulfi popsicles crafted with traditional slow-churned rabri.",
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1000&auto=format&fit=crop&q=80",
    glowColor: "rgba(255,107,214,0.4)",
  },
  {
    _id: "def-2",
    title: "Belgian Dark Chocolate Scoop",
    description: "Decadent 70% dark cocoa gelato crowned with roasted hazelnut sprinkles.",
    imageUrl: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=1000&auto=format&fit=crop&q=80",
    glowColor: "rgba(167,139,250,0.4)",
  },
  {
    _id: "def-3",
    title: "Alphonso Mango Fusion Lounge",
    description: "Pure Ratnagiri mango pulp swirled into creamy vanilla ice cream scoops.",
    imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=1000&auto=format&fit=crop&q=80",
    glowColor: "rgba(252,211,77,0.4)",
  },
  {
    _id: "def-4",
    title: "Fresh Strawberry Bliss Popsicle",
    description: "Real handpicked Mahabaleshwar strawberries frozen into vibrant natural fruit pops.",
    imageUrl: "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=1000&auto=format&fit=crop&q=80",
    glowColor: "rgba(244,114,182,0.4)",
  },
  {
    _id: "def-5",
    title: "Tuticorin Dessert Parlour Experience",
    description: "Step into our flagship neon lounge designed for ultimate dessert lovers.",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80",
    glowColor: "rgba(96,165,250,0.4)",
  },
  {
    _id: "def-6",
    title: "Royal Sundae Extravaganza",
    description: "Triple scoop mountain topped with hot fudge, crushed waffle cones, and maraschino cherries.",
    imageUrl: "https://images.unsplash.com/photo-1567206563114-c179706b9b01?w=1000&auto=format&fit=crop&q=80",
    glowColor: "rgba(52,211,153,0.4)",
  },
];

const GLOW_COLORS = [
  "rgba(255,107,214,0.4)",
  "rgba(167,139,250,0.4)",
  "rgba(252,211,77,0.4)",
  "rgba(96,165,250,0.4)",
  "rgba(52,211,153,0.4)",
  "rgba(244,114,182,0.4)"
];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL;
        if (!adminUrl && process.env.NODE_ENV === "production") {
          console.warn("NEXT_PUBLIC_ADMIN_URL is not set. Using fallback gallery data.");
          setImages(DEFAULT_GALLERY);
          setLoading(false);
          return;
        }
        const url = adminUrl ? `${adminUrl}/api/gallery` : "http://localhost:3001/api/gallery";
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.images && data.images.length > 0) {
            const formatted = data.images.map((img: GalleryImage, idx: number) => ({
              ...img,
              imageUrl: img.imageUrl.startsWith("/") ? `http://localhost:3000${img.imageUrl}` : img.imageUrl,
              glowColor: GLOW_COLORS[idx % GLOW_COLORS.length],
            }));
            setImages(formatted);
          } else {
            setImages(DEFAULT_GALLERY);
          }
        } else {
          setImages(DEFAULT_GALLERY);
        }
      } catch (e) {
        console.error("Failed to fetch gallery images:", e);
        setImages(DEFAULT_GALLERY);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);

  const handleNext = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev! + 1) % images.length);
    }
  }, [selectedIndex, images.length]);

  const handlePrev = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev! - 1 + images.length) % images.length);
    }
  }, [selectedIndex, images.length]);

  // Keyboard navigation for zoom modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev]);

  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

  return (
    <main className="min-h-screen flex flex-col relative bg-gray-950 text-white overflow-hidden">
      {/* ── Background Orbs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div 
          className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px]"
          style={{ background: "radial-gradient(circle, rgba(255,107,214,0.1) 0%, transparent 70%)" }} 
        />
        <div 
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[130px]"
          style={{ background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)" }} 
        />
      </div>

      <Navbar />

      <div className="flex-1 container mx-auto px-6 max-w-7xl pt-36 pb-24 relative z-10">
        {/* ── Header ── */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold uppercase tracking-widest font-inter" style={{ background: "rgba(255,107,214,0.1)", border: "1px solid rgba(255,107,214,0.25)", color: "#FF6BD6" }}>
            📸 Visual Showcase
          </div>
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bungee leading-none tracking-tight mb-6"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #FF6BD6 50%, #60A5FA 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 40px rgba(255,107,214,0.3))",
            }}
          >
            OUR GALLERY
          </h1>
          <p className="text-lg text-white/60 max-w-2xl font-inter leading-relaxed">
            A visual feast of our signature artisan desserts, popsicles, and luxury lounge moments.
          </p>
        </motion.div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-8 h-8 border-3 border-pink-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-white/40 font-inter text-sm">Loading gallery showcase…</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((img, idx) => {
              const glow = img.glowColor || GLOW_COLORS[idx % GLOW_COLORS.length];
              return (
                <motion.div
                  key={img._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative rounded-3xl overflow-hidden cursor-pointer flex flex-col h-full"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
                    backdropFilter: "blur(12px)",
                  }}
                  onClick={() => setSelectedIndex(idx)}
                >
                  {/* Glowing Hover Background */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
                    style={{ background: `radial-gradient(circle at center, ${glow} 0%, transparent 75%)` }}
                  />

                  {/* Image Container */}
                  <div className="relative h-64 w-full overflow-hidden shrink-0">
                    <Image
                      src={img.imageUrl}
                      alt={img.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
                    
                    {/* Zoom Icon Badge */}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 border border-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 shadow-lg">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </div>
                  </div>

                  {/* Card Content (Title & Description) */}
                  <div className="p-6 relative z-10 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-xl font-righteous text-white mb-2 transition-colors duration-300 group-hover:text-pink-300">
                        {img.title}
                      </h3>
                      {img.description && (
                        <p className="text-white/70 font-inter text-sm leading-relaxed line-clamp-3">
                          {img.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-inter text-white/40 group-hover:text-white/70 transition-colors">
                      <span>Click to expand</span>
                      <span className="font-semibold text-pink-400 group-hover:translate-x-1 transition-transform">
                        Zoom →
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />

      {/* ── Zoom Large Gallery Image Modal ── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-5xl bg-gray-900/95 border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
              style={{ boxShadow: "0 0 80px rgba(255,107,214,0.25)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors shadow-lg"
              >
                ✕
              </button>

              {/* Previous Arrow */}
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/60 border border-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                title="Previous Image (Left Arrow)"
              >
                ←
              </button>

              {/* Next Arrow */}
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/60 border border-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                title="Next Image (Right Arrow)"
              >
                →
              </button>

              {/* Large Zoomed Image Display */}
              <div className="relative flex-1 bg-black min-h-[300px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
                <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  fill
                  unoptimized
                  className="object-contain p-2"
                />
              </div>

              {/* Image Info Panel */}
              <div className="w-full md:w-96 p-8 flex flex-col justify-between bg-gray-900 border-t md:border-t-0 md:border-l border-white/10 shrink-0">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold font-inter uppercase tracking-widest bg-pink-500/20 border border-pink-500/30 text-pink-300 mb-4">
                    Gallery Feature
                  </div>
                  <h2 className="text-3xl font-righteous text-white mb-4 leading-tight">
                    {selectedImage.title}
                  </h2>
                  {selectedImage.description ? (
                    <p className="text-white/70 font-inter text-sm leading-relaxed mb-6">
                      {selectedImage.description}
                    </p>
                  ) : (
                    <p className="text-white/40 font-inter text-sm italic mb-6">
                      No additional description provided for this item.
                    </p>
                  )}
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-inter text-white/40">
                  <span>Item {selectedIndex! + 1} of {images.length}</span>
                  <span className="text-pink-400 font-semibold">Use ← → to navigate</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
