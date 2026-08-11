"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface GalleryItem {
  _id: string;
  title: string;
  description?: string;
  outletName: string;
  outletSlug: string;
  imageUrl: string;
  glowColor?: string;
}

interface OutletGroup {
  outletName: string;
  outletSlug: string;
  items: GalleryItem[];
}

/* ─── Default Showcase Fallbacks if Admin API is empty ─── */
const DEFAULT_ITEMS: GalleryItem[] = [
  {
    _id: "def-1",
    title: "Tuticorin Neon Lounge Interior",
    description: "Our flagship lounge features futuristic neon aesthetics, cozy plush seating, and artisan dessert counter.",
    outletName: "Tuticorin Flagship Lounge",
    outletSlug: "tuticorin-flagship-lounge",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80",
    glowColor: "rgba(255,43,194,0.4)",
  },
  {
    _id: "def-2",
    title: "Signature Stick Kulfi Display",
    description: "Authentic Malai & Kesar Pista kulfi popsicles crafted with traditional slow-churned rabri.",
    outletName: "Tuticorin Flagship Lounge",
    outletSlug: "tuticorin-flagship-lounge",
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1000&auto=format&fit=crop&q=80",
    glowColor: "rgba(255,43,194,0.4)",
  },
  {
    _id: "def-3",
    title: "Belgian Dark Chocolate Gelato",
    description: "Decadent 70% dark cocoa gelato crowned with roasted hazelnut sprinkles.",
    outletName: "Tuticorin Flagship Lounge",
    outletSlug: "tuticorin-flagship-lounge",
    imageUrl: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=1000&auto=format&fit=crop&q=80",
    glowColor: "rgba(255,43,194,0.4)",
  },
  {
    _id: "def-4",
    title: "Chennai High-Street Parlour",
    description: "Step into our premium takeaway and dine-in parlor in prime Chennai catchment.",
    outletName: "Chennai Prime Lounge",
    outletSlug: "chennai-prime-lounge",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80",
    glowColor: "rgba(59,232,255,0.4)",
  },
  {
    _id: "def-5",
    title: "Strawberry Bliss Sundae",
    description: "Fresh strawberries layered with soft vanilla scoop and strawberry syrup.",
    outletName: "Chennai Prime Lounge",
    outletSlug: "chennai-prime-lounge",
    imageUrl: "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=1000&auto=format&fit=crop&q=80",
    glowColor: "rgba(59,232,255,0.4)",
  },
  {
    _id: "def-6",
    title: "Frozen Fusion Express EV Cart",
    description: "Our mobile zero-emission EV dessert cart serving high-footfall event locations.",
    outletName: "Express EV Cart Outlets",
    outletSlug: "express-ev-cart-outlets",
    imageUrl: "https://images.unsplash.com/photo-1567206563114-c179706b9b01?w=1000&auto=format&fit=crop&q=80",
    glowColor: "rgba(255,179,71,0.4)",
  },
  {
    _id: "def-7",
    title: "On-the-Go Fruit Shaped Ice Cream",
    description: "Fun fruit-shaped frozen popsicles loved by kids and adults alike.",
    outletName: "Express EV Cart Outlets",
    outletSlug: "express-ev-cart-outlets",
    imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=1000&auto=format&fit=crop&q=80",
    glowColor: "rgba(255,179,71,0.4)",
  },
  {
    _id: "def-8",
    title: "Grand Wedding Dessert Catering",
    description: "Live live-counter setup for luxury wedding receptions and corporate galas.",
    outletName: "Grand Wedding & Corporate Events",
    outletSlug: "grand-wedding-corporate-events",
    imageUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1000&auto=format&fit=crop&q=80",
    glowColor: "rgba(124,77,255,0.4)",
  },
];

const GLOW_PALETTE = [
  "rgba(255,43,194,0.35)",
  "rgba(59,232,255,0.35)",
  "rgba(255,179,71,0.35)",
  "rgba(124,77,255,0.35)",
  "rgba(74,222,128,0.35)",
];

