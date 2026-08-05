"use client";

import { useState, useEffect } from "react";

interface GalleryImage {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  uploadedAt: Date;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.success) {
        setImages(data.images);
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
    if (!file || !title) {
      setStatus({ type: "error", message: "Please provide a title and select an image." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatus({ type: "error", message: "File size exceeds 5MB limit." });
      return;
    }

    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64String = reader.result as string;

        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, imageBase64: base64String }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to upload image.");
        }

        setStatus({ type: "success", message: "Image uploaded successfully!" });
        setTitle("");
        setDescription("");
        setFile(null);
        fetchImages(); // Refresh the grid
      };
      
      reader.onerror = () => {
        throw new Error("Failed to read file.");
      };
    } catch (err: any) {
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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Gallery Management</h2>
        <p className="text-gray-400 mt-1 text-sm">Upload and manage images with titles and descriptions for the public gallery.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Upload New Image</h3>
        <form onSubmit={handleUpload} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Image Title *</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-pink-500 transition-colors"
              placeholder="e.g., Signature Mango Stick Kulfi"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Description (Optional)</label>
            <textarea 
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-pink-500 transition-colors resize-none"
              placeholder="Brief description of the image or dessert..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Select Image (Max 5MB) *</label>
            <input 
              type="file" 
              accept="image/*"
              required
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
              }}
              className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-pink-400 hover:file:bg-gray-700 transition-colors"
            />
          </div>

          {status.type === "error" && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {status.message}
            </div>
          )}
          {status.type === "success" && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
              {status.message}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>
        </form>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-6">Uploaded Images</h3>
        
        {fetching ? (
          <div className="text-center py-12 text-gray-500">Loading images...</div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-800 rounded-xl">
            No images uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((img) => (
              <div key={img._id} className="group relative rounded-xl overflow-hidden bg-gray-800 border border-gray-700 aspect-square">
                <img 
                  src={img.imageUrl.startsWith("/") ? `http://localhost:3000${img.imageUrl}` : img.imageUrl} 
                  alt={img.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Delete Button */}
                <button 
                  onClick={() => handleDelete(img._id)}
                  className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 shadow-lg"
                  title="Delete Image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>

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
