"use client";

import { useEffect, useState } from "react";
import {
  HelpCircle,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Star,
  AlertCircle,
  X,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "General",
    sortOrder: 0,
    isFeatured: false,
    isActive: true,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/faqs");
      const json = await res.json();
      if (json.success) {
        setFaqs(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load FAQs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const openCreateModal = () => {
    setEditingFaq(null);
    setFormData({
      question: "",
      answer: "",
      category: "General",
      sortOrder: faqs.length + 1,
      isFeatured: false,
      isActive: true,
    });
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const openEditModal = (f: Faq) => {
    setEditingFaq(f);
    setFormData({
      question: f.question,
      answer: f.answer,
      category: f.category,
      sortOrder: f.sortOrder,
      isFeatured: f.isFeatured,
      isActive: f.isActive,
    });
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMessage("");

    try {
      if (!formData.question || !formData.answer) {
        throw new Error("Question and Answer are required.");
      }

      if (editingFaq) {
        const res = await fetch("/api/admin/faqs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingFaq.id, ...formData }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to update FAQ.");
        showToast("FAQ updated successfully.");
      } else {
        const res = await fetch("/api/admin/faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to create FAQ.");
        showToast("New FAQ published.");
      }

      setIsFormOpen(false);
      fetchFaqs();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const toggleFaqActive = async (f: Faq) => {
    try {
      const res = await fetch("/api/admin/faqs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: f.id, isActive: !f.isActive }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`FAQ ${!f.isActive ? "published" : "hidden"}.`);
        fetchFaqs();
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update FAQ.");
    }
  };

  const toggleFaqFeatured = async (f: Faq) => {
    try {
      const res = await fetch("/api/admin/faqs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: f.id, isFeatured: !f.isFeatured }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`FAQ ${!f.isFeatured ? "featured on homepage" : "unfeatured"}.`);
        fetchFaqs();
      }
    } catch (err: any) {
      showToast(err.message || "Failed to feature FAQ.");
    }
  };

  const handleDeleteFaq = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await fetch(`/api/admin/faqs?id=${deleteConfirmId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete FAQ.");
      showToast("FAQ removed.");
      setDeleteConfirmId(null);
      fetchFaqs();
    } catch (err: any) {
      showToast(err.message || "Failed to delete FAQ.");
    }
  };

  const categories = ["ALL", "General", "Booking", "Pricing", "Customization", "Venues", "Coverage & Locations"];

  const filteredFaqs = faqs.filter((f) => {
    const matchesSearch =
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || f.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const totalFaqs = faqs.length;
  const publishedFaqs = faqs.filter((f) => f.isActive).length;
  const featuredFaqs = faqs.filter((f) => f.isFeatured).length;

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
            <HelpCircle className="w-4 h-4" />
            <span>Help Center & FAQ CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy-950">
            FAQ Management
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy-600">
            Manage customer help questions, setup times, payment terms, and twin cities coverage guidance.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-gold text-xs px-5 py-2.5 flex items-center justify-center space-x-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-brand-navy-900">
          <span className="text-xs text-brand-navy-600 font-medium">Total FAQs</span>
          <p className="text-2xl font-serif font-bold text-brand-navy-950">{totalFaqs}</p>
          <p className="text-[11px] text-brand-navy-500">In database</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-emerald-600">
          <span className="text-xs text-brand-navy-600 font-medium">Published on /faq</span>
          <p className="text-2xl font-serif font-bold text-emerald-700">{publishedFaqs}</p>
          <p className="text-[11px] text-brand-navy-500">Active public answers</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-brand-gold-500">
          <span className="text-xs text-brand-navy-600 font-medium">Featured on Home</span>
          <p className="text-2xl font-serif font-bold text-brand-navy-950">{featuredFaqs}</p>
          <p className="text-[11px] text-brand-navy-500">Highlighted questions</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-amber-500">
          <span className="text-xs text-brand-navy-600 font-medium">Topic Categories</span>
          <p className="text-2xl font-serif font-bold text-brand-navy-950">
            {new Set(faqs.map((f) => f.category)).size}
          </p>
          <p className="text-[11px] text-brand-navy-500">Booking, pricing, decor</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card-luxury p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-brand-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search question, answer, category..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
            />
          </div>

          <button
            onClick={fetchFaqs}
            className="p-2 rounded-lg border border-brand-warm-300 text-brand-navy-600 hover:bg-brand-warm-100 transition-colors ml-auto"
            title="Refresh List"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

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

      {/* FAQs List */}
      {loading ? (
        <div className="card-luxury py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-gold-600 animate-spin mx-auto" />
          <p className="text-xs text-brand-navy-600">Loading FAQs from database...</p>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="card-luxury py-16 text-center space-y-3">
          <HelpCircle className="w-10 h-10 text-brand-warm-400 mx-auto" />
          <p className="text-sm font-semibold text-brand-navy-950">No FAQs found</p>
          <p className="text-xs text-brand-navy-500">
            {search ? "No questions match your filter." : "Create your first FAQ item."}
          </p>
          <button
            onClick={openCreateModal}
            className="btn-gold text-xs px-4 py-2 mt-2 inline-flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add FAQ</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((f) => {
            const isExpanded = expandedFaqId === f.id;

            return (
              <div
                key={f.id}
                className={`card-luxury p-5 transition-all space-y-3 ${
                  !f.isActive ? "opacity-60 bg-brand-warm-100/40" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    onClick={() => setExpandedFaqId(isExpanded ? null : f.id)}
                    className="flex-1 cursor-pointer space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="badge-gold bg-brand-navy-950 text-brand-gold-300 border-none text-[10px] px-2 py-0.2">
                        {f.category}
                      </span>
                      {f.isFeatured && (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <span>Home Featured</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-brand-navy-950 text-sm hover:text-brand-gold-700 transition-colors">
                      {f.question}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => toggleFaqActive(f)}
                      className={`w-7 h-4 rounded-full transition-colors relative ${
                        f.isActive ? "bg-emerald-600" : "bg-brand-warm-300"
                      }`}
                      title={f.isActive ? "Published" : "Draft"}
                    >
                      <span
                        className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                          f.isActive ? "left-3.5" : "left-0.5"
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => toggleFaqFeatured(f)}
                      className={`p-1.5 rounded-lg border text-xs ${
                        f.isFeatured
                          ? "border-amber-400 bg-amber-50 text-amber-800"
                          : "border-brand-warm-300 text-brand-navy-400 hover:bg-brand-warm-100"
                      }`}
                      title="Toggle Home Feature"
                    >
                      <Star className={`w-3.5 h-3.5 ${f.isFeatured ? "fill-amber-500 text-amber-500" : ""}`} />
                    </button>

                    <button
                      onClick={() => openEditModal(f)}
                      className="p-1.5 rounded-lg border border-brand-warm-300 text-brand-navy-700 hover:bg-brand-warm-100"
                      title="Edit FAQ"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(f.id)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setExpandedFaqId(isExpanded ? null : f.id)}
                      className="p-1.5 rounded-lg text-brand-navy-400 hover:text-brand-navy-900"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="pt-3 border-t border-brand-warm-200 text-xs text-brand-navy-800 leading-relaxed bg-brand-warm-50/60 p-3.5 rounded-xl animate-fade-in">
                    {f.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT FAQ MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-brand-warm-200 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-brand-warm-200 pb-3">
              <h3 className="text-lg font-serif font-bold text-brand-navy-950">
                {editingFaq ? "Edit FAQ" : "Create New FAQ"}
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

            <form onSubmit={handleSaveFaq} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. How far in advance should I book my birthday setup?"
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-navy-900 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                  >
                    <option value="General">General</option>
                    <option value="Booking">Booking & Availability</option>
                    <option value="Pricing">Pricing & Payments</option>
                    <option value="Customization">Customization & Themes</option>
                    <option value="Venues">Venues & Setup Space</option>
                    <option value="Coverage & Locations">Coverage & Locations</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-brand-navy-900 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">Detailed Answer *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Comprehensive response providing helpful guidance..."
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div className="flex items-center space-x-4 pt-1">
                <label className="flex items-center space-x-1.5 font-semibold text-brand-navy-900">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-brand-gold-600 rounded"
                  />
                  <span>Published on /faq</span>
                </label>

                <label className="flex items-center space-x-1.5 font-semibold text-brand-navy-900">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-brand-gold-600 rounded"
                  />
                  <span>Feature on Homepage FAQ</span>
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
                  <span>{editingFaq ? "Save Changes" : "Create FAQ"}</span>
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
              Delete FAQ?
            </h3>
            <p className="text-xs text-brand-navy-600 leading-relaxed">
              Are you sure you want to remove this FAQ? It will no longer appear on public guidance pages.
            </p>
            <div className="pt-2 flex justify-center space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-outline-navy text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteFaq}
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
