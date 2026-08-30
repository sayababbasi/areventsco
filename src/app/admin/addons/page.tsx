"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  PlusCircle,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  X,
  Loader2,
  RefreshCw,
  Sparkles,
  Tag,
} from "lucide-react";
import { formatPKR } from "@/lib/utils";

interface Addon {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string | null;
  priceMinor: number;
  currency: string;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export default function AdminAddonsPage() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Decor",
    description: "",
    pricePKR: 15000,
    image: "/images/themes/theme_lavender_dream.jpg",
    isActive: true,
    sortOrder: 0,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const fetchAddons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/addons");
      const json = await res.json();
      if (json.success) {
        setAddons(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load addons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddons();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const openCreateModal = () => {
    setEditingAddon(null);
    setFormData({
      title: "",
      slug: "",
      category: "Decor",
      description: "",
      pricePKR: 12000,
      image: "/images/themes/theme_lavender_dream.jpg",
      isActive: true,
      sortOrder: addons.length + 1,
    });
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const openEditModal = (a: Addon) => {
    setEditingAddon(a);
    setFormData({
      title: a.title,
      slug: a.slug,
      category: a.category,
      description: a.description || "",
      pricePKR: Math.round(a.priceMinor / 100),
      image: a.image || "/images/themes/theme_lavender_dream.jpg",
      isActive: a.isActive,
      sortOrder: a.sortOrder,
    });
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug && editingAddon ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    }));
  };

  const handleSaveAddon = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMessage("");

    try {
      if (!formData.title || !formData.slug || !formData.pricePKR) {
        throw new Error("Title, slug, and price are required.");
      }

      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        category: formData.category,
        description: formData.description ? formData.description.trim() : null,
        priceMinor: Math.round(formData.pricePKR * 100),
        image: formData.image,
        isActive: formData.isActive,
        sortOrder: Number(formData.sortOrder) || 0,
      };

      if (editingAddon) {
        const res = await fetch("/api/admin/addons", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingAddon.id, ...payload }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to update add-on.");
        showToast("Add-on updated successfully.");
      } else {
        const res = await fetch("/api/admin/addons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to create add-on.");
        showToast("New add-on added to booking engine.");
      }

