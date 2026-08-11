"use client";

import { useState, useEffect } from "react";

interface GalleryImage {
  _id: string;
  title: string;
  description?: string;
  outletName?: string;
  outletSlug?: string;
  imageUrl: string;
  uploadedAt: string;
}

const QUICK_OUTLETS = [
  "Tuticorin Flagship Lounge",
  "Chennai Prime Lounge",
  "Express EV Cart Outlets",
  "Grand Wedding Event",
  "Corporate Dessert Expo",
];

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [outletName, setOutletName] = useState(QUICK_OUTLETS[0]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.success) {
        setImages(data.images || []);
      }
    } catch (error) {
      console.error("Failed to fetch gallery images:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFiles || selectedFiles.length === 0) {
      setStatus({ type: "error", message: "Please select at least one image file." });
      return;
    }

    if (!outletName.trim()) {
      setStatus({ type: "error", message: "Please provide an Outlet / Event name." });
      return;
    }

    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const formData = new FormData();
      formData.append("title", title.trim() || outletName.trim());
      formData.append("description", description.trim());
      formData.append("outletName", outletName.trim());

      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("images", selectedFiles[i]);
      }

      const res = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to upload image(s).");
      }

      setStatus({
        type: "success",
        message: data.message || `Successfully uploaded ${selectedFiles.length} photo(s) to Cloudinary!`,
      });

      setTitle("");
      setDescription("");
      setSelectedFiles(null);
      
      // Reset file input element manually
      const fileInput = document.getElementById("gallery-file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      fetchImages();
    } catch (err: any) {
      console.error(err);
      setStatus({ type: "error", message: err.message || "An error occurred during upload." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`/api/gallery?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to delete image");
      
      setStatus({ type: "success", message: "Image deleted successfully!" });
      fetchImages();
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "An error occurred during deletion." });
    }
  };

  // Get unique outlet names for filter tabs
  const uniqueOutlets = Array.from(
    new Set(images.map((img) => img.outletName || "Tuticorin Flagship Lounge"))
  );

  const filteredImages = activeFilter === "all"
    ? images
    : images.filter((img) => (img.outletName || "Tuticorin Flagship Lounge") === activeFilter);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Outlet & Event Gallery Management</h2>
        <p className="text-gray-400 mt-1 text-sm">
          Upload multi-photo collections for each Outlet or Special Event. Photos are stored securely on Cloudinary and showcased on the website with slideshow animations.
        </p>
      </div>

      {/* ── Upload Form ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Upload New Outlet / Event Collection</h3>
        <form onSubmit={handleUpload} className="space-y-5 max-w-2xl">
          {/* Outlet / Event Name Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Outlet / Event Name *
            </label>
            <input 
              type="text" 
              required
              value={outletName}
              onChange={(e) => setOutletName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500 transition-colors placeholder-gray-500 mb-2.5"
              placeholder="e.g. Tuticorin Flagship Lounge, Royal Wedding Event, Express Cart..."
            />
            {/* Quick Suggestion Pills */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[11px] text-gray-500 py-1 font-medium">Quick Select:</span>
              {QUICK_OUTLETS.map((pill) => (
                <button
                  key={pill}
                  type="button"
                  onClick={() => setOutletName(pill)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    outletName === pill
                      ? "bg-pink-500/20 border-pink-500 text-pink-300 font-semibold"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
                  }`}
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Photo Title (Optional)
            </label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500 transition-colors placeholder-gray-500"
              placeholder="e.g., Neon Lounge Seating, Kulfi Counter Setup"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Description (Optional)
            </label>
            <textarea 
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500 transition-colors resize-none placeholder-gray-500"
              placeholder="Brief details about this outlet or event photo collection..."
            />
          </div>

          {/* Multi-File Select Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Select Photo(s) * <span className="text-pink-400 font-normal">(Select multiple files at once)</span>
              </label>
              {selectedFiles && (
                <span className="text-xs text-green-400 font-medium">
                  {selectedFiles.length} file(s) selected
                </span>
              )}
            </div>
            <input 
              id="gallery-file-input"
              type="file" 
              accept="image/jpeg, image/png, image/webp"
              multiple
              required
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setSelectedFiles(e.target.files);
                }
              }}
              className="w-full text-gray-400 bg-gray-800 border border-gray-700 rounded-xl p-2 text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-500/10 file:text-pink-400 hover:file:bg-pink-500/20 transition-colors cursor-pointer"
            />
          </div>

          {status.type === "error" && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              ⚠️ {status.message}
            </div>
          )}
          {status.type === "success" && (
            <div className="p-3.5 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
              ✅ {status.message}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-pink-500/20 flex items-center gap-2"
          >
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {loading ? "Uploading to Cloudinary..." : `Upload ${selectedFiles ? `${selectedFiles.length} Photo(s)` : "Photos"}`}
          </button>
        </form>
      </div>

      {/* ── Uploaded Gallery Grid ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <h3 className="text-lg font-semibold text-white">Uploaded Gallery Collections</h3>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === "all"
                  ? "bg-pink-500 text-white font-semibold"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              All ({images.length})
            </button>
            {uniqueOutlets.map((outlet) => {
              const count = images.filter((i) => (i.outletName || "Tuticorin Flagship Lounge") === outlet).length;
              return (
                <button
                  key={outlet}
                  onClick={() => setActiveFilter(outlet)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    activeFilter === outlet
                      ? "bg-pink-500 text-white font-semibold"
                      : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  {outlet} ({count})
                </button>
              );
            })}
          </div>
        </div>
        
        {fetching ? (
          <div className="text-center py-16 text-gray-500 flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            Loading gallery...
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-16 text-gray-500 border-2 border-dashed border-gray-800 rounded-xl">
            No images found for this category. Upload photos above to build your showcase.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((img) => (
              <div key={img._id} className="group relative rounded-xl overflow-hidden bg-gray-800 border border-gray-700 aspect-square flex flex-col justify-between">
                {/* Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={img.imageUrl} 
                  alt={img.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Outlet Badge Header */}
                <div className="absolute top-2 left-2 z-10">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-black/60 backdrop-blur-md text-pink-300 border border-white/10 shadow-md">
                    📍 {img.outletName || "Tuticorin Flagship Lounge"}
                  </span>
                </div>
                
                {/* Delete Button */}
                <button 
                  onClick={() => handleDelete(img._id)}
                  className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 shadow-lg"
                  title="Delete Image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>

                {/* Info Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
                  <h4 className="text-white font-medium truncate">{img.title}</h4>
                  {img.description && <p className="text-gray-300 text-xs line-clamp-2 mt-0.5">{img.description}</p>}
                  <p className="text-gray-500 text-[10px] mt-1">
                    {new Date(img.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
