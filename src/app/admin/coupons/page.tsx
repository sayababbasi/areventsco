"use client";

import { useEffect, useState } from "react";
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  Search,
  Loader2,
  RefreshCw,
  X,
  Percent,
  CheckCircle2,
} from "lucide-react";
import { formatPKR } from "@/lib/utils";
import { usePopup } from "@/components/ui/ModalProvider";

interface CouponItem {
  id: string;
  code: string;
  description?: string;
  discountType: string;
  discountValue: number;
  minOrderMinor: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formCode, setFormCode] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formType, setFormType] = useState("PERCENTAGE");
  const [formVal, setFormVal] = useState(10);
  const [formMinOrderPKR, setFormMinOrderPKR] = useState(40000);
  const [formMaxUses, setFormMaxUses] = useState(100);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/coupons");
      const json = await res.json();
      if (json.success) setCoupons(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: formCode,
          description: formDesc,
          discountType: formType,
          discountValue: formVal,
          minOrderMinor: formMinOrderPKR * 100,
          maxUses: formMaxUses,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        fetchCoupons();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const { confirm, toast } = usePopup();

  const handleDeleteCoupon = (id: string) => {
    confirm({
      title: "Delete Coupon",
      message: "Are you sure you want to delete this coupon code?",
      variant: "danger",
      confirmText: "Yes, Delete",
      onConfirm: async () => {
        try {
          await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
          toast("Coupon deleted successfully", "success");
          fetchCoupons();
        } catch (err) {
          console.error(err);
        }
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-warm-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-brand-gold-600 uppercase tracking-wider font-semibold">
            <Tag className="w-3.5 h-3.5" />
            <span>Marketing & Promotions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-brand-navy-950 font-bold mt-1">
            Coupons & Promotional Codes
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy-600 mt-1">
            Create percentage or fixed PKR discount vouchers applied at booking checkout.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchCoupons}
            className="p-2.5 rounded-xl border border-brand-warm-300 bg-white text-brand-navy-700 hover:bg-brand-warm-100 transition-colors text-xs font-medium flex items-center space-x-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-gold flex items-center space-x-2 text-xs py-2.5 px-4 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* COUPONS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white p-6 rounded-2xl border border-brand-warm-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-base text-brand-navy-950 bg-brand-gold-50 border border-brand-gold-300 text-brand-gold-900 px-3 py-1 rounded-xl">
                {c.code}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active
              </span>
            </div>

            <div>
              <p className="text-2xl font-bold font-serif text-brand-navy-950">
                {c.discountType === "PERCENTAGE" ? `${c.discountValue}% OFF` : `${formatPKR(c.discountValue)} OFF`}
              </p>
              <p className="text-xs text-brand-navy-600 mt-1">{c.description || "Valid on all online birthday bookings"}</p>
            </div>

            <div className="pt-2 border-t border-brand-warm-100 flex items-center justify-between text-xs text-brand-navy-600">
              <span>Min. Order: {formatPKR(c.minOrderMinor)}</span>
              <span>Used: {c.usedCount} / {c.maxUses}</span>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => handleDeleteCoupon(c.id)}
                className="text-rose-600 hover:text-rose-800 text-xs font-semibold flex items-center space-x-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-brand-warm-200">
            <div className="flex items-center justify-between border-b border-brand-warm-200 pb-4">
              <h2 className="font-serif font-bold text-lg text-brand-navy-950">Create New Coupon</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-brand-warm-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-brand-navy-900 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CELEBRATE15"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl font-mono text-sm font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-navy-900 mb-1">Discount Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (PKR)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-brand-navy-900 mb-1">Value *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formVal}
                    onChange={(e) => setFormVal(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-navy-900 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. 15% off for Islamabad garden birthday parties"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-navy-900 mb-1">Min. Order (PKR)</label>
                  <input
                    type="number"
                    value={formMinOrderPKR}
                    onChange={(e) => setFormMinOrderPKR(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-navy-900 mb-1">Max Usages</label>
                  <input
                    type="number"
                    value={formMaxUses}
                    onChange={(e) => setFormMaxUses(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-brand-warm-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-brand-warm-300 text-brand-navy-700 hover:bg-brand-warm-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-gold px-5 py-2 text-xs font-semibold flex items-center space-x-1.5"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Coupon</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
