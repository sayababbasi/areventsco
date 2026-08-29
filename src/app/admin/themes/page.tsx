"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Palette,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  Search,
  Loader2,
  Eye,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { formatPKR } from "@/lib/utils";

interface ThemeItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  heroImage?: string;
  colorPalette?: string;
  includedDecor?: string;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
  _count?: { bookings: number };
}

export default function AdminThemesPage() {
  const [themes, setThemes] = useState<ThemeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCategory, setFormCategory] = useState("Kids Birthday");
  const [formDescription, setFormDescription] = useState("");
  const [formHeroImage, setFormHeroImage] = useState("/images/themes/theme_lavender_dream.jpg");
  const [formColors, setFormColors] = useState("#9333EA, #EC4899, #F3E8FF, #FCD34D");
  const [formInclusions, setFormInclusions] = useState("8ft Arch Backdrop, Organic Balloon Garland, Plinths, Neon Sign");
  const [formIsPopular, setFormIsPopular] = useState(false);
  const [formIsActive, setFormIsActive] = useState(true);

  const fetchThemes = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/themes");
      const json = await res.json();
      if (json.success) {
        setThemes(json.data);
      }
    } catch (err) {
      console.error("Fetch themes error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormTitle("");
    setFormSlug("");
    setFormCategory("Kids Birthday");
    setFormDescription("");
    setFormHeroImage("/images/themes/theme_lavender_dream.jpg");
    setFormColors("#9333EA, #EC4899, #F3E8FF, #FCD34D");
    setFormInclusions("8ft Arch Backdrop, Organic Balloon Garland, Plinths, Neon Sign");
    setFormIsPopular(false);
    setFormIsActive(true);
    setModalError("");
    setIsModalOpen(true);
  };

  const openEditModal = (theme: ThemeItem) => {
    setIsEditing(true);
    setEditId(theme.id);
    setFormTitle(theme.title);
    setFormSlug(theme.slug);
    setFormCategory(theme.category);
    setFormDescription(theme.description);
    setFormHeroImage(theme.heroImage || "/images/themes/theme_lavender_dream.jpg");

    let colorsStr = "";
    try {
      const parsed = JSON.parse(theme.colorPalette || "[]");
      colorsStr = Array.isArray(parsed) ? parsed.join(", ") : theme.colorPalette || "";
    } catch {
      colorsStr = theme.colorPalette || "";
    }
    setFormColors(colorsStr);

    let incStr = "";
    try {
      const parsed = JSON.parse(theme.includedDecor || "[]");
      incStr = Array.isArray(parsed) ? parsed.join(", ") : theme.includedDecor || "";
    } catch {
      incStr = theme.includedDecor || "";
    }
    setFormInclusions(incStr);

    setFormIsPopular(theme.isPopular);
    setFormIsActive(theme.isActive);
    setModalError("");
    setIsModalOpen(true);
  };

  const handleSaveTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setIsSaving(true);

    try {
      const colorArray = formColors.split(",").map((c) => c.trim()).filter(Boolean);
      const incArray = formInclusions.split(",").map((i) => i.trim()).filter(Boolean);

      const payload = {
        id: editId,
        title: formTitle,
        slug: formSlug || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category: formCategory,
        description: formDescription,
        heroImage: formHeroImage,
        colorPalette: JSON.stringify(colorArray),
        includedDecor: JSON.stringify(incArray),
        isPopular: formIsPopular,
        isActive: formIsActive,
      };

      const endpoint = "/api/admin/themes";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) {
        setModalError(json.error || "Failed to save theme.");
        setIsSaving(false);
        return;
      }

      setIsModalOpen(false);
      fetchThemes();
    } catch (err: any) {
      setModalError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTheme = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete or deactivate "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/themes?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchThemes();
      } else {
        alert(json.error || "Failed to delete theme.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete theme.");
    }
  };

  const toggleActiveStatus = async (theme: ThemeItem) => {
    try {
      await fetch("/api/admin/themes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: theme.id, isActive: !theme.isActive }),
      });
      fetchThemes();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredThemes = themes.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", "First Birthday", "Girls", "Boys", "Kids", "Floral", "Luxury"];

  return (
    <div className="space-y-8">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-warm-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-brand-gold-600 uppercase tracking-wider font-semibold">
            <Palette className="w-3.5 h-3.5" />
            <span>Catalog Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-brand-navy-950 font-bold mt-1">
            Birthday Decoration Themes
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy-600 mt-1">
            Create, customize, and publish birthday themes with live photo setups for Islamabad & Rawalpindi.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchThemes}
            className="p-2.5 rounded-xl border border-brand-warm-300 bg-white text-brand-navy-700 hover:bg-brand-warm-100 transition-colors text-xs font-medium flex items-center space-x-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button onClick={openCreateModal} className="btn-gold flex items-center space-x-2 text-xs py-2.5 px-4 shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Create New Theme</span>
          </button>
        </div>
      </div>

      {/* 2. FILTERS & SEARCH */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-brand-warm-200 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-brand-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search themes by name or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-brand-warm-50/50 border border-brand-warm-200 rounded-xl text-xs text-brand-navy-950 placeholder:text-brand-navy-400 focus:outline-none focus:border-brand-gold-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-brand-navy-950 text-brand-gold-400 shadow-sm"
                  : "bg-brand-warm-50 text-brand-navy-700 hover:bg-brand-warm-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. THEMES GRID */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-gold-600" />
          <p className="text-xs text-brand-navy-600">Loading database themes...</p>
        </div>
      ) : filteredThemes.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-brand-warm-200 text-center space-y-4 shadow-sm">
          <Palette className="w-12 h-12 text-brand-warm-400 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-brand-navy-950">No Themes Found</h3>
          <p className="text-xs text-brand-navy-600 max-w-md mx-auto">
            No themes match your criteria or no themes have been created in the database yet.
          </p>
          <button onClick={openCreateModal} className="btn-gold text-xs py-2 px-4 inline-flex items-center space-x-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Theme</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredThemes.map((theme) => {
            let colors: string[] = [];
            try {
              colors = JSON.parse(theme.colorPalette || "[]");
            } catch {
              colors = [];
            }

            return (
              <div
                key={theme.id}
                className="bg-white rounded-2xl border border-brand-warm-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-brand-gold-400/80 transition-all group"
              >
                <div>
                  {/* Photo Preview */}
                  <div className="relative aspect-[4/3] w-full bg-brand-warm-100 overflow-hidden">
                    <Image
                      src={theme.heroImage || "/images/themes/theme_lavender_dream.jpg"}
                      alt={theme.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-navy-950/80 text-white backdrop-blur-md">
                        {theme.category}
                      </span>
                      {theme.isPopular && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-gold-500 text-brand-navy-950">
                          Popular
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => toggleActiveStatus(theme)}
                      className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md transition-colors ${
                        theme.isActive
                          ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
                          : "bg-rose-950/80 text-rose-300 border-rose-500/50"
                      }`}
                    >
                      {theme.isActive ? "Published" : "Draft"}
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2.5">
                    <h3 className="font-serif font-bold text-sm text-brand-navy-950 line-clamp-1">
                      {theme.title}
                    </h3>
                    <p className="text-xs text-brand-navy-600 line-clamp-2 leading-relaxed">
                      {theme.description}
                    </p>

                    {/* Color Chips */}
                    {colors.length > 0 && (
                      <div className="flex items-center space-x-1 pt-1">
                        {colors.slice(0, 5).map((hex, i) => (
                          <span
                            key={i}
                            className="w-3.5 h-3.5 rounded-full border border-white shadow-xs"
                            style={{ backgroundColor: hex }}
                            title={hex}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-3 border-t border-brand-warm-100 bg-brand-warm-50/50 flex items-center justify-between">
                  <Link
                    href={`/themes/${theme.slug}`}
                    target="_blank"
                    className="text-xs font-semibold text-brand-gold-700 hover:text-brand-gold-800 flex items-center space-x-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View Live</span>
                  </Link>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => openEditModal(theme)}
                      className="p-1.5 rounded-lg border border-brand-warm-300 bg-white text-brand-navy-700 hover:bg-brand-warm-100 transition-colors"
                      title="Edit Theme"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteTheme(theme.id, theme.title)}
                      className="p-1.5 rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Theme"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. CREATE / EDIT MODAL DRAWER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-brand-warm-200 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-brand-warm-200 pb-4">
              <h2 className="font-serif font-bold text-lg text-brand-navy-950">
                {isEditing ? "Edit Birthday Theme" : "Create New Birthday Theme"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-brand-warm-100 text-brand-navy-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSaveTheme} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-brand-navy-900 mb-1">Theme Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lavender Dream & Purple Princess"
                  value={formTitle}
                  onChange={(e) => {
                    setFormTitle(e.target.value);
                    if (!isEditing) {
                      setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }
                  }}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-brand-navy-950 focus:outline-none focus:border-brand-gold-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-navy-900 mb-1">Slug (URL identifier)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. lavender-dream-princess"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-brand-navy-950 focus:outline-none focus:border-brand-gold-500 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-navy-900 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-brand-navy-950 focus:outline-none focus:border-brand-gold-500 font-medium"
                  >
                    <option value="First Birthday">First Birthday</option>
                    <option value="Girls">Girls</option>
                    <option value="Boys">Boys</option>
                    <option value="Kids">Kids</option>
                    <option value="Floral">Floral</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-navy-900 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detailed visual description of the setup, backdrop style, balloon garlands, and pedestals..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-brand-navy-950 focus:outline-none focus:border-brand-gold-500"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-navy-900 mb-1">Featured Image Path / URL</label>
                <input
                  type="text"
                  placeholder="/images/themes/theme_lavender_dream.jpg"
                  value={formHeroImage}
                  onChange={(e) => setFormHeroImage(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-brand-navy-950 focus:outline-none focus:border-brand-gold-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-navy-900 mb-1">Color Palette (Comma separated hex codes)</label>
                <input
                  type="text"
                  placeholder="#9333EA, #EC4899, #F3E8FF, #FCD34D"
                  value={formColors}
                  onChange={(e) => setFormColors(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-brand-navy-950 focus:outline-none focus:border-brand-gold-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-navy-900 mb-1">Included Decor Elements (Comma separated)</label>
                <input
                  type="text"
                  placeholder="8ft Arch Backdrop, Organic Balloon Garland, Plinths, Neon Sign"
                  value={formInclusions}
                  onChange={(e) => setFormInclusions(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-brand-navy-950 focus:outline-none focus:border-brand-gold-500"
                />
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsPopular}
                    onChange={(e) => setFormIsPopular(e.target.checked)}
                    className="rounded text-brand-gold-600 focus:ring-brand-gold-500"
                  />
                  <span className="font-bold text-brand-navy-900">Mark as Popular Theme</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="rounded text-brand-gold-600 focus:ring-brand-gold-500"
                  />
                  <span className="font-bold text-brand-navy-900">Publish to Public Site</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-brand-warm-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-brand-warm-300 text-brand-navy-700 hover:bg-brand-warm-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-gold px-5 py-2 text-xs font-semibold flex items-center space-x-1.5"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isEditing ? "Update Theme" : "Create & Publish"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
