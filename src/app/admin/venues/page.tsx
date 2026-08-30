"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Building,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  DollarSign,
  MapPin,
  Users,
  AlertCircle,
  X,
  Loader2,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { formatPKR } from "@/lib/utils";

interface Venue {
  id: string;
  slug: string;
  name: string;
  city: string;
  address: string;
  capacity: number;
  venueType: string;
  feeMinor: number;
  currency: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  _count?: { bookings: number };
}

export default function AdminVenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("ALL");

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    city: "Islamabad",
    address: "",
    capacity: 100,
    venueType: "Indoor Luxury Banquet",
    feePKR: 50000,
    description: "",
    isActive: true,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/venues");
      const json = await res.json();
      if (json.success) {
        setVenues(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load venues:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const openCreateModal = () => {
    setEditingVenue(null);
    setFormData({
      name: "",
      slug: "",
      city: "Islamabad",
      address: "",
      capacity: 100,
      venueType: "Indoor Luxury Banquet",
      feePKR: 45000,
      description: "",
      isActive: true,
    });
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const openEditModal = (v: Venue) => {
    setEditingVenue(v);
    setFormData({
      name: v.name,
      slug: v.slug,
      city: v.city,
      address: v.address,
      capacity: v.capacity,
      venueType: v.venueType,
      feePKR: Math.round(v.feeMinor / 100),
      description: v.description || "",
      isActive: v.isActive,
    });
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug && editingVenue ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    }));
  };

  const handleSaveVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMessage("");

    try {
      if (!formData.name || !formData.slug || !formData.address) {
        throw new Error("Venue name, slug, and address are required.");
      }

      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        city: formData.city,
        address: formData.address.trim(),
        capacity: Number(formData.capacity) || 100,
        venueType: formData.venueType,
        feeMinor: Math.round(formData.feePKR * 100),
        description: formData.description ? formData.description.trim() : null,
        isActive: formData.isActive,
      };

      if (editingVenue) {
        const res = await fetch("/api/admin/venues", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingVenue.id, ...payload }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to update venue.");
        showToast("Venue record updated.");
      } else {
        const res = await fetch("/api/admin/venues", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to create venue.");
        showToast("New partner venue added.");
      }

      setIsFormOpen(false);
      fetchVenues();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const toggleVenueActive = async (v: Venue) => {
    try {
      const res = await fetch("/api/admin/venues", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: v.id, isActive: !v.isActive }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Venue ${!v.isActive ? "activated" : "deactivated"}.`);
        fetchVenues();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteVenue = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await fetch(`/api/admin/venues?id=${deleteConfirmId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete venue.");
      showToast(json.message || "Venue removed successfully.");
      setDeleteConfirmId(null);
      fetchVenues();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredVenues = venues.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.address.toLowerCase().includes(search.toLowerCase()) ||
      v.venueType.toLowerCase().includes(search.toLowerCase());
    const matchesCity = cityFilter === "ALL" || v.city.toLowerCase() === cityFilter.toLowerCase();
    return matchesSearch && matchesCity;
  });

  const totalVenues = venues.length;
  const islamabadVenues = venues.filter((v) => v.city.toLowerCase() === "islamabad").length;
  const rawalpindiVenues = venues.filter((v) => v.city.toLowerCase() === "rawalpindi").length;

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
            <Building className="w-4 h-4" />
            <span>Operations & Partner Venues</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy-950">
            Venue Management
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy-600">
            Manage partner banquet halls, Margalla terrace lawns, and private farmhouse setup options across Islamabad & Rawalpindi.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-gold text-xs px-5 py-2.5 flex items-center justify-center space-x-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Venue</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-brand-navy-900">
          <span className="text-xs text-brand-navy-600 font-medium">Total Venues</span>
          <p className="text-2xl font-serif font-bold text-brand-navy-950">{totalVenues}</p>
          <p className="text-[11px] text-brand-navy-500">Partner & Residence spaces</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-brand-gold-500">
          <span className="text-xs text-brand-navy-600 font-medium">Islamabad Locations</span>
          <p className="text-2xl font-serif font-bold text-brand-navy-950">{islamabadVenues}</p>
          <p className="text-[11px] text-brand-navy-500">F-Sectors, Club Road, Margalla</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-emerald-600">
          <span className="text-xs text-brand-navy-600 font-medium">Rawalpindi Locations</span>
          <p className="text-2xl font-serif font-bold text-emerald-700">{rawalpindiVenues}</p>
          <p className="text-[11px] text-brand-navy-500">Bahria Town, DHA, Cantt</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-amber-500">
          <span className="text-xs text-brand-navy-600 font-medium">Active on Public Site</span>
          <p className="text-2xl font-serif font-bold text-amber-700">
            {venues.filter((v) => v.isActive).length}
          </p>
          <p className="text-[11px] text-brand-navy-500">Bookable online</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card-luxury p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-brand-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search venue name, address, type..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <div className="flex items-center space-x-1.5 text-xs text-brand-navy-700">
            <span className="font-semibold">City:</span>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-brand-warm-300 text-xs bg-white focus:outline-none"
            >
              <option value="ALL">All Cities</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Rawalpindi">Rawalpindi</option>
            </select>
          </div>

          <button
            onClick={fetchVenues}
            className="p-2 rounded-lg border border-brand-warm-300 text-brand-navy-600 hover:bg-brand-warm-100 transition-colors"
            title="Refresh List"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Venues Grid */}
      {loading ? (
        <div className="card-luxury py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-gold-600 animate-spin mx-auto" />
          <p className="text-xs text-brand-navy-600">Loading partner venues from database...</p>
        </div>
      ) : filteredVenues.length === 0 ? (
        <div className="card-luxury py-16 text-center space-y-3">
          <Building className="w-10 h-10 text-brand-warm-400 mx-auto" />
          <p className="text-sm font-semibold text-brand-navy-950">No venues found</p>
          <p className="text-xs text-brand-navy-500">
            {search ? "No venues match your filters." : "Add your first partner venue."}
          </p>
          <button
            onClick={openCreateModal}
            className="btn-gold text-xs px-4 py-2 mt-2 inline-flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Venue</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVenues.map((v) => (
            <div
              key={v.id}
              className={`card-luxury flex flex-col justify-between overflow-hidden transition-all ${
                !v.isActive ? "opacity-60 bg-brand-warm-100/40" : ""
              }`}
            >
              <div>
                <div className="p-6 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="badge-gold bg-brand-navy-950 text-brand-gold-300 border-none text-[10px] px-2.5 py-0.5">
                        {v.city}
                      </span>
                      <h3 className="text-lg font-serif font-bold text-brand-navy-950 mt-1.5">{v.name}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-brand-navy-500 block">Venue Fee</span>
                      <span className="font-serif font-bold text-brand-navy-950 text-base">
                        {v.feeMinor > 0 ? formatPKR(v.feeMinor) : "Free / Home"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-brand-navy-600 flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-brand-gold-600 mr-1.5 shrink-0" />
                    <span>{v.address}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-brand-warm-50/70 p-3 rounded-xl border border-brand-warm-200">
                    <div>
                      <span className="text-[10px] text-brand-navy-500 block">Space Type</span>
                      <span className="font-semibold text-brand-navy-900">{v.venueType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-navy-500 block">Guest Capacity</span>
                      <span className="font-semibold text-brand-navy-900">Up to {v.capacity} Guests</span>
                    </div>
                  </div>

                  <p className="text-xs text-brand-navy-700 leading-relaxed line-clamp-2">
                    {v.description || "Turnkey party styling & equipment rigging available for this venue."}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-brand-warm-200 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleVenueActive(v)}
                    className={`w-8 h-4.5 rounded-full transition-colors relative ${
                      v.isActive ? "bg-emerald-600" : "bg-brand-warm-300"
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        v.isActive ? "left-4" : "left-0.5"
                      }`}
                    />
                  </button>
                  <span className="text-[11px] font-semibold text-brand-navy-700">
                    {v.isActive ? "Active / Bookable" : "Hidden"}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => openEditModal(v)}
                    className="p-1.5 rounded-lg border border-brand-warm-300 text-brand-navy-700 hover:bg-brand-warm-100"
                    title="Edit Venue"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(v.id)}
                    className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                    title="Deactivate / Delete Venue"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT VENUE MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-brand-warm-200 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-brand-warm-200 pb-3">
              <h3 className="text-lg font-serif font-bold text-brand-navy-950">
                {editingVenue ? "Edit Venue Record" : "Add New Partner Venue"}
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

            <form onSubmit={handleSaveVenue} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">Venue Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Islamabad Club & Marquee Suites"
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
                    placeholder="islamabad-club-banquets"
                    className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-navy-900 mb-1">City *</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-navy-900 mb-1">Venue Type</label>
                  <select
                    value={formData.venueType}
                    onChange={(e) => setFormData({ ...formData, venueType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                  >
                    <option value="Indoor Luxury Banquet">Indoor Luxury Banquet</option>
                    <option value="Outdoor Scenic Terrace">Outdoor Scenic Terrace</option>
                    <option value="Garden & Gazebo Hall">Garden & Gazebo Hall</option>
                    <option value="Home / Private Space">Home / Private Space</option>
                    <option value="Farmhouse Suite">Farmhouse Suite</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-brand-navy-900 mb-1">Max Capacity (Guests)</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-brand-navy-900 mb-1">Address / Landmark *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. Main Murree Road, Near Club Road, Islamabad"
                    className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-brand-navy-900 mb-1">Venue Fee in PKR (0 for Free/Home)</label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={formData.feePKR}
                    onChange={(e) => setFormData({ ...formData, feePKR: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">Description & Amenities</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Key features, AC, lighting, valet parking, lawn access..."
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="venueActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-brand-gold-600 rounded"
                />
                <label htmlFor="venueActive" className="font-semibold text-brand-navy-900">
                  Active & Available for Online Booking
                </label>
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
                  <span>{editingVenue ? "Save Changes" : "Create Venue"}</span>
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
              Deactivate / Delete Venue?
            </h3>
            <p className="text-xs text-brand-navy-600 leading-relaxed">
              If this venue has linked historical bookings, it will be deactivated safely without deleting past event records.
            </p>
            <div className="pt-2 flex justify-center space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-outline-navy text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVenue}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Confirm Deactivation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
