"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CATEGORIES, ALL_PRODUCTS, type Product, type Category } from "@/data/products";

/* ─── icons ──────────────────────────────────────────────────── */
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const ChevronLeft = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);
const ChevronRight = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const XIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

/* ─── Star Rating ─────────────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((s) => (
        <StarIcon key={s} filled={s <= Math.round(rating)} />
      ))}
      <span className="ml-1 text-white/40 text-[10px] font-inter">{rating.toFixed(1)}</span>
    </span>
  );
}

/* ─── Badge ───────────────────────────────────────────────────── */
const BADGE_STYLES: Record<string, string> = {
  "Best Seller": "from-amber-500/80 to-orange-600/80 border-amber-400/40 text-amber-100",
  "New":         "from-emerald-500/80 to-teal-600/80 border-emerald-400/40 text-emerald-100",
  "Limited":     "from-violet-500/80 to-purple-600/80 border-violet-400/40 text-violet-100",
  "Popular":     "from-pink-500/80 to-rose-600/80 border-pink-400/40 text-pink-100",
  "Seasonal":    "from-sky-500/80 to-blue-600/80 border-sky-400/40 text-sky-100",
};

function BadgePill({ badge }: { badge: string }) {
  const style = BADGE_STYLES[badge] || "from-gray-500/80 to-gray-600/80 border-gray-400/40 text-gray-100";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r border ${style} backdrop-blur-sm`}>
      {badge}
    </span>
  );
}

/* ─── Product Card ────────────────────────────────────────────── */
function ProductCard({
  product,
  onView,
  index,
  isFavorite,
  onToggleFavorite,
}: {
  product: Product;
  onView: (p: Product) => void;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string, name?: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image || "/logo.png");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  useEffect(() => {
    setImgSrc(product.image || "/logo.png");
  }, [product.image]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.55, delay: Math.min(index * 0.04, 0.3), ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden cursor-pointer group flex-shrink-0"
      style={{
        width: 220,
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${hovered ? product.color + "50" : "rgba(255,255,255,0.08)"}`,
        backdropFilter: "blur(20px)",
        boxShadow: hovered ? `0 0 30px ${product.glow}, 0 12px 40px rgba(0,0,0,0.5)` : "0 4px 20px rgba(0,0,0,0.4)",
        transition: "border-color 0.4s, box-shadow 0.4s",
      }}
      onClick={() => onView(product)}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          unoptimized
          onError={() => setImgSrc("/logo.png")}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="220px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        {/* Color dot */}
        <div
          className="absolute bottom-3 left-3 w-4 h-4 rounded-full border-2 border-white/30 shadow-lg"
          style={{ background: product.color, boxShadow: `0 0 10px ${product.glow}` }}
        />
        {/* Favorite */}
        <button
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110"
          style={{
            background: isFavorite ? product.color + "40" : "rgba(0,0,0,0.4)",
            border: `1px solid ${isFavorite ? product.color + "60" : "rgba(255,255,255,0.15)"}`,
            color: isFavorite ? product.color : "rgba(255,255,255,0.6)",
          }}
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(product.id, product.name); }}
          aria-label="Favourite"
        >
          <HeartIcon filled={isFavorite} />
        </button>
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5">
            <BadgePill badge={product.badge} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3.5">
        <p className="text-white/40 text-[10px] uppercase tracking-widest font-inter mb-0.5">
          {product.category}
        </p>
        <h3 className="text-white font-semibold text-sm font-inter leading-tight mb-1.5 line-clamp-1">
          {product.name}
        </h3>
        <Stars rating={product.rating} />
        <p className="text-white/40 text-xs font-inter mt-1.5 leading-snug line-clamp-2">
          {product.description}
        </p>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-3 w-full py-2 rounded-xl text-xs font-semibold font-inter transition-all duration-300 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${product.color}30, ${product.color}15)`,
            border: `1px solid ${product.color}40`,
            color: product.color,
          }}
          onClick={(e) => { e.stopPropagation(); onView(product); }}
        >
          <span className="relative z-10">View Details</span>
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{ background: `linear-gradient(135deg, ${product.color}20, transparent)` }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </div>

      {/* Hover glow overlay */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{ boxShadow: `inset 0 0 40px ${product.glow}` }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Category Section ────────────────────────────────────────── */
function CategorySection({
  category,
  onView,
  isVisible,
  favorites,
  onToggleFavorite,
}: {
  category: Category;
  onView: (p: Product) => void;
  isVisible: boolean;
  favorites: string[];
  onToggleFavorite: (id: string, name?: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-5%" });

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -480 : 480, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <section className="mb-16" id={category.id}>
      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, x: -30 }}
        animate={headerInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-white/10"
      >
        <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
          <span className="text-3xl md:text-4xl shrink-0 pt-1">{category.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h2
                className="text-2xl md:text-3xl font-bold font-inter tracking-tight leading-tight"
                style={{
                  background: `linear-gradient(135deg, #ffffff 0%, ${category.headerColor} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {category.name}
              </h2>
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-semibold font-inter whitespace-nowrap shrink-0"
                style={{
                  background: `${category.headerColor}20`,
                  border: `1px solid ${category.headerColor}40`,
                  color: category.headerColor,
                }}
              >
                {category.products.length} flavours
              </span>
            </div>
            <p className="text-white/40 font-inter text-xs md:text-sm mt-0.5 leading-relaxed">{category.description}</p>
          </div>
        </div>

        {/* Scroll controls */}
        <div className="flex gap-2 self-end shrink-0">
          <button
            onClick={() => scroll("left")}
            className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-all duration-200 hover:scale-105"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-all duration-200 hover:scale-105"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </motion.div>

      {/* Horizontal carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {category.products.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            onView={onView}
            index={i}
            isFavorite={favorites.includes(product.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </section>
  );
}

/* ─── Cinematic Modal ─────────────────────────────────────────── */
function FlavorModal({
  product,
  onClose,
  relatedProducts,
  isFavorite,
  onToggleFavorite,
}: {
  product: Product;
  onClose: () => void;
  relatedProducts: Product[];
  isFavorite: boolean;
  onToggleFavorite: (id: string, name?: string) => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ backdropFilter: "blur(20px)", background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      {/* Radial glow behind modal */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at 50% 50%, ${product.glow} 0%, transparent 70%)`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 24 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl rounded-3xl overflow-hidden"
        style={{
          background: "rgba(15,15,20,0.95)",
          border: `1px solid ${product.color}30`,
          boxShadow: `0 0 80px ${product.glow}, 0 40px 80px rgba(0,0,0,0.8)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-all duration-200 hover:scale-105"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          <XIcon />
        </button>

        <div className="flex flex-col md:flex-row md:min-h-[550px]">
          {/* Image */}
          <div className="relative md:w-1/2 h-80 md:h-auto flex-shrink-0 overflow-hidden">
            <Image
              src={product.image || "/logo.png"}
              alt={product.name}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${product.color}20 0%, rgba(0,0,0,0.6) 100%)`,
              }}
            />
            {/* Color swatch */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full border-2 border-white/30"
                style={{ background: product.color, boxShadow: `0 0 16px ${product.glow}` }}
              />
              {product.badge && <BadgePill badge={product.badge} />}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 md:p-8 flex flex-col gap-4">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-2 font-inter"
                style={{ color: product.color }}
              >
                {product.category}
              </p>
              <h2
                className="text-3xl font-bold font-inter leading-tight mb-2"
                style={{
                  background: `linear-gradient(135deg, #ffffff 0%, ${product.color} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {product.name}
              </h2>
              <Stars rating={product.rating} />
            </div>

            <p className="text-white/60 font-inter text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium font-inter capitalize"
                  style={{
                    background: `${product.color}18`,
                    border: `1px solid ${product.color}30`,
                    color: product.color,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Related */}
            {relatedProducts.length > 0 && (
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest font-inter mb-2">
                  Also from this collection
                </p>
                <div className="flex gap-2 overflow-x-auto">
                  {relatedProducts.slice(0, 5).map((rp) => (
                    <div
                      key={rp.id}
                      className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden relative border"
                      style={{ borderColor: `${rp.color}30` }}
                    >
                      <Image src={rp.image || "/logo.png"} alt={rp.name} fill unoptimized className="object-cover" sizes="48px" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA row */}
            <div className="flex gap-3 mt-auto pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onToggleFavorite(product.id, product.name)}
                className="flex-1 py-3 rounded-xl font-semibold text-sm font-inter relative overflow-hidden flex items-center justify-center gap-2 transition-all duration-300"
                style={{
                  background: isFavorite
                    ? `linear-gradient(135deg, ${product.color}, #d946ef)`
                    : `linear-gradient(135deg, ${product.color}90, ${product.color}50)`,
                  border: `1px solid ${product.color}50`,
                  color: "#fff",
                  boxShadow: isFavorite ? `0 0 25px ${product.glow}` : `0 0 15px ${product.glow}`,
                }}
              >
                <HeartIcon filled={isFavorite} />
                <span>{isFavorite ? "Saved in Favourites" : "Add to Favourites"}</span>
              </motion.button>
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-xl font-semibold text-sm font-inter text-white/50 hover:text-white transition-colors duration-200"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Filter Bar ──────────────────────────────────────────────── */
type FilterType = "All" | "Best Seller" | "New" | "Limited" | "Popular" | "Seasonal" | "Favourites";
const FILTERS: FilterType[] = ["All", "Best Seller", "New", "Popular", "Limited", "Seasonal", "Favourites"];

function FilterBar({
  active,
  setActive,
  search,
  setSearch,
  activeCategory,
  setActiveCategory,
  favoritesCount,
}: {
  active: FilterType;
  setActive: (f: FilterType) => void;
  search: string;
  setSearch: (s: string) => void;
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  favoritesCount: number;
}) {
  return (
    <div
      className="sticky top-0 z-30 py-4 px-6 mb-10"
      style={{
        background: "rgba(10,10,13,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Row 1: Filter chips + search */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const isFavFilter = f === "Favourites";
              const label = isFavFilter ? `❤️ Favourites ${favoritesCount > 0 ? `(${favoritesCount})` : ""}` : f;
              return (
                <motion.button
                  key={f}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96, y: 1 }}
                  onClick={() => setActive(f)}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold font-inter uppercase tracking-wide transition-all duration-250 flex items-center gap-1"
                  style={
                    active === f
                      ? { background: "linear-gradient(135deg, #FF6BD6, #8B5CF6)", color: "#fff", border: "1px solid transparent", boxShadow: "0 0 16px rgba(255,107,214,0.4)" }
                      : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }
                  }
                >
                  {label}
                </motion.button>
              );
            })}
          </div>

          {/* Search */}
          <div className="ml-auto relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search flavours…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-full text-xs font-inter text-white placeholder-white/30 focus:outline-none w-44 focus:w-56 transition-all duration-300"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
            />
          </div>
        </div>

        {/* Row 2: Category jump pills */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setActiveCategory("all")}
            className="flex-shrink-0 px-3 py-1 rounded-lg text-[11px] font-inter font-medium transition-all duration-200"
            style={
              activeCategory === "all"
                ? { background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }
                : { background: "transparent", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.06)" }
            }
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                document.getElementById(cat.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="flex-shrink-0 px-3 py-1 rounded-lg text-[11px] font-inter font-medium transition-all duration-200 flex items-center gap-1.5"
              style={
                activeCategory === cat.id
                  ? { background: `${cat.headerColor}20`, color: cat.headerColor, border: `1px solid ${cat.headerColor}40` }
                  : { background: "transparent", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.06)" }
              }
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────── */
export default function ProductsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);

  const [fetchedProducts, setFetchedProducts] = useState<Product[]>(ALL_PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ff_favorites");
      if (saved) setFavorites(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load favorites", e);
    }
  }, []);

  // Fetch dynamic products from Admin API
  useEffect(() => {
    async function loadProducts() {
      try {
        const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL;
        const url = adminUrl ? `${adminUrl}/api/products` : "http://localhost:3001/api/products";
        const res = await fetch(url, { cache: "no-store" });
        const json = await res.json();
        if (json.success && json.data) {
          // ensure _id is mapped to id if coming from mongo
          const mapped = json.data.map((p: any) => ({
            ...p,
            id: p._id || p.id,
          }));
          setFetchedProducts(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic products, using fallback data:", err);
      } finally {
        setLoadingProducts(false);
      }
    }
    loadProducts();
  }, []);

  const toggleFavorite = useCallback((productId: string, productName?: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(productId);
      const updated = isFav ? prev.filter((id) => id !== productId) : [...prev, productId];
      try {
        localStorage.setItem("ff_favorites", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save favorites", e);
      }

      if (productName) {
        setToast({
          message: isFav ? `Removed ${productName} from favourites` : `❤️ Added ${productName} to favourites!`,
          visible: true,
        });
        setTimeout(() => setToast(null), 3000);
      }
      return updated;
    });
  }, []);

  // Compute visible categories based on filter + search
  const filteredCategories = CATEGORIES.map((cat) => {
    // Override static products with fetched ones
    const dynamicCategoryProducts = fetchedProducts.filter((p) => p.categoryId === cat.id && p.visible !== false);
    
    return {
      ...cat,
      products: dynamicCategoryProducts.filter((p) => {
        const matchesFilter =
          activeFilter === "All" ||
          (activeFilter === "Favourites"
            ? favorites.includes(p.id)
            : p.badge === activeFilter || (p.tags && p.tags.some((t: string) => t.toLowerCase() === activeFilter.toLowerCase())));
        const matchesSearch =
          search === "" ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(search.toLowerCase())) ||
          (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(search.toLowerCase())));
        return matchesFilter && matchesSearch;
      }),
    };
  }).filter((cat) =>
    (activeCategory === "all" || cat.id === activeCategory) &&
    cat.products.length > 0
  );

  const relatedProducts = modalProduct
    ? fetchedProducts.filter(
        (p) => p.categoryId === modalProduct.categoryId && p.id !== modalProduct.id && p.visible !== false
      ).slice(0, 6)
    : [];

  const handleView = useCallback((p: Product) => setModalProduct(p), []);
  const handleClose = useCallback(() => setModalProduct(null), []);

  return (
    <main className="min-h-screen flex flex-col relative">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-14 px-6 overflow-hidden">
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, rgba(255,43,194,0.08) 0%, transparent 70%)" }} />
          <div className="absolute top-10 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px]"
            style={{ background: "radial-gradient(circle, rgba(255,140,66,0.07) 0%, transparent 70%)" }} />
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold uppercase tracking-widest font-inter"
            style={{ background: "rgba(255,43,194,0.1)", border: "1px solid rgba(255,43,194,0.25)", color: "#FF6BD6" }}
          >
            🍦 100+ Premium Flavours
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bungee leading-none tracking-tight mb-6"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #FF6BD6 40%, #FFB347 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 40px rgba(255,107,214,0.3))",
            }}
          >
            OUR MENU
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/50 font-inter text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Explore a universe of 100+ premium dessert flavours — from rich kulfi
            to exotic fusion drinks, each crafted to perfection.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-center gap-6 mt-8"
          >
            {[
              { value: `${ALL_PRODUCTS.length}+`, label: "Flavours" },
              { value: `${CATEGORIES.length}`, label: "Categories" },
              { value: `${ALL_PRODUCTS.filter(p => p.badge === "Best Seller").length}`, label: "Best Sellers" },
              { value: "4.7★", label: "Avg Rating" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold font-inter text-white">{value}</p>
                <p className="text-white/40 text-xs font-inter uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <FilterBar
        active={activeFilter}
        setActive={setActiveFilter}
        search={search}
        setSearch={setSearch}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        favoritesCount={favorites.length}
      />

      {/* ── Gallery ── */}
      <div className="flex-1 px-6 max-w-[1400px] mx-auto w-full pb-24">
        {filteredCategories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <p className="text-6xl mb-4">{activeFilter === "Favourites" ? "💔" : "🔍"}</p>
            <p className="text-white/50 font-inter text-xl mb-2">
              {activeFilter === "Favourites" ? "No favourite flavours saved yet" : "No flavours found"}
            </p>
            <p className="text-white/30 font-inter text-sm">
              {activeFilter === "Favourites"
                ? "Click the heart icon on any card or detail popup to save your top picks!"
                : "Try adjusting your filter or search term"}
            </p>
          </motion.div>
        ) : (
          filteredCategories.map((cat) => (
            <CategorySection
              key={cat.id}
              category={cat}
              onView={handleView}
              isVisible={true}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          ))
        )}
      </div>

      <Footer />

      {/* ── Modal ── */}
      <AnimatePresence>
        {modalProduct && (
          <FlavorModal
            product={modalProduct}
            onClose={handleClose}
            relatedProducts={relatedProducts}
            isFavorite={favorites.includes(modalProduct.id)}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </AnimatePresence>

      {/* ── Floating Toast Notification ── */}
      <AnimatePresence>
        {toast?.visible && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl backdrop-blur-xl border text-sm font-semibold font-inter shadow-2xl flex items-center gap-3 text-white pointer-events-none"
            style={{
              background: "rgba(20,20,30,0.9)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(255,107,214,0.3)",
            }}
          >
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