      setIsFormOpen(false);
      fetchAddons();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const toggleAddonActive = async (a: Addon) => {
    try {
      const res = await fetch("/api/admin/addons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: a.id, isActive: !a.isActive }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Add-on ${!a.isActive ? "activated" : "deactivated"}.`);
        fetchAddons();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteAddon = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await fetch(`/api/admin/addons?id=${deleteConfirmId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete add-on.");
      showToast("Add-on removed successfully.");
      setDeleteConfirmId(null);
      fetchAddons();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const categories = ["ALL", "Decor", "Photography", "Cake", "Lighting", "Balloons", "Entertainment"];

  const filteredAddons = addons.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.description || "").toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || a.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const totalAddons = addons.length;
  const activeAddons = addons.filter((a) => a.isActive).length;
  const avgPriceMinor =
    totalAddons > 0 ? Math.round(addons.reduce((sum, a) => sum + a.priceMinor, 0) / totalAddons) : 0;

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
            <PlusCircle className="w-4 h-4" />
            <span>Booking Engine Add-ons</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy-950">
            Add-ons Management
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy-600">
            Manage optional celebration enhancements, marquee numbers, pyro effects, and photography selectable during booking.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-gold text-xs px-5 py-2.5 flex items-center justify-center space-x-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Add-on</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-brand-navy-900">
          <span className="text-xs text-brand-navy-600 font-medium">Total Add-ons</span>
          <p className="text-2xl font-serif font-bold text-brand-navy-950">{totalAddons}</p>
          <p className="text-[11px] text-brand-navy-500">In database</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-emerald-600">
          <span className="text-xs text-brand-navy-600 font-medium">Active in Booking Flow</span>
          <p className="text-2xl font-serif font-bold text-emerald-700">{activeAddons}</p>
          <p className="text-[11px] text-brand-navy-500">Selectable by clients</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-brand-gold-500">
          <span className="text-xs text-brand-navy-600 font-medium">Average Add-on Value</span>
          <p className="text-2xl font-serif font-bold text-brand-navy-950">{formatPKR(avgPriceMinor)}</p>
          <p className="text-[11px] text-brand-navy-500">Per booking upsell</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-amber-500">
          <span className="text-xs text-brand-navy-600 font-medium">Categories</span>
          <p className="text-2xl font-serif font-bold text-brand-navy-950">
            {new Set(addons.map((a) => a.category)).size}
          </p>
          <p className="text-[11px] text-brand-navy-500">Decor, pyro, cake, audio</p>
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
              placeholder="Search add-ons..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
            />
          </div>

          <button
            onClick={fetchAddons}
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

      {/* Addons Grid */}
      {loading ? (
        <div className="card-luxury py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-gold-600 animate-spin mx-auto" />
          <p className="text-xs text-brand-navy-600">Loading add-ons from database...</p>
        </div>
      ) : filteredAddons.length === 0 ? (
        <div className="card-luxury py-16 text-center space-y-3">
          <PlusCircle className="w-10 h-10 text-brand-warm-400 mx-auto" />
          <p className="text-sm font-semibold text-brand-navy-950">No add-ons found</p>
          <p className="text-xs text-brand-navy-500">
            {search ? "No add-ons match your search." : "Create your first celebration add-on."}
          </p>
          <button
            onClick={openCreateModal}
            className="btn-gold text-xs px-4 py-2 mt-2 inline-flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Add-on</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAddons.map((a) => (
            <div
              key={a.id}
              className={`card-luxury p-6 flex flex-col justify-between space-y-4 transition-all ${
                !a.isActive ? "opacity-60 bg-brand-warm-100/40" : ""
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="badge-gold bg-brand-navy-950 text-brand-gold-300 border-none text-[10px] px-2.5 py-0.5">
                    {a.category}
                  </span>
                  <span className="font-serif font-bold text-brand-navy-950 text-base">
                    +{formatPKR(a.priceMinor)}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-brand-navy-950 text-base">{a.title}</h3>
                  <p className="text-xs text-brand-navy-600 line-clamp-2 leading-relaxed">
                    {a.description || "Custom celebration upgrade for birthday themes."}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-brand-warm-200 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleAddonActive(a)}
                    className={`w-8 h-4.5 rounded-full transition-colors relative ${
                      a.isActive ? "bg-emerald-600" : "bg-brand-warm-300"
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        a.isActive ? "left-4" : "left-0.5"
                      }`}
                    />
                  </button>
                  <span className="text-[11px] font-semibold text-brand-navy-700">
                    {a.isActive ? "Available" : "Hidden"}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => openEditModal(a)}
                    className="p-1.5 rounded-lg border border-brand-warm-300 text-brand-navy-700 hover:bg-brand-warm-100"
                    title="Edit Add-on"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(a.id)}
                    className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                    title="Delete Add-on"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT ADDON MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-brand-warm-200 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-brand-warm-200 pb-3">
              <h3 className="text-lg font-serif font-bold text-brand-navy-950">
                {editingAddon ? "Edit Add-on" : "Create New Add-on"}
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

            <form onSubmit={handleSaveAddon} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">Add-on Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Giant 4-Foot Light-Up Marquee Numbers"
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-navy-900 mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="marquee-numbers"
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
                    <option value="Decor">Decor</option>
                    <option value="Photography">Photography</option>
                    <option value="Cake">Cake & Bakery</option>
                    <option value="Lighting">Lighting & Pyro</option>
                    <option value="Balloons">Balloons</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">Price in PKR *</label>
                <input
                  type="number"
                  required
                  min={0}
                  step={500}
                  value={formData.pricePKR}
                  onChange={(e) => setFormData({ ...formData, pricePKR: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description shown during online booking..."
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="addonActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-brand-gold-600 rounded"
                  />
                  <label htmlFor="addonActive" className="font-semibold text-brand-navy-900">
                    Active in Booking Flow
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-brand-navy-700">Display Order:</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                    className="w-16 p-1.5 rounded-lg border border-brand-warm-300 text-center"
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
                  <span>{editingAddon ? "Save Changes" : "Create Add-on"}</span>
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
              Delete Add-on?
            </h3>
            <p className="text-xs text-brand-navy-600 leading-relaxed">
              Are you sure you want to delete this add-on? It will immediately be removed from the online booking engine.
            </p>
            <div className="pt-2 flex justify-center space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-outline-navy text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAddon}
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