/* ─── Outlet Showcase Card with Auto Slideshow ─── */
function OutletShowcaseCard({
  group,
  glowColor,
  onOpenZoom,
}: {
  group: OutletGroup;
  glowColor: string;
  onOpenZoom: (items: GalleryItem[], startIndex: number) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrcMap, setImgSrcMap] = useState<Record<string, string>>({});

  const total = group.items.length;
  const currentItem = group.items[currentIndex] || group.items[0];

  // Auto-play slideshow every 3.5 seconds unless hovered
  useEffect(() => {
    if (isHovered || total <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 3500);
    return () => clearInterval(interval);
  }, [isHovered, total]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const currentImgUrl = imgSrcMap[currentItem._id] || currentItem.imageUrl || "/logo.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-3xl overflow-hidden flex flex-col h-full border border-white/10 hover:border-white/25 transition-all duration-500 shadow-2xl"
      style={{
        background: "rgba(255,255,255,0.025)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Glow highlight */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"
        style={{ background: `radial-gradient(circle at top right, ${glowColor} 0%, transparent 65%)` }}
      />

      {/* Slideshow Image Area */}
      <div
        className="relative h-72 sm:h-80 w-full overflow-hidden shrink-0 cursor-pointer"
        onClick={() => onOpenZoom(group.items, currentIndex)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem._id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={currentImgUrl}
              alt={currentItem.title || group.outletName}
              fill
              unoptimized
              onError={() =>
                setImgSrcMap((prev) => ({ ...prev, [currentItem._id]: "/logo.png" }))
              }
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D] via-[#0A0A0D]/30 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider font-poppins bg-black/60 backdrop-blur-md border border-white/15 text-white/90 shadow-md">
            📍 {group.outletName}
          </span>

          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-poppins bg-pink-500/20 border border-pink-500/30 text-pink-300 backdrop-blur-md shadow-md">
            {total} {total === 1 ? "Photo" : "Photos"}
          </span>
        </div>

        {/* Manual Navigation Arrows (Visible when hovered if > 1 item) */}
        {total > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 border border-white/20 text-white/80 hover:text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              title="Previous photo"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 border border-white/20 text-white/80 hover:text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              title="Next photo"
            >
              ›
            </button>
          </>
        )}

        {/* Slide Dots Indicator */}
        {total > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            {group.items.map((item, idx) => (
              <button
                key={item._id}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? "w-5 bg-pink-400" : "w-1.5 bg-white/30 hover:bg-white/60"
                }`}
                title={`Go to photo ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Info Section */}
      <div className="p-6 md:p-7 relative z-10 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-xl md:text-2xl font-righteous text-white mb-2 group-hover:text-pink-300 transition-colors">
            {currentItem.title || group.outletName}
          </h3>
          <p className="text-sm text-white/60 font-poppins leading-relaxed line-clamp-3 mb-4">
            {currentItem.description || `Explore our gallery showcase for ${group.outletName}.`}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-poppins text-white/40">
          <span>Photo {currentIndex + 1} of {total}</span>
          <button
            onClick={() => onOpenZoom(group.items, currentIndex)}
            className="flex items-center gap-1 font-semibold text-pink-400 hover:text-pink-300 transition-colors group-hover:translate-x-0.5 transition-transform"
          >
            <span>Expand Slideshow</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main Gallery Page
   ═══════════════════════════════════════════════════════════════════ */
export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  // Zoom Modal State
  const [zoomGroup, setZoomGroup] = useState<GalleryItem[] | null>(null);
  const [zoomIndex, setZoomIndex] = useState<number>(0);
  const [modalImgSrc, setModalImgSrc] = useState<string>("");

  useEffect(() => {
    async function fetchGallery() {
      try {
        const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL;
        const url = adminUrl ? `${adminUrl}/api/gallery` : "http://localhost:3001/api/gallery";
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.images && data.images.length > 0) {
            setItems(data.images);
          } else {
            setItems(DEFAULT_ITEMS);
          }
        } else {
          setItems(DEFAULT_ITEMS);
        }
      } catch (e) {
        console.error("Failed to fetch gallery:", e);
        setItems(DEFAULT_ITEMS);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  // Group items by outletName
  const groups: OutletGroup[] = [];
  items.forEach((item) => {
    const outletName = item.outletName || "Tuticorin Flagship Lounge";
    const outletSlug = item.outletSlug || outletName.toLowerCase().replace(/\s+/g, "-");
    let group = groups.find((g) => g.outletSlug === outletSlug);
    if (!group) {
      group = { outletName, outletSlug, items: [] };
      groups.push(group);
    }
    group.items.push(item);
  });

  // Filter groups
  const filteredGroups = activeFilter === "all"
    ? groups
    : groups.filter((g) => g.outletSlug === activeFilter);

  // Lightbox handlers
  const handleOpenZoom = (groupItems: GalleryItem[], index: number) => {
    setZoomGroup(groupItems);
    setZoomIndex(index);
    setModalImgSrc(groupItems[index]?.imageUrl || "/logo.png");
  };

  const handleCloseZoom = () => {
    setZoomGroup(null);
  };

  const handleNextZoom = useCallback(() => {
    if (!zoomGroup || zoomGroup.length <= 1) return;
    const next = (zoomIndex + 1) % zoomGroup.length;
    setZoomIndex(next);
    setModalImgSrc(zoomGroup[next]?.imageUrl || "/logo.png");
  }, [zoomGroup, zoomIndex]);

  const handlePrevZoom = useCallback(() => {
    if (!zoomGroup || zoomGroup.length <= 1) return;
    const prev = (zoomIndex - 1 + zoomGroup.length) % zoomGroup.length;
    setZoomIndex(prev);
    setModalImgSrc(zoomGroup[prev]?.imageUrl || "/logo.png");
  }, [zoomGroup, zoomIndex]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!zoomGroup) return;
      if (e.key === "ArrowRight") handleNextZoom();
      if (e.key === "ArrowLeft") handlePrevZoom();
      if (e.key === "Escape") handleCloseZoom();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomGroup, handleNextZoom, handlePrevZoom]);

  const zoomItem = zoomGroup ? zoomGroup[zoomIndex] : null;

  return (
    <main className="min-h-screen flex flex-col relative bg-[#0A0A0D] text-white overflow-hidden font-poppins">
      <Navbar />

      {/* ── Background Glow Orbs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div
          className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] animate-orb-1"
          style={{ background: "radial-gradient(circle, rgba(255,43,194,0.12) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px] animate-orb-2"
          style={{ background: "radial-gradient(circle, rgba(59,232,255,0.08) 0%, transparent 70%)" }}
        />
      </div>

      <div className="flex-1 container mx-auto px-6 max-w-7xl pt-36 pb-24 relative z-10">
        {/* ── Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center mb-12 text-center"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-bold uppercase tracking-[0.2em] font-poppins"
            style={{ background: "rgba(255,43,194,0.1)", border: "1px solid rgba(255,43,194,0.25)", color: "#FF2BC2" }}
          >
            📸 Visual Showcase
          </div>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bungee leading-none tracking-tight mb-6"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #FF2BC2 50%, #3BE8FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 40px rgba(255,43,194,0.3))",
            }}
          >
            OUTLET GALLERY
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-2xl font-poppins leading-relaxed">
            Experience our outlets, lounges, EV carts, and special dessert catering events through our interactive slideshow showcase.
          </p>
        </motion.div>

        {/* ── Outlet Category Filter Tabs ── */}
        {!loading && groups.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center flex-wrap gap-2.5 mb-14"
          >
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider font-poppins transition-all duration-300 ${
                activeFilter === "all"
                  ? "bg-gradient-to-r from-neon-pink to-electric-purple text-white shadow-[0_0_20px_rgba(255,43,194,0.4)]"
                  : "bg-white/[0.04] border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              All Outlets & Events ({items.length})
            </button>

            {groups.map((g) => (
              <button
                key={g.outletSlug}
                onClick={() => setActiveFilter(g.outletSlug)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider font-poppins transition-all duration-300 ${
                  activeFilter === g.outletSlug
                    ? "bg-gradient-to-r from-neon-pink to-electric-purple text-white shadow-[0_0_20px_rgba(255,43,194,0.4)]"
                    : "bg-white/[0.04] border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.08]"
                }`}
              >
                📍 {g.outletName} ({g.items.length})
              </button>
            ))}
          </motion.div>
        )}

        {/* ── Main Showcase Grid ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-8 h-8 border-3 border-neon-pink border-t-transparent rounded-full animate-spin" />
            <p className="text-white/40 font-poppins text-sm">Loading gallery showcase…</p>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-24 text-white/40 font-poppins border border-dashed border-white/10 rounded-3xl">
            No outlet galleries found for this filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGroups.map((group, idx) => (
              <OutletShowcaseCard
                key={group.outletSlug}
                group={group}
                glowColor={GLOW_PALETTE[idx % GLOW_PALETTE.length]}
                onOpenZoom={handleOpenZoom}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* ── Lightbox Fullscreen Zoom Modal ── */}
      <AnimatePresence>
        {zoomItem && zoomGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
            onClick={handleCloseZoom}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-5xl bg-[#0A0A0D] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
              style={{ boxShadow: "0 0 80px rgba(255,43,194,0.25)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseZoom}
                className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors shadow-lg"
              >
                ✕
              </button>

              {/* Previous Arrow */}
              {zoomGroup.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevZoom();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/60 border border-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg text-lg font-bold"
                  title="Previous (Left Arrow)"
                >
                  ‹
                </button>
              )}

              {/* Next Arrow */}
              {zoomGroup.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextZoom();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/60 border border-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg text-lg font-bold"
                  title="Next (Right Arrow)"
                >
                  ›
                </button>
              )}

              {/* Large Zoomed Image Display */}
              <div className="relative flex-1 bg-black min-h-[300px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
                <Image
                  src={modalImgSrc || "/logo.png"}
                  alt={zoomItem.title || zoomItem.outletName}
                  fill
                  unoptimized
                  onError={() => setModalImgSrc("/logo.png")}
                  className="object-contain p-2"
                />
              </div>

              {/* Info Sidebar */}
              <div className="w-full md:w-96 p-8 flex flex-col justify-between bg-[#0A0A0D] border-t md:border-t-0 md:border-l border-white/10 shrink-0">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold font-poppins uppercase tracking-widest bg-pink-500/20 border border-pink-500/30 text-pink-300 mb-4">
                    📍 {zoomItem.outletName}
                  </div>

                  <h2 className="text-2xl font-righteous text-white mb-4 leading-tight">
                    {zoomItem.title || zoomItem.outletName}
                  </h2>

                  <p className="text-white/60 font-poppins text-sm leading-relaxed mb-6">
                    {zoomItem.description || `Captured moment at ${zoomItem.outletName}.`}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-poppins text-white/40">
                  <span>Photo {zoomIndex + 1} of {zoomGroup.length}</span>
                  <span className="text-pink-400 font-semibold">Use ‹ › or Arrow keys</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
