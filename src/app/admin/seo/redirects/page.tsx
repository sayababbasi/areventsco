"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Link2,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  RefreshCw,
  Search,
  ArrowRight,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";

interface RedirectRule {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: number;
  isActive: boolean;
  hitCount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSeoRedirectsPage() {
  const [redirects, setRedirects] = useState<RedirectRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<RedirectRule | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fromPath: "",
    toPath: "",
    statusCode: 301,
    notes: "",
    isActive: true,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const fetchRedirects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/seo/redirects");
      const json = await res.json();
      if (json.success) {
        setRedirects(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load redirects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedirects();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const openCreateModal = () => {
    setEditingRule(null);
    setFormData({
      fromPath: "",
      toPath: "",
      statusCode: 301,
      notes: "",
      isActive: true,
    });
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const openEditModal = (r: RedirectRule) => {
    setEditingRule(r);
    setFormData({
      fromPath: r.fromPath,
      toPath: r.toPath,
      statusCode: r.statusCode,
      notes: r.notes || "",
      isActive: r.isActive,
    });
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const handleSaveRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMessage("");

    try {
      if (!formData.fromPath || !formData.toPath) {
        throw new Error("Source path and Destination URL are required.");
      }

      if (editingRule) {
        const res = await fetch("/api/admin/seo/redirects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingRule.id, ...formData }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to update redirect.");
        showToast("Redirect rule updated.");
      } else {
        const res = await fetch("/api/admin/seo/redirects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to create redirect.");
        showToast("New redirect rule created.");
      }

      setIsFormOpen(false);
      fetchRedirects();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const toggleActiveStatus = async (r: RedirectRule) => {
    try {
      const res = await fetch("/api/admin/seo/redirects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: r.id, isActive: !r.isActive }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Redirect rule ${!r.isActive ? "activated" : "paused"}.`);
        fetchRedirects();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteRedirect = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await fetch(`/api/admin/seo/redirects?id=${deleteConfirmId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete redirect.");
      showToast("Redirect deleted successfully.");
      setDeleteConfirmId(null);
      fetchRedirects();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredRedirects = redirects.filter((r) => {
    return (
      r.fromPath.toLowerCase().includes(search.toLowerCase()) ||
      r.toPath.toLowerCase().includes(search.toLowerCase()) ||
      (r.notes || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalHits = redirects.reduce((sum, r) => sum + r.hitCount, 0);

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
            301 & 302 Redirect Manager
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy-600">
            Maintain URL equity, prevent 404 dead ends, and route historical links to relevant public landing pages.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-gold text-xs px-5 py-2.5 flex items-center justify-center space-x-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Redirect Rule</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-brand-navy-900">
          <span className="text-xs text-brand-navy-600 font-medium">Total Rules</span>
          <p className="text-2xl font-serif font-bold text-brand-navy-950">{redirects.length}</p>
          <p className="text-[11px] text-brand-navy-500">Configured in database</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-brand-gold-500">
          <span className="text-xs text-brand-navy-600 font-medium">Traffic Rerouted</span>
          <p className="text-2xl font-serif font-bold text-brand-gold-700">{totalHits.toLocaleString()}</p>
          <p className="text-[11px] text-brand-navy-500">Lifetime redirect hits</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-emerald-600">
          <span className="text-xs text-brand-navy-600 font-medium">301 Permanent</span>
          <p className="text-2xl font-serif font-bold text-emerald-700">
            {redirects.filter((r) => r.statusCode === 301).length}
          </p>
          <p className="text-[11px] text-brand-navy-500">Full link juice pass</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-amber-500">
          <span className="text-xs text-brand-navy-600 font-medium">Active Status</span>
          <p className="text-2xl font-serif font-bold text-brand-navy-950">
            {redirects.filter((r) => r.isActive).length} / {redirects.length}
          </p>
          <p className="text-[11px] text-brand-navy-500">Live in Next.js middleware</p>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="card-luxury p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-brand-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search from or to path..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
          />
        </div>

        <button
          onClick={fetchRedirects}
          className="p-2 rounded-lg border border-brand-warm-300 text-brand-navy-600 hover:bg-brand-warm-100 transition-colors ml-auto"
          title="Refresh List"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Redirects Table */}
      {loading ? (
        <div className="card-luxury py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-gold-600 animate-spin mx-auto" />
          <p className="text-xs text-brand-navy-600">Loading redirect rules...</p>
        </div>
      ) : filteredRedirects.length === 0 ? (
        <div className="card-luxury py-16 text-center space-y-3">
          <Link2 className="w-10 h-10 text-brand-warm-400 mx-auto" />
          <p className="text-sm font-semibold text-brand-navy-950">No redirects configured</p>
          <p className="text-xs text-brand-navy-500">Create your first 301 rule to redirect outdated URLs.</p>
          <button
            onClick={openCreateModal}
            className="btn-gold text-xs px-4 py-2 mt-2 inline-flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Rule</span>
          </button>
        </div>
      ) : (
        <div className="card-luxury overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-brand-warm-100/60 border-b border-brand-warm-200 text-brand-navy-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Source URL (From)</th>
                  <th className="py-3 px-4">Destination (To)</th>
                  <th className="py-3 px-4 text-center">Type</th>
                  <th className="py-3 px-4 text-center">Hits</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-warm-200/70">
                {filteredRedirects.map((r) => (
                  <tr key={r.id} className="hover:bg-brand-warm-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-mono font-bold text-brand-navy-950 text-xs">
                          {r.fromPath}
                        </span>
                        {r.notes && <p className="text-[10px] text-brand-navy-500">{r.notes}</p>}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5 font-mono text-emerald-700 text-xs font-medium">
                        <ArrowRight className="w-3.5 h-3.5 text-brand-gold-600 shrink-0" />
                        <span className="truncate max-w-xs">{r.toPath}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.statusCode === 301
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {r.statusCode}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono font-bold text-brand-navy-900 bg-brand-warm-100 px-2 py-0.5 rounded-md">
                        {r.hitCount.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleActiveStatus(r)}
                        className={`w-8 h-4 rounded-full transition-colors relative inline-block ${
                          r.isActive ? "bg-emerald-600" : "bg-brand-warm-300"
                        }`}
                        title={r.isActive ? "Active in middleware" : "Paused"}
                      >
                        <span
                          className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                            r.isActive ? "left-4.5" : "left-0.5"
                          }`}
                        />
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => openEditModal(r)}
                        className="p-1.5 rounded-lg border border-brand-warm-300 text-brand-navy-700 hover:bg-brand-warm-100"
                        title="Edit Rule"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(r.id)}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-brand-warm-200 animate-scale-in">
            <div className="flex items-center justify-between border-b border-brand-warm-200 pb-3">
              <h3 className="text-lg font-serif font-bold text-brand-navy-950">
                {editingRule ? "Edit Redirect Rule" : "Create Redirect Rule"}
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

            <form onSubmit={handleSaveRedirect} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">
                  Source Path (From) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fromPath}
                  onChange={(e) => setFormData({ ...formData, fromPath: e.target.value })}
                  placeholder="/old-birthday-package-url"
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white font-mono"
                />
                <p className="text-[10px] text-brand-navy-500 mt-1">Must start with /</p>
              </div>

              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">
                  Target Destination (To) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.toPath}
                  onChange={(e) => setFormData({ ...formData, toPath: e.target.value })}
                  placeholder="/packages or https://..."
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-navy-900 mb-1">
                    HTTP Redirect Type *
                  </label>
                  <select
                    value={formData.statusCode}
                    onChange={(e) => setFormData({ ...formData, statusCode: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white font-semibold"
                  >
                    <option value={301}>301 (Moved Permanently — Passes SEO Juice)</option>
                    <option value={302}>302 (Found / Temporary Redirect)</option>
                  </select>
                </div>

                <div className="flex items-end pb-2">
                  <label className="flex items-center space-x-2 font-semibold text-brand-navy-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-brand-gold-600 rounded"
                    />
                    <span>Rule is Active</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">
                  Internal Note (Optional)
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Redirecting legacy campaign URL to services catalog"
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
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
                  <span>{editingRule ? "Save Changes" : "Create Redirect"}</span>
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
              Delete Redirect Rule?
            </h3>
            <p className="text-xs text-brand-navy-600 leading-relaxed">
              Are you sure you want to delete this redirect rule? Visitors heading to the old URL will no longer be rerouted.
            </p>
            <div className="pt-2 flex justify-center space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-outline-navy text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRedirect}
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
