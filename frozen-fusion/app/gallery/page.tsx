"use client";

import { useState, useEffect, useCallback } from "react";
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
  "rgba(255,43,194,0.45)",
  "rgba(59,232,255,0.45)",
  "rgba(255,179,71,0.45)",
  "rgba(124,77,255,0.45)",
  "rgba(74,222,128,0.45)",
];

/* ─── Slide Animation Variants (Parallax Directional Scroll) ─── */
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 1.08,
    filter: "blur(6px)",
  }),
  center: {
    zIndex: 1,
    x: "0%",
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.92,
    filter: "blur(6px)",
  }),
};

/* ─── Outlet Showcase Card with Parallax Slide Transition & Neon Visuals ─── */
function OutletShowcaseCard({
  group,
  glowColor,
  onOpenZoom,
}: {
  group: OutletGroup;
  glowColor: string;
  onOpenZoom: (items: GalleryItem[], startIndex: number) => void;
}) {
  const [[currentIndex, direction], setPage] = useState<[number, number]>([0, 1]);
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrcMap, setImgSrcMap] = useState<Record<string, string>>({});

  const total = group.items.length;
  const currentItem = group.items[currentIndex] || group.items[0];

  const paginate = useCallback(
    (newDirection: number) => {
      setPage(([prevIndex]) => {
        const nextIndex = (prevIndex + newDirection + total) % total;
        return [nextIndex, newDirection];
      });
    },
    [total]
  );

  // Auto-play slideshow every 3.8 seconds unless hovered
  useEffect(() => {
    if (isHovered || total <= 1) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 3800);
    return () => clearInterval(interval);
  }, [isHovered, total, paginate]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    paginate(1);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    paginate(-1);
  };

  const currentImgUrl = imgSrcMap[currentItem._id] || currentItem.imageUrl || "/logo.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-3xl overflow-hidden flex flex-col h-full border border-white/10 hover:border-pink-500/40 transition-all duration-700 shadow-2xl"
      style={{
        background: "rgba(20,20,28,0.6)",
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Neon glowing line along top border on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30"
        style={{
          background: "linear-gradient(90deg, transparent, #FF2BC2, #3BE8FF, transparent)",
          boxShadow: "0 0 15px #FF2BC2, 0 0 30px #3BE8FF",
        }}
      />

      {/* Radial neon glow background */}
      <div
        className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none z-0"
        style={{ background: `radial-gradient(circle at 50% 20%, ${glowColor} 0%, transparent 70%)` }}
      />

      {/* Slideshow Image Area */}
      <div
        className="relative h-72 sm:h-80 w-full overflow-hidden shrink-0 cursor-pointer"
        onClick={() => onOpenZoom(group.items, currentIndex)}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentItem._id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 260, damping: 28 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.5 },
              filter: { duration: 0.3 },
            }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={currentImgUrl}
              alt={currentItem.title || group.outletName}
              fill
              unoptimized
              onError={() =>
                setImgSrcMap((prev) => ({ ...prev, [currentItem._id]: "/logo.png" }))
              }
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D] via-[#0A0A0D]/20 to-transparent pointer-events-none z-10" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
          <span
            className="px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider font-poppins bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_8px_#3BE8FF]" />
            {group.outletName}
          </span>

          <span
            className="px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider font-poppins text-pink-300 bg-pink-500/20 border border-pink-500/40 backdrop-blur-md shadow-[0_0_15px_rgba(255,43,194,0.3)]"
          >
            {total} {total === 1 ? "Photo" : "Photos"}
          </span>
        </div>

        {/* Neon Navigation Arrows */}
        {total > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 border border-neon-cyan/40 text-neon-cyan hover:text-white hover:bg-neon-cyan/30 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-[0_0_20px_rgba(59,232,255,0.4)] text-lg font-bold"
              title="Previous photo"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 border border-neon-pink/40 text-neon-pink hover:text-white hover:bg-neon-pink/30 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-[0_0_20px_rgba(255,43,194,0.4)] text-lg font-bold"
              title="Next photo"
            >
              ›
            </button>
          </>
        )}

        {/* Slide Dots Indicator */}
        {total > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 shadow-lg">
            {group.items.map((item, idx) => (
              <button
                key={item._id}
                onClick={(e) => {
                  e.stopPropagation();
                  setPage([idx, idx > currentIndex ? 1 : -1]);
                }}
                className={`h-2 rounded-full transition-all duration-400 ${
                  currentIndex === idx
                    ? "w-6 bg-gradient-to-r from-neon-pink to-neon-cyan shadow-[0_0_10px_#FF2BC2]"
                    : "w-2 bg-white/30 hover:bg-white/70"
                }`}
                title={`Go to photo ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Filmstrip Mini Thumbnail Strip */}
      {total > 1 && (
        <div className="px-6 pt-3 flex gap-2 overflow-x-auto scrollbar-hide z-10">
          {group.items.map((item, idx) => {
            const thumbUrl = imgSrcMap[item._id] || item.imageUrl || "/logo.png";
            const isActive = idx === currentIndex;
            return (
              <button
                key={item._id}
                onClick={() => setPage([idx, idx > currentIndex ? 1 : -1])}
                className={`relative w-12 h-10 rounded-lg overflow-hidden border transition-all shrink-0 ${
                  isActive
                    ? "border-neon-pink scale-105 shadow-[0_0_12px_rgba(255,43,194,0.6)]"
                    : "border-white/10 opacity-50 hover:opacity-100 hover:border-white/30"
                }`}
              >
                <Image src={thumbUrl} alt="" fill unoptimized className="object-cover" sizes="48px" />
              </button>
            );
          })}
        </div>
      )}

      {/* Card Info Section */}
      <div className="p-6 md:p-7 relative z-10 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-xl md:text-2xl font-righteous text-white mb-2 group-hover:text-neon-cyan transition-colors">
            {currentItem.title || group.outletName}
          </h3>
          <p className="text-sm text-white/60 font-poppins leading-relaxed line-clamp-3 mb-4">
            {currentItem.description || `Explore our gallery showcase for ${group.outletName}.`}
          </p>
        </div>

        {/* Card Footer with Neon Button */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-poppins text-white/40">
          <span>Slide {currentIndex + 1} of {total}</span>
          <button
            onClick={() => onOpenZoom(group.items, currentIndex)}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider font-poppins text-white transition-all duration-300 shadow-[0_0_15px_rgba(255,43,194,0.3)] hover:shadow-[0_0_25px_rgba(255,43,194,0.6)] border border-neon-pink/40 hover:border-neon-pink group-hover:translate-x-0.5"
            style={{
              background: "linear-gradient(135deg, rgba(255,43,194,0.2), rgba(124,77,255,0.2))",
            }}
          >
            <span>Expand View</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-neon-pink">
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
          style={{ background: "radial-gradient(circle, rgba(255,43,194,0.15) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[550px] h-[550px] rounded-full blur-[140px] animate-orb-2"
          style={{ background: "radial-gradient(circle, rgba(59,232,255,0.12) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-10 left-1/3 w-[500px] h-[500px] rounded-full blur-[160px] animate-orb-3"
          style={{ background: "radial-gradient(circle, rgba(124,77,255,0.1) 0%, transparent 70%)" }}
        />
      </div>

      <div className="flex-1 container mx-auto px-6 max-w-7xl pt-36 pb-24 relative z-10">
        {/* ── Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center mb-14 text-center"
        >
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 text-xs font-bold uppercase tracking-[0.2em] font-poppins shadow-[0_0_20px_rgba(255,43,194,0.3)]"
            style={{ background: "rgba(255,43,194,0.12)", border: "1px solid rgba(255,43,194,0.35)", color: "#FF2BC2" }}
          >
            ✨ Visual Showcase
          </div>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bungee leading-none tracking-tight mb-6"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #FF2BC2 45%, #3BE8FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 45px rgba(255,43,194,0.4))",
            }}
          >
            OUTLET GALLERY
          </h1>
          <p className="text-base md:text-lg text-white/70 max-w-2xl font-poppins leading-relaxed">
            Immerse yourself in our premium lounges, EV cart units, and live event setups through dynamic 3D scroll transitions.
          </p>
        </motion.div>

        {/* ── Neon Category Filter Bar ── */}
        {!loading && groups.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center flex-wrap gap-3 mb-16"
          >
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider font-poppins transition-all duration-300 ${
                activeFilter === "all"
                  ? "bg-gradient-to-r from-neon-pink via-electric-purple to-neon-cyan text-white shadow-[0_0_25px_rgba(255,43,194,0.5)] border-none scale-105"
                  : "bg-white/[0.04] border border-white/15 text-white/70 hover:text-white hover:bg-white/[0.1] hover:border-neon-pink/40"
              }`}
            >
              All Outlets & Events ({items.length})
            </button>

            {groups.map((g) => (
              <button
                key={g.outletSlug}
                onClick={() => setActiveFilter(g.outletSlug)}
                className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider font-poppins transition-all duration-300 ${
                  activeFilter === g.outletSlug
                    ? "bg-gradient-to-r from-neon-pink via-electric-purple to-neon-cyan text-white shadow-[0_0_25px_rgba(255,43,194,0.5)] border-none scale-105"
                    : "bg-white/[0.04] border border-white/15 text-white/70 hover:text-white hover:bg-white/[0.1] hover:border-neon-pink/40"
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
            <div className="w-10 h-10 border-3 border-neon-pink border-t-transparent rounded-full animate-spin shadow-[0_0_20px_#FF2BC2]" />
            <p className="text-white/50 font-poppins text-sm">Loading gallery showcase…</p>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-24 text-white/40 font-poppins border border-dashed border-white/10 rounded-3xl">
            No outlet galleries found for this filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
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

      {/* ── Neon Lightbox Fullscreen Zoom Modal ── */}
      <AnimatePresence>
        {zoomItem && zoomGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/92 backdrop-blur-2xl"
            onClick={handleCloseZoom}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 25 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-5xl bg-[#0A0A0D] border border-neon-pink/30 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(255,43,194,0.3)] flex flex-col md:flex-row max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button with Neon Glow */}
              <button
                onClick={handleCloseZoom}
                className="absolute top-4 right-4 z-30 w-11 h-11 rounded-full bg-black/70 border border-neon-pink/50 text-neon-pink hover:text-white hover:bg-neon-pink/30 flex items-center justify-center transition-all shadow-[0_0_20px_rgba(255,43,194,0.4)]"
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-13 h-13 rounded-full bg-black/70 border border-neon-cyan/50 text-neon-cyan hover:text-white hover:bg-neon-cyan/30 flex items-center justify-center transition-all hover:scale-110 shadow-[0_0_25px_rgba(59,232,255,0.5)] text-xl font-bold p-3"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-13 h-13 rounded-full bg-black/70 border border-neon-pink/50 text-neon-pink hover:text-white hover:bg-neon-pink/30 flex items-center justify-center transition-all hover:scale-110 shadow-[0_0_25px_rgba(255,43,194,0.5)] text-xl font-bold p-3"
                  title="Next (Right Arrow)"
                >
                  ›
                </button>
              )}

              {/* Large Zoomed Image Display */}
              <div className="relative flex-1 bg-black min-h-[320px] md:min-h-[520px] flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={zoomItem._id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full flex items-center justify-center"
                  >
                    <Image
                      src={modalImgSrc || "/logo.png"}
                      alt={zoomItem.title || zoomItem.outletName}
                      fill
                      unoptimized
                      onError={() => setModalImgSrc("/logo.png")}
                      className="object-contain p-2"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Info Sidebar */}
              <div className="w-full md:w-96 p-8 flex flex-col justify-between bg-[#0A0A0D] border-t md:border-t-0 md:border-l border-white/10 shrink-0">
                <div>
                  <div className="inline-block px-3.5 py-1.5 rounded-full text-[10px] font-bold font-poppins uppercase tracking-widest bg-pink-500/20 border border-pink-500/40 text-pink-300 shadow-[0_0_15px_rgba(255,43,194,0.3)] mb-4">
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
                  <span className="text-neon-cyan font-bold shadow-sm">Use ‹ › or Arrow keys</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
