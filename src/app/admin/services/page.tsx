"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Wrench,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  DollarSign,
  Camera,
  Cake,
  Smile,
  Music,
  Utensils,
  Sparkles,
  AlertCircle,
  X,
  Eye,
  Loader2,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import ImageUploadDropzone from "@/components/admin/ImageUploadDropzone";
import { formatPKR } from "@/lib/utils";

interface Service {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  priceType: string;
  basePriceMinor: number;
  currency: string;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Modal / Drawer state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Decoration",
    description: "",
    priceType: "FIXED",
    basePricePKR: 25000,
    image: "/images/themes/theme_lavender_dream.jpg",
    isActive: true,
    sortOrder: 0,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      const json = await res.json();
      if (json.success) {
        setServices(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      title: "",
      slug: "",
      category: "Decoration",
      description: "",
      priceType: "FIXED",
      basePricePKR: 20000,
      image: "/images/themes/theme_lavender_dream.jpg",
      isActive: true,
      sortOrder: services.length + 1,
    });
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const openEditModal = (s: Service) => {
    setEditingService(s);
    setFormData({
      title: s.title,
      slug: s.slug,
      category: s.category,
      description: s.description,
      priceType: s.priceType,
      basePricePKR: Math.round(s.basePriceMinor / 100),
      image: s.image || "/images/themes/theme_lavender_dream.jpg",
      isActive: s.isActive,
      sortOrder: s.sortOrder,
    });
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug && editingService ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    }));
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMessage("");

    try {
      if (!formData.title || !formData.slug || !formData.description) {
        throw new Error("Title, slug, and description are required.");
      }

      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        category: formData.category,
        description: formData.description.trim(),
        priceType: formData.priceType,
        basePriceMinor: Math.round(formData.basePricePKR * 100),
        image: formData.image,
        isActive: formData.isActive,
        sortOrder: Number(formData.sortOrder) || 0,
      };

      if (editingService) {
        const res = await fetch("/api/admin/services", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingService.id, ...payload }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to update service.");
        showToast("Service updated successfully.");
      } else {
        const res = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to create service.");
        showToast("New service added to catalog.");
      }

      setIsFormOpen(false);
      fetchServices();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const toggleServiceActive = async (s: Service) => {
    try {
      const res = await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: s.id, isActive: !s.isActive }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Service ${!s.isActive ? "activated" : "deactivated"}.`);
        fetchServices();
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update service.");
    }
  };

  const handleDeleteService = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await fetch(`/api/admin/services?id=${deleteConfirmId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete service.");
      showToast("Service deleted successfully.");
      setDeleteConfirmId(null);
      fetchServices();
    } catch (err: any) {
      showToast(err.message || "Failed to delete service.");
    }
  };

  const categories = ["ALL", "Decoration", "Photography", "Cake", "Entertainment", "Catering", "Sound & Lighting"];

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || s.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const totalServices = services.length;
  const activeServices = services.filter((s) => s.isActive).length;

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
            <Wrench className="w-4 h-4" />
            <span>Catalog Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy-950">
            Services Management
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy-600">
            Manage a la carte event services, photography, custom cakes, sound systems, and entertainment for Islamabad & Rawalpindi.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-gold text-xs px-5 py-2.5 flex items-center justify-center space-x-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-brand-navy-900">
          <span className="text-xs text-brand-navy-600 font-medium">Total Services</span>
          <p className="text-2xl font-serif font-bold text-brand-navy-950">{totalServices}</p>
          <p className="text-[11px] text-brand-navy-500">In platform database</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-emerald-600">
          <span className="text-xs text-brand-navy-600 font-medium">Active & Bookable</span>
          <p className="text-2xl font-serif font-bold text-emerald-700">{activeServices}</p>
          <p className="text-[11px] text-brand-navy-500">Visible on public website</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-brand-gold-500">
          <span className="text-xs text-brand-navy-600 font-medium">Categories Covered</span>
          <p className="text-2xl font-serif font-bold text-brand-navy-950">
            {new Set(services.map((s) => s.category)).size}
          </p>
          <p className="text-[11px] text-brand-navy-500">Decoration, media, food, shows</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-amber-500">
          <span className="text-xs text-brand-navy-600 font-medium">Pricing Types</span>
          <p className="text-2xl font-serif font-bold text-brand-navy-950">Fixed & Custom</p>
          <p className="text-[11px] text-brand-navy-500">PKR Currency minor units</p>
        </div>
      </div>

      {/* Category Filter Pills & Search */}
      <div className="card-luxury p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-brand-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
            />
          </div>

          <button
            onClick={fetchServices}
            className="p-2 rounded-lg border border-brand-warm-300 text-brand-navy-600 hover:bg-brand-warm-100 transition-colors ml-auto"
            title="Refresh Services"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Category Pills */}
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

      {/* Services Grid */}
      {loading ? (
        <div className="card-luxury py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-gold-600 animate-spin mx-auto" />
          <p className="text-xs text-brand-navy-600">Loading services from database...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="card-luxury py-16 text-center space-y-3">
          <Wrench className="w-10 h-10 text-brand-warm-400 mx-auto" />
          <p className="text-sm font-semibold text-brand-navy-950">No services found</p>
          <p className="text-xs text-brand-navy-500">
            {search ? "No services match your query." : "Add your first event service."}
          </p>
          <button
            onClick={openCreateModal}
            className="btn-gold text-xs px-4 py-2 mt-2 inline-flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Service</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((s) => (
            <div
              key={s.id}
              className={`card-luxury flex flex-col justify-between overflow-hidden transition-all ${
                !s.isActive ? "opacity-60 bg-brand-warm-100/40" : ""
              }`}
            >
              <div>
                <div className="relative h-44 w-full bg-brand-warm-100 overflow-hidden">
                  <Image
                    src={s.image || "/images/themes/theme_lavender_dream.jpg"}
                    alt={s.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="badge-gold bg-brand-navy-950/90 text-brand-gold-300 border-brand-gold-400 text-xs">
                      {s.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="font-bold text-sm font-serif">
                      {s.priceType === "CUSTOM" ? "Custom Quote" : formatPKR(s.basePriceMinor)}
                    </span>
                    <span className="text-[10px] font-mono bg-black/40 px-2 py-0.5 rounded border border-white/20">
                      {s.priceType}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-serif font-bold text-brand-navy-950 text-base">{s.title}</h3>
                  <p className="text-xs text-brand-navy-600 line-clamp-3 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 space-y-3">
                <div className="flex items-center justify-between pt-3 border-t border-brand-warm-200 text-xs">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleServiceActive(s)}
                      className={`w-8 h-4.5 rounded-full transition-colors relative ${
                        s.isActive ? "bg-emerald-600" : "bg-brand-warm-300"
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                          s.isActive ? "left-4" : "left-0.5"
                        }`}
                      />
                    </button>
                    <span className="text-[11px] font-semibold text-brand-navy-700">
                      {s.isActive ? "Published" : "Draft"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => openEditModal(s)}
                      className="p-1.5 rounded-lg border border-brand-warm-300 text-brand-navy-700 hover:bg-brand-warm-100"
                      title="Edit Service"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(s.id)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                      title="Delete Service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT SERVICE MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-brand-warm-200 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-brand-warm-200 pb-3">
              <h3 className="text-lg font-serif font-bold text-brand-navy-950">
                {editingService ? "Edit Service" : "Create New Service"}
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

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. 4K Cinematic Video Reel & Highlights"
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-navy-900 mb-1">Slug (URL identifier) *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="cinematic-video-reel"
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
                    <option value="Decoration">Decoration</option>
                    <option value="Photography">Photography</option>
                    <option value="Cake">Cake & Bakery</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Catering">Catering</option>
                    <option value="Sound & Lighting">Sound & Lighting</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-navy-900 mb-1">Base Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={500}
                    value={formData.basePricePKR}
                    onChange={(e) => setFormData({ ...formData, basePricePKR: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-navy-900 mb-1">Pricing Structure</label>
                  <select
                    value={formData.priceType}
                    onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                  >
                    <option value="FIXED">Fixed Base Price</option>
                    <option value="STARTING_FROM">Starting From</option>
                    <option value="PER_GUEST">Per Guest</option>
                    <option value="HOURLY">Hourly Rate</option>
                    <option value="CUSTOM">Custom Quotation</option>
                  </select>
                </div>
              </div>

              <div>
                <ImageUploadDropzone
                  value={formData.image || ""}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  folder="services"
                  altText={formData.title || "AR Events Co Service"}
                  label="Service Image (Supabase Storage)"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of what is included in this service..."
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="serviceActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-brand-gold-600 rounded"
                  />
                  <label htmlFor="serviceActive" className="font-semibold text-brand-navy-900">
                    Active & Published
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
                  <span>{editingService ? "Save Changes" : "Create Service"}</span>
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
              Delete Service?
            </h3>
            <p className="text-xs text-brand-navy-600 leading-relaxed">
              Are you sure you want to delete this service? It will no longer appear on the public catalog or booking flow.
            </p>
            <div className="pt-2 flex justify-center space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-outline-navy text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteService}
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
