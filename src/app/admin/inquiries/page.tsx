"use client";

import { useEffect, useState } from "react";
import {
  MessageSquareQuote,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Loader2,
  RefreshCw,
  MapPin,
  Sparkles,
} from "lucide-react";
import { formatPKR } from "@/lib/utils";

interface InquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  eventType: string;
  preferredTheme?: string;
  budgetMinor?: number;
  message: string;
  status: string;
  notes?: string;
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchInquiries = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/inquiries");
      const json = await res.json();
      if (json.success) {
        setInquiries(json.data);
      }
    } catch (err) {
      console.error("Fetch inquiries error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/admin/inquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      fetchInquiries();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone.includes(searchQuery) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-warm-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-brand-gold-600 uppercase tracking-wider font-semibold">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>CRM & Lead Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-brand-navy-950 font-bold mt-1">
            Client Inquiries & Leads
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy-600 mt-1">
            Incoming birthday celebration requests from the public website contact form and inquiry popups.
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          className="p-2.5 rounded-xl border border-brand-warm-300 bg-white text-brand-navy-700 hover:bg-brand-warm-100 transition-colors text-xs font-medium flex items-center space-x-1.5 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Pipeline</span>
        </button>
      </div>

      {/* FILTERS & STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === "ALL"
              ? "bg-brand-navy-950 text-white border-brand-navy-950 shadow-md"
              : "bg-white text-brand-navy-950 border-brand-warm-200 hover:border-brand-warm-300"
          }`}
        >
          <span className="text-xs font-medium opacity-80">Total Inquiries</span>
          <p className="text-2xl font-bold font-serif mt-1">{inquiries.length}</p>
        </button>

        <button
          onClick={() => setStatusFilter("NEW")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === "NEW"
              ? "bg-amber-500 text-white border-amber-500 shadow-md"
              : "bg-white text-brand-navy-950 border-brand-warm-200 hover:border-brand-warm-300"
          }`}
        >
          <span className="text-xs font-medium opacity-80">New Uncontacted</span>
          <p className="text-2xl font-bold font-serif mt-1">
            {inquiries.filter((i) => i.status === "NEW").length}
          </p>
        </button>

        <button
          onClick={() => setStatusFilter("CONTACTED")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === "CONTACTED"
              ? "bg-blue-600 text-white border-blue-600 shadow-md"
              : "bg-white text-brand-navy-950 border-brand-warm-200 hover:border-brand-warm-300"
          }`}
        >
          <span className="text-xs font-medium opacity-80">Contacted / Quoted</span>
          <p className="text-2xl font-bold font-serif mt-1">
            {inquiries.filter((i) => i.status === "CONTACTED").length}
          </p>
        </button>

        <button
          onClick={() => setStatusFilter("CONVERTED")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === "CONVERTED"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
              : "bg-white text-brand-navy-950 border-brand-warm-200 hover:border-brand-warm-300"
          }`}
        >
          <span className="text-xs font-medium opacity-80">Converted to Booking</span>
          <p className="text-2xl font-bold font-serif mt-1">
            {inquiries.filter((i) => i.status === "CONVERTED").length}
          </p>
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-brand-warm-200 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-brand-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search lead by customer name, phone, or request details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-brand-warm-50/50 border border-brand-warm-200 rounded-xl text-xs text-brand-navy-950 placeholder:text-brand-navy-400 focus:outline-none focus:border-brand-gold-500"
          />
        </div>
      </div>

      {/* INQUIRIES LIST */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-gold-600" />
          <p className="text-xs text-brand-navy-600">Loading leads...</p>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-brand-warm-200 text-center space-y-3 shadow-sm">
          <MessageSquareQuote className="w-10 h-10 text-brand-warm-400 mx-auto" />
          <p className="text-xs text-brand-navy-600">No leads in this filter view.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-white rounded-2xl border border-brand-warm-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-gold-400/60 transition-all"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center space-x-3">
                  <h3 className="font-serif font-bold text-base text-brand-navy-950">{inq.name}</h3>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      inq.status === "NEW"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : inq.status === "CONVERTED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {inq.status}
                  </span>
                  <span className="text-[11px] text-brand-navy-400 font-mono">
                    {new Date(inq.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-navy-700">
                  <a
                    href={`tel:${inq.phone}`}
                    className="flex items-center space-x-1 text-brand-gold-700 hover:underline font-medium"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{inq.phone}</span>
                  </a>
                  {inq.email && inq.email !== "inquiry@customer.com" && (
                    <a
                      href={`mailto:${inq.email}`}
                      className="flex items-center space-x-1 text-brand-navy-600 hover:underline"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{inq.email}</span>
                    </a>
                  )}
                  <span className="flex items-center space-x-1 text-brand-navy-600">
                    <MapPin className="w-3.5 h-3.5 text-brand-gold-600" />
                    <span>{inq.city}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-brand-warm-100 text-[11px] font-semibold text-brand-navy-800">
                    {inq.eventType}
                  </span>
                </div>

                <p className="text-xs text-brand-navy-800 bg-brand-warm-50/70 p-3 rounded-xl border border-brand-warm-100 italic">
                  &ldquo;{inq.message}&rdquo;
                </p>

                {inq.notes && (
                  <p className="text-[11px] text-brand-navy-500">
                    <span className="font-bold">Internal Note:</span> {inq.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
                <a
                  href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors text-center"
                >
                  WhatsApp Lead
                </a>

                {inq.status === "NEW" && (
                  <button
                    onClick={() => updateInquiryStatus(inq.id, "CONTACTED")}
                    className="px-3.5 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold hover:bg-blue-100 transition-colors"
                  >
                    Mark Contacted
                  </button>
                )}

                {inq.status !== "CONVERTED" && (
                  <button
                    onClick={() => updateInquiryStatus(inq.id, "CONVERTED")}
                    className="px-3.5 py-2 bg-brand-navy-950 text-brand-gold-400 rounded-xl text-xs font-semibold hover:bg-brand-navy-900 transition-colors"
                  >
                    Convert to Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
