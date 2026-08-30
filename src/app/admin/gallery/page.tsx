"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ImageIcon,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Star,
  Eye,
  AlertCircle,
  X,
  Loader2,
  RefreshCw,
  Tag,
} from "lucide-react";
import ImageUploadDropzone from "@/components/admin/ImageUploadDropzone";

interface MediaAsset {
  id: string;
  title: string;
  altText: string | null;
  caption: string | null;
  url: string;
  category: string;
  tags: string | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export default function AdminGalleryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [summary, setSummary] = useState({
    totalAssets: 0,
    publishedAssets: 0,
    featuredAssets: 0,
    categoriesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    altText: "",
    url: "/images/themes/theme_lavender_dream.jpg",
    category: "Kids Birthdays",
    tags: "Birthday, Islamabad, Decor",
    isFeatured: false,
    isActive: true,
    sortOrder: 0,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const fetchAssets = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/gallery?category=${categoryFilter}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setAssets(json.data || []);
        if (json.summary) setSummary(json.summary);
      }
    } catch (err) {
      console.error("Failed to load gallery assets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [categoryFilter]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const openCreateModal = () => {
    setEditingAsset(null);
    setFormData({
      title: "",
      caption: "",
      altText: "",
      url: "/images/themes/theme_lavender_dream.jpg",
      category: "Kids Birthdays",
      tags: "Birthday, Decor, Islamabad",
      isFeatured: false,
      isActive: true,
      sortOrder: assets.length + 1,
    });
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const openEditModal = (a: MediaAsset) => {
    setEditingAsset(a);
    setFormData({
      title: a.title,
      caption: a.caption || "",
      altText: a.altText || "",
      url: a.url,
      category: a.category,
      tags: a.tags || "",
      isFeatured: a.isFeatured,
      isActive: a.isActive,
      sortOrder: a.sortOrder,
    });
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const handleSaveAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMessage("");

    try {
      if (!formData.title || !formData.url) {
        throw new Error("Title and Image URL are required.");
      }

      if (editingAsset) {
        const res = await fetch("/api/admin/gallery", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingAsset.id, ...formData }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to update asset.");
        showToast("Photo details updated.");
      } else {
        const res = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to add asset.");
        showToast("New photo added to gallery.");
      }

      setIsFormOpen(false);
      fetchAssets();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const toggleAssetActive = async (a: MediaAsset) => {
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: a.id, isActive: !a.isActive }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Photo ${!a.isActive ? "published" : "hidden"}.`);
        fetchAssets();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleAssetFeatured = async (a: MediaAsset) => {
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: a.id, isFeatured: !a.isFeatured }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Photo ${!a.isFeatured ? "marked as featured" : "unfeatured"}.`);
        fetchAssets();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteAsset = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${deleteConfirmId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete asset.");
      showToast("Photo deleted from gallery.");
      setDeleteConfirmId(null);
      fetchAssets();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const categories = ["ALL", "Kids Birthdays", "Outdoor Events", "Luxury Events", "Themes", "Balloon Decor"];

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.caption || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.tags || "").toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-navy-950 text-white px-5 py-3 rounded-xl shadow-2xl border border-brand-gold-500/40 flex items-center space-x-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-warm-200/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-brand-gold-600 uppercase tracking-wider mb-1">
            <ImageIcon className="w-4 h-4" />
            <span>Media Library & Showcase</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy-950">
            Gallery Management
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy-600">
            Publish real celebration photography, organize thematic photo sets, and feature hero installations.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-gold text-xs px-5 py-2.5 flex items-center justify-center space-x-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo to Gallery</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-brand-navy-900">
          <span className="text-xs text-brand-navy-600 font-medium">Total Gallery Photos</span>
          <p className="text-2xl font-serif font-bold text-brand-navy-950">{summary.totalAssets}</p>
          <p className="text-[11px] text-brand-navy-500">In platform database</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-emerald-600">
          <span className="text-xs text-brand-navy-600 font-medium">Published on Site</span>
          <p className="text-2xl font-serif font-bold text-emerald-700">{summary.publishedAssets}</p>
          <p className="text-[11px] text-brand-navy-500">Visible on /gallery</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-brand-gold-500">
          <span className="text-xs text-brand-navy-600 font-medium">Featured Showcase</span>
          <p className="text-2xl font-serif font-bold text-brand-navy-950">{summary.featuredAssets}</p>
          <p className="text-[11px] text-brand-navy-500">High priority photos</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-amber-500">
          <span className="text-xs text-brand-navy-600 font-medium">Photo Categories</span>
          <p className="text-2xl font-serif font-bold text-brand-navy-950">{summary.categoriesCount}</p>
          <p className="text-[11px] text-brand-navy-500">Outdoor, luxury, themes</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card-luxury p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-brand-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search photo title, caption, tags..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
            />
          </div>

          <button
            onClick={fetchAssets}
            className="p-2 rounded-lg border border-brand-warm-300 text-brand-navy-600 hover:bg-brand-warm-100 transition-colors ml-auto"
            title="Refresh List"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-brand-warm-200/60">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                categoryFilter.toLowerCase() === cat.toLowerCase()
                  ? "bg-brand-navy-950 text-white shadow-sm"
                  : "bg-brand-warm-100 text-brand-navy-700 hover:bg-brand-warm-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="card-luxury py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-gold-600 animate-spin mx-auto" />
          <p className="text-xs text-brand-navy-600">Loading gallery photos from database...</p>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="card-luxury py-16 text-center space-y-3">
          <ImageIcon className="w-10 h-10 text-brand-warm-400 mx-auto" />
          <p className="text-sm font-semibold text-brand-navy-950">No photos found</p>
          <p className="text-xs text-brand-navy-500">
            {search ? "No photos match your filters." : "Add your first real event photo."}
          </p>
          <button
            onClick={openCreateModal}
            className="btn-gold text-xs px-4 py-2 mt-2 inline-flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Photo</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((a) => (
            <div
              key={a.id}
              className={`card-luxury flex flex-col justify-between overflow-hidden transition-all ${
                !a.isActive ? "opacity-60 bg-brand-warm-100/40" : ""
              }`}
            >
              <div>
                <div className="relative h-60 w-full bg-brand-warm-100 overflow-hidden group">
                  <Image
                    src={a.url}
                    alt={a.altText || a.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span className="badge-gold bg-brand-navy-950/90 text-brand-gold-300 border-brand-gold-400 text-xs">
                      {a.category}
                    </span>
                    {a.isFeatured && (
                      <span className="bg-amber-500 text-brand-navy-950 p-1 rounded-full text-xs font-bold shadow-sm">
                        <Star className="w-3 h-3 fill-brand-navy-950" />
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-serif font-bold text-sm leading-snug">{a.title}</h3>
                    <p className="text-[11px] text-brand-warm-200 line-clamp-1 mt-0.5">
                      {a.caption || a.tags || "Celebration photo"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-brand-warm-200 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => toggleAssetActive(a)}
                      className={`w-7 h-4 rounded-full transition-colors relative ${
                        a.isActive ? "bg-emerald-600" : "bg-brand-warm-300"
                      }`}
                    >
                      <span
                        className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                          a.isActive ? "left-3.5" : "left-0.5"
                        }`}
                      />
                    </button>
                    <span className="text-[11px] font-semibold text-brand-navy-700">
                      {a.isActive ? "Published" : "Hidden"}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleAssetFeatured(a)}
                    className={`p-1 rounded-lg border text-xs flex items-center space-x-1 ${
                      a.isFeatured
                        ? "border-amber-400 bg-amber-50 text-amber-800 font-bold"
                        : "border-brand-warm-300 text-brand-navy-500 hover:bg-brand-warm-100"
                    }`}
                    title="Toggle Featured"
                  >
                    <Star className={`w-3 h-3 ${a.isFeatured ? "fill-amber-500 text-amber-500" : ""}`} />
                  </button>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => openEditModal(a)}
                    className="p-1.5 rounded-lg border border-brand-warm-300 text-brand-navy-700 hover:bg-brand-warm-100"
                    title="Edit Details"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(a.id)}
                    className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT ASSET MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-brand-warm-200 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-brand-warm-200 pb-3">
              <h3 className="text-lg font-serif font-bold text-brand-navy-950">
                {editingAsset ? "Edit Photo Information" : "Add Photo to Gallery"}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-brand-navy-400 hover:text-brand-navy-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveAsset} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Ayra's 1st Birthday Garden Lawn Setup"
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div>
                <ImageUploadDropzone
                  value={formData.url}
                  onChange={(url) => setFormData({ ...formData, url })}
                  folder="gallery"
                  altText={formData.altText || formData.title}
                  label="Upload Photo to Supabase Storage *"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-navy-900 mb-1">Image CDN URL</label>
                  <input
                    type="text"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-navy-900 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                  >
                    <option value="Kids Birthdays">Kids Birthdays</option>
                    <option value="Outdoor Events">Outdoor Events</option>
                    <option value="Luxury Events">Luxury Events</option>
                    <option value="Themes">Themes</option>
                    <option value="Balloon Decor">Balloon Decor</option>
                    <option value="Milestones">Milestones</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">Caption / Setup Details</label>
                <textarea
                  rows={2}
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="e.g. Circular lilac backdrop with 3D ONE marquee letters in Islamabad F-8 garden."
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-navy-900 mb-1">Alt Text (SEO)</label>
                  <input
                    type="text"
                    value={formData.altText}
                    onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                    placeholder="Keywords for search engines"
                    className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-navy-900 mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Outdoor, Lawn, 1st Birthday"
                    className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-1.5 font-semibold text-brand-navy-900">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-brand-gold-600 rounded"
                    />
                    <span>Publish on /gallery</span>
                  </label>

                  <label className="flex items-center space-x-1.5 font-semibold text-brand-navy-900">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 text-brand-gold-600 rounded"
                    />
                    <span>Feature on Homepage</span>
                  </label>
                </div>

                <div className="flex items-center space-x-1.5">
                  <label className="text-brand-navy-700">Order:</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                    className="w-14 p-1.5 rounded-lg border border-brand-warm-300 text-center"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-brand-warm-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="btn-outline-navy px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn-gold px-5 py-2 font-bold flex items-center space-x-1.5"
                >
                  {formLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingAsset ? "Save Changes" : "Add to Gallery"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-brand-warm-200 text-center animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-brand-navy-950">
              Delete Photo?
            </h3>
            <p className="text-xs text-brand-navy-600 leading-relaxed">
              Are you sure you want to remove this photo from the gallery? It will no longer appear on public showcases.
            </p>
            <div className="pt-2 flex justify-center space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-outline-navy text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAsset}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
