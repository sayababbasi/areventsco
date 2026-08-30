"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  Loader2,
  Eye,
  RefreshCw,
  Users,
  Clock,
  Sparkles,
} from "lucide-react";
import ImageUploadDropzone from "@/components/admin/ImageUploadDropzone";
import { formatPKR } from "@/lib/utils";

interface PackageItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  basePriceMinor: number;
  guestCapacityMin: number;
  guestCapacityMax: number;
  estimatedDurationHours: number;
  featuredImage?: string;
  features: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  _count?: { bookings: number };
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPricePKR, setFormPricePKR] = useState(45000);
  const [formCapMin, setFormCapMin] = useState(15);
  const [formCapMax, setFormCapMax] = useState(50);
  const [formDuration, setFormDuration] = useState(4);
  const [formImage, setFormImage] = useState("/images/themes/theme_royal_midnight_prince.jpg");
  const [formFeatures, setFormFeatures] = useState(
    "Full Backdrop Setup, Organic Balloon Arch, 3 Plinths, LED Number Lights, 3 Hours On-Site Styling"
  );
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsActive, setFormIsActive] = useState(true);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/packages");
      const json = await res.json();
      if (json.success) {
        setPackages(json.data);
      }
    } catch (err) {
      console.error("Fetch packages error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormTitle("");
    setFormSlug("");
    setFormSubtitle("");
    setFormDescription("");
    setFormPricePKR(45000);
    setFormCapMin(15);
    setFormCapMax(50);
    setFormDuration(4);
    setFormImage("/images/themes/theme_royal_midnight_prince.jpg");
    setFormFeatures(
      "Full Backdrop Setup, Organic Balloon Arch, 3 Plinths, LED Number Lights, 3 Hours On-Site Styling"
    );
    setFormIsFeatured(false);
    setFormIsActive(true);
    setModalError("");
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: PackageItem) => {
    setIsEditing(true);
    setEditId(pkg.id);
    setFormTitle(pkg.title);
    setFormSlug(pkg.slug);
    setFormSubtitle(pkg.subtitle || "");
    setFormDescription(pkg.description);
    setFormPricePKR(Math.round(pkg.basePriceMinor / 100));
    setFormCapMin(pkg.guestCapacityMin);
    setFormCapMax(pkg.guestCapacityMax);
    setFormDuration(pkg.estimatedDurationHours);
    setFormImage(pkg.featuredImage || "/images/themes/theme_royal_midnight_prince.jpg");

    let featStr = "";
    try {
      const parsed = JSON.parse(pkg.features || "[]");
      featStr = Array.isArray(parsed) ? parsed.join(", ") : pkg.features;
    } catch {
      featStr = pkg.features || "";
    }
    setFormFeatures(featStr);

    setFormIsFeatured(pkg.isFeatured);
    setFormIsActive(pkg.isActive);
    setModalError("");
    setIsModalOpen(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setIsSaving(true);

    try {
      const featureArray = formFeatures.split(",").map((f) => f.trim()).filter(Boolean);

      const payload = {
        id: editId,
        title: formTitle,
        slug: formSlug || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        subtitle: formSubtitle,
        description: formDescription,
        basePriceMinor: formPricePKR * 100,
        guestCapacityMin: Number(formCapMin),
        guestCapacityMax: Number(formCapMax),
        estimatedDurationHours: Number(formDuration),
        featuredImage: formImage,
        features: JSON.stringify(featureArray),
        isFeatured: formIsFeatured,
        isActive: formIsActive,
      };

      const res = await fetch("/api/admin/packages", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) {
        setModalError(json.error || "Failed to save package.");
        setIsSaving(false);
        return;
      }

      setIsModalOpen(false);
      fetchPackages();
    } catch (err: any) {
      setModalError(err.message || "An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePackage = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete or deactivate "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/packages?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchPackages();
      } else {
        alert(json.error || "Failed to delete package.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete package.");
    }
  };

  const filteredPackages = packages.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-warm-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-brand-gold-600 uppercase tracking-wider font-semibold">
            <Package className="w-3.5 h-3.5" />
            <span>Catalog Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-brand-navy-950 font-bold mt-1">
            Birthday & Event Packages
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy-600 mt-1">
            Control service packages, base pricing, guest capacity, and inclusions across Islamabad & Rawalpindi.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchPackages}
            className="p-2.5 rounded-xl border border-brand-warm-300 bg-white text-brand-navy-700 hover:bg-brand-warm-100 transition-colors text-xs font-medium flex items-center space-x-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button onClick={openCreateModal} className="btn-gold flex items-center space-x-2 text-xs py-2.5 px-4 shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Create New Package</span>
          </button>
        </div>
      </div>

      {/* 2. SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-brand-warm-200 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-brand-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search packages by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-brand-warm-50/50 border border-brand-warm-200 rounded-xl text-xs text-brand-navy-950 placeholder:text-brand-navy-400 focus:outline-none focus:border-brand-gold-500"
          />
        </div>
      </div>

      {/* 3. PACKAGES LIST */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-gold-600" />
          <p className="text-xs text-brand-navy-600">Loading database packages...</p>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-brand-warm-200 text-center space-y-4 shadow-sm">
          <Package className="w-12 h-12 text-brand-warm-400 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-brand-navy-950">No Packages Found</h3>
          <p className="text-xs text-brand-navy-600 max-w-md mx-auto">
            No packages have been created in the database yet.
          </p>
          <button onClick={openCreateModal} className="btn-gold text-xs py-2 px-4 inline-flex items-center space-x-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Package</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => {
            let features: string[] = [];
            try {
              features = JSON.parse(pkg.features || "[]");
            } catch {
              features = [];
            }

            return (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl border border-brand-warm-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-brand-gold-400/80 transition-all"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-brand-navy-950">{pkg.title}</h3>
                      {pkg.subtitle && <p className="text-xs text-brand-gold-700 font-medium">{pkg.subtitle}</p>}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        pkg.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {pkg.isActive ? "Published" : "Draft"}
                    </span>
                  </div>

                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-bold font-serif text-brand-navy-950">
                      {formatPKR(pkg.basePriceMinor)}
                    </span>
                    <span className="text-xs text-brand-navy-500 font-medium">starting</span>
                  </div>

                  <p className="text-xs text-brand-navy-600 line-clamp-2 leading-relaxed">{pkg.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-brand-navy-700 pt-2 border-t border-brand-warm-100">
                    <div className="flex items-center space-x-1.5">
                      <Users className="w-3.5 h-3.5 text-brand-gold-600" />
                      <span>{pkg.guestCapacityMin} - {pkg.guestCapacityMax} Guests</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-gold-600" />
                      <span>{pkg.estimatedDurationHours} Hours Setup</span>
                    </div>
                  </div>

                  {features.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-navy-400">Included:</p>
                      <ul className="space-y-1 text-xs text-brand-navy-700">
                        {features.slice(0, 4).map((f, i) => (
                          <li key={i} className="flex items-center space-x-1.5">
                            <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                            <span className="truncate">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="p-3.5 border-t border-brand-warm-100 bg-brand-warm-50/50 flex items-center justify-between">
                  <Link
                    href="/packages"
                    target="_blank"
                    className="text-xs font-semibold text-brand-gold-700 hover:text-brand-gold-800 flex items-center space-x-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View on Site</span>
                  </Link>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => openEditModal(pkg)}
                      className="p-1.5 rounded-lg border border-brand-warm-300 bg-white text-brand-navy-700 hover:bg-brand-warm-100 transition-colors"
                      title="Edit Package"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id, pkg.title)}
                      className="p-1.5 rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Package"
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
                {isEditing ? "Edit Package" : "Create New Package"}
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

            <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-brand-navy-900 mb-1">Package Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Royal Celebration"
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
                  <label className="block font-bold text-brand-navy-900 mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-brand-navy-950 focus:outline-none focus:border-brand-gold-500 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-navy-900 mb-1">Subtitle / Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Luxury 1st Birthday"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-brand-navy-950 focus:outline-none focus:border-brand-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-brand-navy-900 mb-1">Starting Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={formPricePKR}
                    onChange={(e) => setFormPricePKR(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-brand-navy-950 focus:outline-none focus:border-brand-gold-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-navy-900 mb-1">Guest Capacity</label>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      value={formCapMin}
                      onChange={(e) => setFormCapMin(Number(e.target.value))}
                      className="w-full px-2 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-center text-xs"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={formCapMax}
                      onChange={(e) => setFormCapMax(Number(e.target.value))}
                      className="w-full px-2 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-center text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-brand-navy-900 mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-brand-navy-950 focus:outline-none focus:border-brand-gold-500"
                  />
                </div>
              </div>

              <div>
                <ImageUploadDropzone
                  value={formImage}
                  onChange={(url) => setFormImage(url)}
                  folder="packages"
                  altText={formTitle || "AR Events Co Package"}
                  label="Package Cover Image (Supabase Storage)"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-navy-900 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-brand-navy-950 focus:outline-none focus:border-brand-gold-500"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-navy-900 mb-1">Included Features (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Full Backdrop Setup, Organic Balloon Arch, 3 Plinths, LED Number Lights"
                  value={formFeatures}
                  onChange={(e) => setFormFeatures(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-brand-navy-950 focus:outline-none focus:border-brand-gold-500"
                />
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="rounded text-brand-gold-600 focus:ring-brand-gold-500"
                  />
                  <span className="font-bold text-brand-navy-900">Featured Package</span>
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
                  <span>{isEditing ? "Update Package" : "Create & Publish"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
