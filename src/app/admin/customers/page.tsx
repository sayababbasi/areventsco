"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  X,
  MessageCircle,
  FileText,
  Building,
  ShieldAlert,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { formatPKR } from "@/lib/utils";

interface Customer {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  emergencyContact: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  totalBookings: number;
  totalSpendMinor: number;
  outstandingMinor: number;
  lastBookingDate: string | null;
  lastBookingReference: string | null;
  bookings: any[];
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [summary, setSummary] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    aggregateSpendMinor: 0,
    aggregateOutstandingMinor: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Drawer / Modal states
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "Islamabad",
    address: "",
    emergencyContact: "",
    notes: "",
    isActive: true,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/customers?city=${cityFilter}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setCustomers(json.data || []);
        if (json.summary) setSummary(json.summary);
      }
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [cityFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const openCreateModal = () => {
    setEditingCustomer(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      city: "Islamabad",
      address: "",
      emergencyContact: "",
      notes: "",
      isActive: true,
    });
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const openEditModal = (c: Customer) => {
    setEditingCustomer(c);
    setFormData({
      name: c.name,
      email: c.email,
      phone: c.phone === "N/A" ? "" : c.phone,
      city: c.city,
      address: c.address === "N/A" ? "" : c.address,
      emergencyContact: c.emergencyContact || "",
      notes: c.notes || "",
      isActive: c.isActive,
    });
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const openDetailDrawer = async (c: Customer) => {
    try {
      const res = await fetch(`/api/admin/customers?id=${c.id}`);
      const json = await res.json();
      if (json.success && json.data) {
        const full = json.data;
        const totalSpendMinor = (full.bookings || []).reduce((sum: number, b: any) => sum + (b.amountPaidMinor || 0), 0);
        const totalBilledMinor = (full.bookings || []).reduce((sum: number, b: any) => sum + (b.totalAmountMinor || 0), 0);
        const outstandingMinor = Math.max(0, totalBilledMinor - totalSpendMinor);

        setSelectedCustomer({
          id: full.id,
          userId: full.userId,
          name: full.user.name,
          email: full.user.email,
          phone: full.user.phone || "N/A",
          city: full.city || "Islamabad",
          address: full.address || "N/A",
          emergencyContact: full.emergencyContact || null,
          notes: full.notes || null,
          isActive: full.user.isActive,
          createdAt: full.createdAt,
          totalBookings: (full.bookings || []).length,
          totalSpendMinor,
          outstandingMinor,
          lastBookingDate: full.bookings?.[0]?.eventDate || null,
          lastBookingReference: full.bookings?.[0]?.reference || null,
          bookings: full.bookings || [],
        });
      } else {
        setSelectedCustomer(c);
      }
    } catch {
      setSelectedCustomer(c);
    }
    setIsDetailOpen(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMessage("");

    try {
      if (!formData.name || !formData.email) {
        throw new Error("Name and email are required fields.");
      }

      if (editingCustomer) {
        // Update
        const res = await fetch("/api/admin/customers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingCustomer.id, ...formData }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to update customer.");
        showToast("Customer profile updated successfully.");
      } else {
        // Create
        const res = await fetch("/api/admin/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to create customer.");
        showToast("New customer created successfully.");
      }

      setIsFormOpen(false);
      fetchCustomers();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await fetch(`/api/admin/customers?id=${deleteConfirmId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete customer.");
      showToast(json.message || "Customer record removed.");
      setDeleteConfirmId(null);
      fetchCustomers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    if (statusFilter === "ACTIVE") return c.isActive;
    if (statusFilter === "INACTIVE") return !c.isActive;
    return true;
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

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-warm-200/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-brand-gold-600 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>CRM & Client Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy-950">
            Customer Management
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy-600">
            Manage client profiles, booking history, lifetime spend, and direct communication in Islamabad & Rawalpindi.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-gold text-xs px-5 py-2.5 flex items-center justify-center space-x-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-brand-navy-900">
          <div className="flex items-center justify-between text-xs text-brand-navy-600 font-medium">
            <span>Total Clients</span>
            <Users className="w-4 h-4 text-brand-navy-700" />
          </div>
          <p className="text-2xl font-serif font-bold text-brand-navy-950">{summary.totalCustomers}</p>
          <p className="text-[11px] text-brand-navy-500">Registered across twin cities</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between text-xs text-brand-navy-600 font-medium">
            <span>Active Accounts</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-serif font-bold text-emerald-700">{summary.activeCustomers}</p>
          <p className="text-[11px] text-brand-navy-500">Eligible for bookings</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-brand-gold-500">
          <div className="flex items-center justify-between text-xs text-brand-navy-600 font-medium">
            <span>Total Client Spend</span>
            <DollarSign className="w-4 h-4 text-brand-gold-600" />
          </div>
          <p className="text-2xl font-serif font-bold text-brand-navy-950">
            {formatPKR(summary.aggregateSpendMinor)}
          </p>
          <p className="text-[11px] text-brand-navy-500">Collected lifetime revenue</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-xs text-brand-navy-600 font-medium">
            <span>Outstanding Due</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-serif font-bold text-amber-700">
            {formatPKR(summary.aggregateOutstandingMinor)}
          </p>
          <p className="text-[11px] text-brand-navy-500">Pending invoice balances</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card-luxury p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-brand-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
          />
        </form>

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

          <div className="flex items-center space-x-1.5 text-xs text-brand-navy-700">
            <span className="font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-brand-warm-300 text-xs bg-white focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <button
            onClick={fetchCustomers}
            className="p-2 rounded-lg border border-brand-warm-300 text-brand-navy-600 hover:bg-brand-warm-100 transition-colors"
            title="Refresh List"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Customer Table */}
      <div className="card-luxury overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-brand-gold-600 animate-spin mx-auto" />
            <p className="text-xs text-brand-navy-600">Loading customer profiles from database...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Users className="w-10 h-10 text-brand-warm-400 mx-auto" />
            <p className="text-sm font-semibold text-brand-navy-950">No customers found</p>
            <p className="text-xs text-brand-navy-500 max-w-sm mx-auto">
              {search ? "No records match your query. Try clearing search filters." : "Create your first customer to get started."}
            </p>
            <button
              onClick={openCreateModal}
              className="btn-gold text-xs px-4 py-2 mt-2 inline-flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Customer</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-warm-100/70 text-brand-navy-800 font-serif border-b border-brand-warm-200">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Client Name & Info</th>
                  <th className="py-3.5 px-4 font-bold">Location</th>
                  <th className="py-3.5 px-4 font-bold text-center">Bookings</th>
                  <th className="py-3.5 px-4 font-bold text-right">Lifetime Spend</th>
                  <th className="py-3.5 px-4 font-bold text-right">Outstanding</th>
                  <th className="py-3.5 px-4 font-bold text-center">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-warm-200/60 text-brand-navy-900 font-sans">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-brand-warm-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-brand-navy-900 text-brand-gold-400 font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                          {c.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-brand-navy-950 text-xs">{c.name}</p>
                          <div className="flex items-center space-x-2 text-[11px] text-brand-navy-600 mt-0.5">
                            <span className="flex items-center space-x-1">
                              <Mail className="w-3 h-3 text-brand-warm-400" />
                              <span>{c.email}</span>
                            </span>
                            {c.phone !== "N/A" && (
                              <span className="flex items-center space-x-1">
                                <Phone className="w-3 h-3 text-brand-warm-400" />
                                <span>{c.phone}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-warm-100 text-brand-navy-800">
                          {c.city}
                        </span>
                        <p className="text-[11px] text-brand-navy-500 truncate max-w-[180px]">
                          {c.address !== "N/A" ? c.address : "No street address"}
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-brand-navy-50 text-brand-navy-900">
                        {c.totalBookings}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-semibold text-brand-navy-950">
                      {formatPKR(c.totalSpendMinor)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {c.outstandingMinor > 0 ? (
                        <span className="font-bold text-amber-600">
                          {formatPKR(c.outstandingMinor)}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-semibold text-[11px]">Paid in full</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          c.isActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => openDetailDrawer(c)}
                          className="p-1.5 rounded-lg border border-brand-warm-300 text-brand-navy-700 hover:bg-brand-warm-100"
                          title="View Profile & Bookings"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 rounded-lg border border-brand-warm-300 text-brand-navy-700 hover:bg-brand-warm-100"
                          title="Edit Customer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(c.id)}
                          className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                          title="Archive / Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CUSTOMER DETAIL DRAWER */}
      {isDetailOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-left">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-brand-warm-200 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-full bg-brand-navy-950 text-brand-gold-400 font-bold flex items-center justify-center text-sm shadow-md">
                    {selectedCustomer.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-brand-navy-950">
                      {selectedCustomer.name}
                    </h2>
                    <p className="text-xs text-brand-navy-500 font-mono">ID: {selectedCustomer.id}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="p-2 rounded-xl text-brand-navy-400 hover:text-brand-navy-900 hover:bg-brand-warm-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2.5">
                {selectedCustomer.phone !== "N/A" && (
                  <a
                    href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center space-x-1.5 hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Client</span>
                  </a>
                )}
                {selectedCustomer.phone !== "N/A" && (
                  <a
                    href={`tel:${selectedCustomer.phone}`}
                    className="px-3 py-1.5 rounded-lg border border-brand-warm-300 text-brand-navy-800 text-xs font-semibold flex items-center space-x-1.5 hover:bg-brand-warm-100"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Phone</span>
                  </a>
                )}
                <a
                  href={`mailto:${selectedCustomer.email}`}
                  className="px-3 py-1.5 rounded-lg border border-brand-warm-300 text-brand-navy-800 text-xs font-semibold flex items-center space-x-1.5 hover:bg-brand-warm-100"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-4 bg-brand-warm-50 p-4 rounded-xl border border-brand-warm-200 text-xs">
                <div>
                  <span className="text-[11px] text-brand-navy-500 font-medium block">City Location</span>
                  <span className="font-bold text-brand-navy-950">{selectedCustomer.city}</span>
                </div>
                <div>
                  <span className="text-[11px] text-brand-navy-500 font-medium block">Account Status</span>
                  <span className={`font-bold ${selectedCustomer.isActive ? "text-emerald-700" : "text-rose-700"}`}>
                    {selectedCustomer.isActive ? "Active Account" : "Inactive / Suspended"}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-[11px] text-brand-navy-500 font-medium block">Full Address</span>
                  <span className="font-medium text-brand-navy-950">{selectedCustomer.address}</span>
                </div>
                {selectedCustomer.emergencyContact && (
                  <div className="col-span-2">
                    <span className="text-[11px] text-brand-navy-500 font-medium block">Emergency Contact</span>
                    <span className="font-semibold text-brand-navy-900">{selectedCustomer.emergencyContact}</span>
                  </div>
                )}
                {selectedCustomer.notes && (
                  <div className="col-span-2">
                    <span className="text-[11px] text-brand-navy-500 font-medium block">Internal Admin Notes</span>
                    <p className="text-xs text-brand-navy-800 italic">{selectedCustomer.notes}</p>
                  </div>
                )}
              </div>

              {/* Financial Snapshot */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-white border border-brand-warm-200">
                  <span className="text-[10px] text-brand-navy-500 uppercase font-bold">Total Bookings</span>
                  <p className="text-lg font-serif font-bold text-brand-navy-950">{selectedCustomer.totalBookings}</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-brand-warm-200">
                  <span className="text-[10px] text-brand-navy-500 uppercase font-bold">Paid Revenue</span>
                  <p className="text-lg font-serif font-bold text-emerald-700">
                    {formatPKR(selectedCustomer.totalSpendMinor)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-brand-warm-200">
                  <span className="text-[10px] text-brand-navy-500 uppercase font-bold">Balance Due</span>
                  <p className="text-lg font-serif font-bold text-amber-700">
                    {formatPKR(selectedCustomer.outstandingMinor)}
                  </p>
                </div>
              </div>

              {/* Booking History */}
              <div className="space-y-3">
                <h3 className="text-sm font-serif font-bold text-brand-navy-950 border-b border-brand-warm-200 pb-1.5 flex items-center justify-between">
                  <span>Booking History</span>
                  <span className="text-xs font-mono text-brand-navy-500 font-normal">
                    {selectedCustomer.bookings.length} record(s)
                  </span>
                </h3>

                {selectedCustomer.bookings.length === 0 ? (
                  <p className="text-xs text-brand-navy-500 py-4 text-center">No bookings on file yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {selectedCustomer.bookings.map((b: any) => (
                      <div
                        key={b.id}
                        className="p-3.5 rounded-xl bg-brand-warm-50/70 border border-brand-warm-200 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-brand-gold-700">{b.reference}</span>
                            <span className="badge-gold text-[10px] px-2 py-0.2">{b.eventType}</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              b.status === "CONFIRMED"
                                ? "bg-emerald-100 text-emerald-800"
                                : b.status === "COMPLETED"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>

                        <div className="text-[11px] text-brand-navy-600 flex items-center justify-between">
                          <span>
                            Date: {new Date(b.eventDate).toLocaleDateString("en-PK", { dateStyle: "medium" })}
                          </span>
                          <span>Guests: {b.guestCount}</span>
                          <span className="font-bold text-brand-navy-950">{formatPKR(b.totalAmountMinor)}</span>
                        </div>

                        {b.package && (
                          <p className="text-[11px] text-brand-navy-700">
                            <strong>Package:</strong> {b.package.title}
                          </p>
                        )}
                        {b.theme && (
                          <p className="text-[11px] text-brand-navy-700">
                            <strong>Theme:</strong> {b.theme.title}
                          </p>
                        )}

                        <div className="pt-2 border-t border-brand-warm-200/80 flex items-center justify-between text-[11px]">
                          <span className="text-emerald-700 font-semibold">
                            Paid: {formatPKR(b.amountPaidMinor)}
                          </span>
                          {b.invoices?.[0] && (
                            <Link
                              href="/admin/invoices"
                              className="text-brand-gold-700 hover:text-brand-gold-800 font-semibold flex items-center space-x-1"
                            >
                              <FileText className="w-3 h-3" />
                              <span>Invoice {b.invoices[0].invoiceNumber}</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-brand-warm-200 bg-brand-warm-50 flex justify-end">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="btn-outline-navy text-xs px-5 py-2"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT CUSTOMER MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-brand-warm-200 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-brand-warm-200 pb-3">
              <h3 className="text-lg font-serif font-bold text-brand-navy-950">
                {editingCustomer ? "Edit Customer Profile" : "Add New Customer"}
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

            <form onSubmit={handleSaveCustomer} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Fatima Zahra"
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-navy-900 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    disabled={!!editingCustomer}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white disabled:bg-brand-warm-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-navy-900 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-navy-900 mb-1">City</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                  >
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-brand-navy-900 mb-1">Emergency Phone</label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    placeholder="Alternative contact"
                    className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">Address / Sector / Phase</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. House 42, Street 19, Sector F-8/2, Islamabad"
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">Internal Admin Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Client preferences, color requests, VIP status..."
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-brand-gold-600 rounded border-brand-warm-300"
                />
                <label htmlFor="isActiveToggle" className="font-semibold text-brand-navy-900">
                  Active Account (Allowed to place bookings)
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
                  <span>{editingCustomer ? "Save Changes" : "Create Customer"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE / ARCHIVE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-brand-warm-200 text-center animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-brand-navy-950">
              Archive Customer Account?
            </h3>
            <p className="text-xs text-brand-navy-600 leading-relaxed">
              If this client has existing bookings or financial records, their account will be deactivated safely without deleting past event and invoice history.
            </p>
            <div className="pt-2 flex justify-center space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-outline-navy text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCustomer}
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
