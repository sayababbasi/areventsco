"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Boxes,
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  RefreshCw,
  X,
  AlertTriangle,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { formatPKR } from "@/lib/utils";

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  image?: string;
  totalQuantity: number;
  availableQuantity: number;
  condition: string;
  location: string;
  costMinor: number;
  status: string;
  notes?: string;
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  // Form Fields
  const [formSku, setFormSku] = useState("");
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Props");
  const [formTotalQty, setFormTotalQty] = useState(2);
  const [formAvailQty, setFormAvailQty] = useState(2);
  const [formCondition, setFormCondition] = useState("Excellent");
  const [formLocation, setFormLocation] = useState("Main Warehouse, Islamabad");
  const [formCostPKR, setFormCostPKR] = useState(35000);
  const [formStatus, setFormStatus] = useState("AVAILABLE");
  const [formNotes, setFormNotes] = useState("");

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/inventory");
      const json = await res.json();
      if (json.success) {
        setItems(json.data);
      }
    } catch (err) {
      console.error("Fetch inventory error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormSku(`PROP-${Date.now().toString().slice(-4)}`);
    setFormName("");
    setFormCategory("Props");
    setFormTotalQty(2);
    setFormAvailQty(2);
    setFormCondition("Excellent");
    setFormLocation("Main Warehouse, Islamabad");
    setFormCostPKR(35000);
    setFormStatus("AVAILABLE");
    setFormNotes("");
    setModalError("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setIsEditing(true);
    setEditId(item.id);
    setFormSku(item.sku);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormTotalQty(item.totalQuantity);
    setFormAvailQty(item.availableQuantity);
    setFormCondition(item.condition);
    setFormLocation(item.location);
    setFormCostPKR(Math.round(item.costMinor / 100));
    setFormStatus(item.status);
    setFormNotes(item.notes || "");
    setModalError("");
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setIsSaving(true);

    try {
      const payload = {
        id: editId,
        sku: formSku,
        name: formName,
        category: formCategory,
        totalQuantity: Number(formTotalQty),
        availableQuantity: Number(formAvailQty),
        condition: formCondition,
        location: formLocation,
        costMinor: formCostPKR * 100,
        status: formStatus,
        notes: formNotes,
      };

      const res = await fetch("/api/admin/inventory", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) {
        setModalError(json.error || "Failed to save item.");
        setIsSaving(false);
        return;
      }

      setIsModalOpen(false);
      fetchInventory();
    } catch (err: any) {
      setModalError(err.message || "An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from inventory?`)) return;

    try {
      const res = await fetch(`/api/admin/inventory?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchInventory();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", "Backdrops", "Props", "Cake Stands", "Lighting", "Balloons", "Furniture"];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-warm-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-brand-gold-600 uppercase tracking-wider font-semibold">
            <Boxes className="w-3.5 h-3.5" />
            <span>Operations & Logistics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-brand-navy-950 font-bold mt-1">
            Decoration Inventory & Assets
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy-600 mt-1">
            Track backdrop panels, balloon stocks, neon signs, cake pedestals, and prevent double-booking.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchInventory}
            className="p-2.5 rounded-xl border border-brand-warm-300 bg-white text-brand-navy-700 hover:bg-brand-warm-100 transition-colors text-xs font-medium flex items-center space-x-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button onClick={openCreateModal} className="btn-gold flex items-center space-x-2 text-xs py-2.5 px-4 shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Add Inventory Item</span>
          </button>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-brand-warm-200 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-brand-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by SKU or item name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-brand-warm-50/50 border border-brand-warm-200 rounded-xl text-xs text-brand-navy-950 placeholder:text-brand-navy-400 focus:outline-none focus:border-brand-gold-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? "bg-brand-navy-950 text-brand-gold-400 shadow-sm"
                  : "bg-brand-warm-50 text-brand-navy-700 hover:bg-brand-warm-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* INVENTORY TABLE */}
      <div className="bg-white rounded-2xl border border-brand-warm-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-gold-600" />
            <p className="text-xs text-brand-navy-600">Loading inventory records...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Boxes className="w-10 h-10 text-brand-warm-400 mx-auto" />
            <p className="text-xs text-brand-navy-600">No inventory items found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-warm-50 text-brand-navy-700 font-bold uppercase tracking-wider text-[10px] border-b border-brand-warm-200">
                <tr>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Item Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 text-center">Available / Total</th>
                  <th className="py-3.5 px-4">Condition</th>
                  <th className="py-3.5 px-4">Warehouse Location</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-warm-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-brand-warm-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-brand-navy-950 text-[11px]">
                      {item.sku}
                    </td>
                    <td className="py-3 px-4 font-bold text-brand-navy-950">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-brand-navy-700">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-warm-100">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold ${item.availableQuantity > 0 ? "text-emerald-700" : "text-rose-700"}`}>
                        {item.availableQuantity}
                      </span>
                      <span className="text-brand-navy-400"> / {item.totalQuantity}</span>
                    </td>
                    <td className="py-3 px-4 text-brand-navy-800">
                      {item.condition}
                    </td>
                    <td className="py-3 px-4 text-brand-navy-600 flex items-center pt-4">
                      <MapPin className="w-3 h-3 text-brand-navy-400 mr-1 flex-shrink-0" />
                      <span className="truncate max-w-[160px]">{item.location}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === "AVAILABLE" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg border border-brand-warm-300 bg-white text-brand-navy-700 hover:bg-brand-warm-100"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          className="p-1.5 rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3 h-3" />
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

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-brand-warm-200">
            <div className="flex items-center justify-between border-b border-brand-warm-200 pb-4">
              <h2 className="font-serif font-bold text-lg text-brand-navy-950">
                {isEditing ? "Edit Inventory Asset" : "Add Inventory Asset"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-brand-warm-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-navy-900 mb-1">SKU / Code *</label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-navy-900 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl"
                  >
                    <option value="Backdrops">Backdrops</option>
                    <option value="Props">Props</option>
                    <option value="Cake Stands">Cake Stands</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Balloons">Balloons</option>
                    <option value="Furniture">Furniture</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-navy-900 mb-1">Asset Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 8ft Circular Lilac Wooden Backdrop Board"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-brand-navy-900 mb-1">Total Qty</label>
                  <input
                    type="number"
                    min={1}
                    value={formTotalQty}
                    onChange={(e) => setFormTotalQty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-center"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-navy-900 mb-1">Available</label>
                  <input
                    type="number"
                    min={0}
                    value={formAvailQty}
                    onChange={(e) => setFormAvailQty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-center"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-navy-900 mb-1">Condition</label>
                  <select
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value)}
                    className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Needs Repair">Needs Repair</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-navy-900 mb-1">Storage Location</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl"
                />
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
                  <span>{isEditing ? "Update Asset" : "Save Asset"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
