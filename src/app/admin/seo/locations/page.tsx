"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  RefreshCw,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { SeoFormSection } from "@/components/admin/SeoFormSection";

interface LocationPageItem {
  id: string;
  name: string;
  slug: string;
  city: string;
  headline: string;
  subheadline?: string;
  introContent: string;
  coverageAreas: string;
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  secondaryKeywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex: boolean;
  noFollow: boolean;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminSeoLocationsPage() {
  const [locations, setLocations] = useState<LocationPageItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<LocationPageItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState<any>({
    name: "",
    slug: "",
    city: "Islamabad",
    headline: "",
    subheadline: "",
    introContent: "",
    coverageAreas: "",
    featuredImage: "",
    seoTitle: "",
    seoDescription: "",
    focusKeyword: "",
    secondaryKeywords: "",
    canonicalUrl: "",
    ogImage: "",
    noIndex: false,
    noFollow: false,
    sortOrder: 0,
    isActive: true,
  });

  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/seo/locations");
      const json = await res.json();
      if (json.success) {
        setLocations(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load locations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const openCreateModal = () => {
    setEditingLocation(null);
    setFormData({
      name: "",
      slug: "",
      city: "Islamabad",
      headline: "",
      subheadline: "",
      introContent: "",
      coverageAreas: "Sector F-6, Sector F-7, Sector F-8, Sector E-11",
      featuredImage: "/images/hero/hero_birthday_lawn.jpg",
      seoTitle: "",
      seoDescription: "",
      focusKeyword: "",
      secondaryKeywords: "",
      canonicalUrl: "",
      ogImage: "",
      noIndex: false,
      noFollow: false,
      sortOrder: locations.length + 1,
      isActive: true,
    });
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const openEditModal = (loc: LocationPageItem) => {
    setEditingLocation(loc);
    let coverageStr = loc.coverageAreas;
    try {
      const parsed = JSON.parse(loc.coverageAreas);
      if (Array.isArray(parsed)) coverageStr = parsed.join(", ");
    } catch (e) {}

    setFormData({
      name: loc.name,
      slug: loc.slug,
      city: loc.city,
      headline: loc.headline,
      subheadline: loc.subheadline || "",
      introContent: loc.introContent || "",
      coverageAreas: coverageStr,
      featuredImage: loc.featuredImage || "",
      seoTitle: loc.seoTitle || "",
      seoDescription: loc.seoDescription || "",
      focusKeyword: loc.focusKeyword || "",
      secondaryKeywords: loc.secondaryKeywords || "",
      canonicalUrl: loc.canonicalUrl || "",
      ogImage: loc.ogImage || "",
      noIndex: loc.noIndex,
      noFollow: loc.noFollow,
      sortOrder: loc.sortOrder,
      isActive: loc.isActive,
    });
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMessage("");

    try {
      if (!formData.name || !formData.slug || !formData.headline) {
        throw new Error("Name, URL Slug, and Headline are required.");
      }

      const coverageArray = formData.coverageAreas
        ? formData.coverageAreas.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        ...formData,
        coverageAreas: JSON.stringify(coverageArray),
      };

      if (editingLocation) {
        const res = await fetch("/api/admin/seo/locations", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingLocation.id, ...payload }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to update location.");
        showToast(`Location hub "${formData.name}" updated.`);
      } else {
        const res = await fetch("/api/admin/seo/locations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to create location.");
        showToast("New Location Hub published.");
      }

      setIsFormOpen(false);
      fetchLocations();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteLocation = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await fetch(`/api/admin/seo/locations?id=${deleteConfirmId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete location.");
      showToast("Location Hub deleted.");
      setDeleteConfirmId(null);
      fetchLocations();
    } catch (err: any) {
      alert(err.message);
    }
  };

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
            <Link href="/admin/seo" className="hover:underline flex items-center space-x-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to SEO Dashboard</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy-950">
            Local SEO Landing Hubs
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy-600">
            Manage dedicated local landing pages for Islamabad, Rawalpindi, Bahria Town, DHA, and key residential sectors.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={openCreateModal}
            className="btn-gold text-xs px-5 py-2.5 flex items-center justify-center space-x-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Location Hub</span>
          </button>
          <button
            onClick={fetchLocations}
            className="p-2.5 rounded-xl border border-brand-warm-300 text-brand-navy-700 hover:bg-brand-warm-100"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Location Cards Grid */}
      {loading ? (
        <div className="card-luxury py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-gold-600 animate-spin mx-auto" />
          <p className="text-xs text-brand-navy-600">Loading location landing hubs...</p>
        </div>
      ) : locations.length === 0 ? (
        <div className="card-luxury py-16 text-center space-y-3">
          <MapPin className="w-10 h-10 text-brand-warm-400 mx-auto" />
          <p className="text-sm font-semibold text-brand-navy-950">No Location Hubs configured</p>
          <p className="text-xs text-brand-navy-500">Create localized landing pages to rank for city and sector searches.</p>
          <button
            onClick={openCreateModal}
            className="btn-gold text-xs px-4 py-2 mt-2 inline-flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Location</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locations.map((loc) => {
            let parsedCoverage: string[] = [];
            try {
              parsedCoverage = JSON.parse(loc.coverageAreas);
            } catch (e) {}

            return (
              <div
                key={loc.id}
                className="card-luxury p-6 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="badge-gold bg-brand-navy-950 text-brand-gold-300 text-[10px] px-2 py-0.5">
                      {loc.city} Zone
                    </span>
                    <div className="flex items-center space-x-2">
                      <a
                        href={`/locations/${loc.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-brand-gold-700 hover:underline flex items-center space-x-1"
                      >
                        <span>View Page</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-serif font-bold text-brand-navy-950">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-brand-navy-600 font-mono">
                      /locations/{loc.slug}
                    </p>
                  </div>

                  <p className="text-xs text-brand-navy-800 line-clamp-2">
                    {loc.headline}
                  </p>

                  {/* Coverage tags */}
                  {parsedCoverage.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {parsedCoverage.slice(0, 5).map((area, i) => (
                        <span
                          key={i}
                          className="bg-brand-warm-100 text-brand-navy-800 text-[10px] font-medium px-2 py-0.5 rounded-md border border-brand-warm-300"
                        >
                          {area}
                        </span>
                      ))}
                      {parsedCoverage.length > 5 && (
                        <span className="text-[10px] text-brand-navy-500 self-center">
                          +{parsedCoverage.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-brand-warm-200 flex items-center justify-between">
                  <div className="text-[11px] text-brand-navy-600">
                    <span className="font-semibold">Focus:</span> {loc.focusKeyword || "—"}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditModal(loc)}
                      className="btn-gold text-xs px-3 py-1.5 flex items-center space-x-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit Hub</span>
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(loc.id)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                      title="Delete Hub"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT LOCATION MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-2xl border border-brand-warm-200 animate-scale-in max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-brand-warm-200 pb-3">
              <h3 className="text-lg font-serif font-bold text-brand-navy-950">
                {editingLocation ? `Edit Location: ${editingLocation.name}` : "Create Location Hub"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-brand-navy-400 hover:text-brand-navy-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveLocation} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-brand-navy-900 mb-1">
                    Location Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData({
                        ...formData,
                        name,
                        slug: formData.slug || name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
                      });
                    }}
                    placeholder="e.g. Islamabad"
                    className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-navy-900 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. islamabad"
                    className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-navy-900 mb-1">
                    Primary City *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                  >
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">
                  Headline (H1 Tag) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="Premier Birthday Decoration & Event Planning in Islamabad"
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white font-serif text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">
                  Subheadline / Short Intro
                </label>
                <input
                  type="text"
                  value={formData.subheadline}
                  onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
                  placeholder="Turnkey birthday setups delivered to Sector F-6, F-7, F-8, E-11 & Bahria Town."
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">
                  Coverage Sectors / Neighborhoods (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.coverageAreas}
                  onChange={(e) => setFormData({ ...formData, coverageAreas: e.target.value })}
                  placeholder="Sector F-6, Sector F-7, Sector F-8, Sector E-11, Bani Gala, Chak Shahzad"
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">
                  Detailed Intro Content (Rich Copy)
                </label>
                <textarea
                  rows={3}
                  value={formData.introContent}
                  onChange={(e) => setFormData({ ...formData, introContent: e.target.value })}
                  placeholder="Comprehensive description of mobile party setup crews, themes, and services available in this zone..."
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              {/* SEO Form Section */}
              <SeoFormSection
                formData={formData}
                onChange={(field, value) => setFormData({ ...formData, [field]: value })}
                entityType="Location Hub"
              />

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
                  className="btn-gold px-6 py-2 font-bold flex items-center space-x-2"
                >
                  {formLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingLocation ? "Save Hub Changes" : "Publish Location"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-brand-warm-200 text-center animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-brand-navy-950">
              Delete Location Hub?
            </h3>
            <p className="text-xs text-brand-navy-600 leading-relaxed">
              Are you sure you want to delete this location landing page? The public route will no longer be available.
            </p>
            <div className="pt-2 flex justify-center space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-outline-navy text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLocation}
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
