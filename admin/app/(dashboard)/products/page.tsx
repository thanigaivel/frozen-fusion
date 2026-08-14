"use client";

import { useState, useEffect, useCallback } from "react";

/* ─── Types ──────────────────────────────────────────────────── */
type Badge = "Best Seller" | "New" | "Limited" | "Popular" | null;

interface Product {
  _id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  description: string;
  badge: Badge;
  rating: number;
  image: string;
  color: string;
  tags: string[];
  visible: boolean;
  createdAt: string;
}

/* ─── Static category list (mirrors frontend data) ──────────── */
const CATEGORIES = [
  { id: "milk-popsicles",  name: "Premium Popsicle",   icon: "🥛" },
  { id: "kulfi",           name: "Kulfi Varieties",           icon: "🍨" },
  { id: "fruit-shaped",    name: "Viral Trending Dessert",   icon: "🍉" },
  { id: "scoops",          name: "Classic Ice Creams",             icon: "🍦" },
  { id: "seasonal",        name: "Premium Ice Cream",           icon: "❄️" },
  { id: "bulk",            name: "Signature Ice Cream",           icon: "🍨" },
  { id: "sandwiches",      name: "Ice Cream Slices & Sandwich",       icon: "🍪" },
  { id: "sundaes",         name: "Desserts",                    icon: "🍧" },
  { id: "shakes",          name: "Fusion Signature Shakes",               icon: "🥤" },
  { id: "fusion-drinks",   name: "Fusion Drinks",    icon: "🍹" },
];

const BADGE_OPTIONS: (Badge | "")[] = ["", "Best Seller", "New", "Limited", "Popular"];

