"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatPKR, formatDate, formatTime12H } from "@/lib/utils";
import {
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { useRealtime } from "@/client/hooks/useRealtime";

interface BookingRecord {
  id: string;
  reference: string;
  eventType: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  city: string;
  venueLocation: string;
  status: string;
  totalAmountMinor: number;
  amountPaidMinor: number;
  balanceDueMinor: number;
  customer: {
    user: {
      name: string;
      email: string;
      phone: string;
    };
  };
  package?: { title: string } | null;
  theme?: { title: string } | null;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/bookings");
      const json = await res.json();
      if (json.success) {
        setBookings(json.data);
        setFilteredBookings(json.data);
      }
    } catch (e) {
      console.error("Failed to load bookings", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let result = [...bookings];

    if (statusFilter !== "ALL") {
      result = result.filter((b) => b.status === statusFilter);
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.reference.toLowerCase().includes(lower) ||
          b.customer.user.name.toLowerCase().includes(lower) ||
          b.city.toLowerCase().includes(lower) ||
          b.customer.user.phone?.includes(lower)
      );
    }

    setFilteredBookings(result);
  }, [searchTerm, statusFilter, bookings]);

  // Real-time Event Subscription
  useRealtime({
    channels: "admin",
    onEvent: (evt) => {
      if (evt.type === "BOOKING_CREATED" && evt.data) {
        setBookings((prev) => {
          if (prev.some((b) => b.id === evt.data.id || b.reference === evt.data.reference)) {
            return prev;
          }
          return [evt.data as BookingRecord, ...prev];
        });
      } else if (
        (evt.type === "BOOKING_STATUS_UPDATED" || evt.type === "PAYMENT_COMPLETED") &&
        evt.data
      ) {
        setBookings((prev) =>
          prev.map((b) => {
            if (b.id === evt.data.bookingId || b.reference === evt.data.reference || b.reference === evt.data.bookingReference) {
              return {
                ...b,
                status: evt.data.status || b.status,
                amountPaidMinor:
                  typeof evt.data.amountPaidMinor === "number"
                    ? evt.data.amountPaidMinor
                    : b.amountPaidMinor,
                balanceDueMinor:
                  typeof evt.data.balanceDueMinor === "number"
                    ? evt.data.balanceDueMinor
                    : b.balanceDueMinor,
              };
            }
            return b;
          })
        );
      }
    },
  });

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    // 1. Save previous status for optimistic rollback
    const previousBooking = bookings.find((b) => b.id === id);
    const previousStatus = previousBooking?.status;

    // 2. Optimistic instant UI update
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );

    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        // Rollback on server rejection
        if (previousStatus) {
          setBookings((prev) =>
            prev.map((b) => (b.id === id ? { ...b, status: previousStatus } : b))
          );
        }
        alert("Failed to update status on server. Rolled back.");
      }
    } catch (err) {
      console.error(err);
      if (previousStatus) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: previousStatus } : b))
        );
      }
      alert("Network error updating status. Rolled back.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-brand-navy-950">
            Booking & Event Operations
          </h1>
          <p className="text-xs text-brand-navy-600">
            Manage reservation lifecycles, assign statuses, and inspect invoices
          </p>
        </div>
        <button
          onClick={fetchBookings}
          className="btn-outline-navy px-3 py-1.5 text-xs font-semibold self-start sm:self-auto"
        >
          Refresh List
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-luxury p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-brand-navy-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search reference, client name, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-brand-warm-300 focus:ring-2 focus:ring-brand-gold-400"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-brand-navy-500 flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-brand-warm-300 bg-white font-medium focus:ring-2 focus:ring-brand-gold-400"
          >
            <option value="ALL">All Statuses ({bookings.length})</option>
            <option value="INQUIRY">INQUIRY</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PREPARING">PREPARING</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card-luxury overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-brand-navy-500 flex items-center justify-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-brand-gold-600" />
            <span>Loading active bookings...</span>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-xs text-brand-navy-500">
            No bookings found matching your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-warm-100/70 text-brand-navy-800 font-semibold uppercase tracking-wider border-b border-brand-warm-200">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Client Contact</th>
                  <th className="p-4">Event Date & City</th>
                  <th className="p-4">Package & Theme</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Operational Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-warm-200">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-brand-warm-50/70 transition-colors">
                    <td className="p-4 font-mono font-bold text-brand-navy-950">
                      {b.reference}
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-brand-navy-900">{b.customer.user.name}</p>
                      <p className="text-[11px] text-brand-navy-500">{b.customer.user.phone || b.customer.user.email}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-brand-navy-900">{formatDate(b.eventDate)}</p>
                      <p className="text-[11px] text-brand-navy-500">
                        {formatTime12H(b.startTime)} • <span className="font-semibold">{b.city}</span>
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-brand-navy-900">
                        {b.package?.title || "Custom Package"}
                      </p>
                      <p className="text-[11px] text-brand-gold-700">
                        {b.theme?.title || "Custom Theme"}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-brand-navy-950">
                        {formatPKR(b.totalAmountMinor)}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-medium">
                        Paid: {formatPKR(b.amountPaidMinor)}
                      </p>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <select
                          disabled={updatingId === b.id}
                          value={b.status}
                          onChange={(e) => handleStatusUpdate(b.id, e.target.value)}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg border border-brand-warm-300 bg-white shadow-sm focus:ring-2 focus:ring-brand-gold-400"
                        >
                          <option value="INQUIRY">INQUIRY</option>
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PREPARING">PREPARING</option>
                          <option value="COMPLETED">COMPLETED</option>
                        </select>
                        {updatingId === b.id && <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-gold-600" />}
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/invoices?search=${b.reference}`}
                          className="px-2.5 py-1 bg-brand-navy-900 hover:bg-brand-navy-800 text-brand-gold-400 rounded-lg text-xs font-semibold transition"
                        >
                          Invoice Workspace
                        </Link>
                        <Link
                          href={`/booking/${b.reference}`}
                          target="_blank"
                          className="p-1 text-brand-navy-500 hover:text-brand-navy-900 transition"
                          title="Client View"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