const BADGE_COLORS: Record<string, string> = {
  "Best Seller": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "New":         "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Limited":     "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "Popular":     "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

/* ─── Empty form state ──────────────────────────────────────── */
const EMPTY_FORM = {
  name: "",
  categoryId: CATEGORIES[0].id,
  description: "",
  badge: "" as Badge | "",
  rating: 4.5,
  image: "",
  imageFile: null as File | null,
  color: "#60A5FA",
  tags: "",
  visible: true,
};

/* ─── Stat card ─────────────────────────────────────────────── */
function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-full ${color} opacity-10 blur-2xl`} />
      <p className="text-gray-400 text-xs font-medium mb-1 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-extrabold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch]   = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  /* ── Fetch ── */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const url = activeCat !== "all" ? `/api/products?categoryId=${activeCat}` : "/api/products";
      const res = await fetch(url);
      const json = await res.json();
      setProducts(json.data || []);
    } catch {
      showToast("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [activeCat]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  /* ── Toast ── */
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  /* ── Open form for add ── */
  const openAdd = () => {
    setEditProduct(null);
    setForm({ ...EMPTY_FORM });
    setShowForm(true);
  };

  /* ── Open form for edit ── */
  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({
      name: p.name,
      categoryId: p.categoryId,
      description: p.description,
      badge: p.badge || "",
      rating: p.rating,
      image: p.image,
      imageFile: null,
      color: p.color,
      tags: p.tags.join(", "),
      visible: p.visible,
    });
    setShowForm(true);
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      const cat = CATEGORIES.find((c) => c.id === form.categoryId)!;
      
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("categoryId", form.categoryId);
      formData.append("categoryName", cat.name);
      formData.append("description", form.description.trim());
      if (form.badge) formData.append("badge", form.badge);
      formData.append("rating", form.rating.toString());
      formData.append("color", form.color);
      formData.append("tags", JSON.stringify(form.tags.split(",").map((t) => t.trim()).filter(Boolean)));
      formData.append("visible", String(form.visible));
      
      if (form.imageFile) {
        formData.append("image", form.imageFile);
      }
      if (form.image) {
        formData.append("imageUrl", form.image);
      }

      let res: Response;

      if (editProduct) {
        if (form.imageFile) {
          res = await fetch(`/api/products/${editProduct._id}`, {
            method: "PATCH",
            body: formData,
          });
        } else {
          res = await fetch(`/api/products/${editProduct._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: form.name.trim(),
              categoryId: form.categoryId,
              categoryName: cat.name,
              description: form.description.trim(),
              badge: form.badge || null,
              rating: Number(form.rating),
              color: form.color,
              image: form.image,
              tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
              visible: form.visible,
            }),
          });
        }
      } else {
        res = await fetch("/api/products", {
          method: "POST",
          body: formData,
        });
      }

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Failed to save product.");
      }

      showToast(`"${form.name}" ${editProduct ? "updated" : "added"} successfully.`);
      setShowForm(false);
      fetchProducts();
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Toggle visibility ── */
  const handleToggle = async (p: Product) => {
    await fetch(`/api/products/${p._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !p.visible }),
    });
    showToast(`"${p.name}" ${!p.visible ? "shown" : "hidden"} on website.`);
    fetchProducts();
  };

  /* ── Delete ── */
  const handleDelete = async (id: string, name: string) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    showToast(`"${name}" deleted.`);
    fetchProducts();
  };

  /* ── Filtered products ── */
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Stats ── */
  const visibleCount = products.filter((p) => p.visible).length;
  const bestSellers  = products.filter((p) => p.badge === "Best Seller").length;
  const newItems     = products.filter((p) => p.badge === "New").length;

  return (
    <div>
      {/* ── Toast ── */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-gray-800 border border-gray-700 text-white text-sm px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
          {toastMsg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Product Management</h2>
          <p className="text-gray-400 mt-1 text-sm">Add, edit, and manage products across all categories.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 transition-opacity shadow-lg shadow-pink-500/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Products"  value={products.length} sub={`${visibleCount} visible`} color="bg-pink-500" />
        <StatCard label="Best Sellers"    value={bestSellers}     sub="across all categories"     color="bg-amber-500" />
        <StatCard label="New Items"       value={newItems}        sub="recently added"            color="bg-emerald-500" />
        <StatCard label="Categories"      value={CATEGORIES.length} sub="active varieties"        color="bg-purple-500" />
      </div>

      {/* ── Category tabs ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {[{ id: "all", name: "All", icon: "📦" }, ...CATEGORIES].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
              activeCat === cat.id
                ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30"
                : "bg-gray-900 border border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white"
            }`}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── Search + table ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Table header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-gray-300 font-medium">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 w-52"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">Product</th>
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 font-semibold">Badge</th>
                <th className="px-6 py-3 font-semibold">Rating</th>
                <th className="px-6 py-3 font-semibold">Color</th>
                <th className="px-6 py-3 font-semibold">Visibility</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex items-center justify-center gap-3 text-gray-500">
                      <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                      Loading products…
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                    {products.length === 0
                      ? "No products yet. Click \"Add Product\" to get started."
                      : "No products match your search."}
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-lg flex-shrink-0">
                            🍦
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium">{product.name}</p>
                          <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{product.description || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 text-xs">{product.categoryName}</span>
                    </td>
                    <td className="px-6 py-4">
                      {product.badge ? (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${BADGE_COLORS[product.badge] || "bg-gray-700 text-gray-400 border-gray-600"}`}>
                          {product.badge}
                        </span>
                      ) : (
                        <span className="text-gray-600 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-amber-400 font-medium text-xs">
                        {"★".repeat(Math.round(product.rating))} {product.rating.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-white/10"
                          style={{ background: product.color }}
                        />
                        <span className="text-gray-500 text-xs font-mono">{product.color}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggle(product)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                          product.visible ? "bg-green-500" : "bg-gray-700"
                        }`}
                        title={product.visible ? "Visible on website" : "Hidden from website"}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            product.visible ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-1.5 rounded-lg bg-gray-800 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 border border-gray-700 hover:border-blue-500/30 transition-all duration-150"
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product._id)}
                          className="p-1.5 rounded-lg bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-gray-700 hover:border-red-500/30 transition-all duration-150"
                          title="Delete"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {editProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-white transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                  Category *
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-pink-500 transition-colors"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Kesar Pista Kulfi"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-pink-500 transition-colors placeholder-gray-600"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Short flavour description…"
                  rows={2}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-pink-500 transition-colors placeholder-gray-600 resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                  Product Image
                </label>
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setForm((f) => ({ ...f, imageFile: e.target.files![0] }));
                    }
                  }}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-pink-500 transition-colors file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-500/10 file:text-pink-400 hover:file:bg-pink-500/20"
                />
                {editProduct && form.image && (
                  <p className="text-xs text-gray-500 mt-2">Current: {form.image}</p>
                )}
              </div>

              {/* Badge + Rating */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                    Badge
                  </label>
                  <select
                    value={form.badge || ""}
                    onChange={(e) => setForm((f) => ({ ...f, badge: (e.target.value || null) as Badge | "" }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-pink-500 transition-colors"
                  >
                    {BADGE_OPTIONS.map((b) => (
                      <option key={b || "none"} value={b || ""}>
                        {b || "None"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                    Rating (1–5)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    step={0.1}
                    value={form.rating}
                    onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
              </div>

              {/* Color + Visible */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.color}
                      onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                      className="w-10 h-10 rounded-lg border border-gray-700 bg-gray-800 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={form.color}
                      onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                      className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-pink-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                    Visible on Site
                  </label>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, visible: !f.visible }))}
                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-200 mt-1 ${
                      form.visible ? "bg-green-500" : "bg-gray-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        form.visible ? "translate-x-8" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                  Tags <span className="text-gray-600 normal-case">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="fruity, popular, premium"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-pink-500 transition-colors placeholder-gray-600"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {submitting ? "Saving…" : editProduct ? "Save Changes" : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 transition-all"
                >
                  Cancel
                </button>
                {editProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setDeleteConfirm(editProduct._id);
                    }}
                    className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    Delete
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteConfirm && (() => {
        const p = products.find((x) => x._id === deleteConfirm);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-900 border border-red-500/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Delete Product</h4>
                  <p className="text-gray-400 text-xs mt-0.5">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-5">
                Are you sure you want to delete <span className="font-semibold text-white">&ldquo;{p?.name}&rdquo;</span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(deleteConfirm, p?.name || "")}
                  className="flex-1 py-2 rounded-xl font-semibold text-sm bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2 rounded-xl font-semibold text-sm bg-gray-800 border border-gray-700 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
