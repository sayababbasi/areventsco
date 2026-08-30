"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Edit,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  RefreshCw,
  Globe,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { SeoFormSection } from "@/components/admin/SeoFormSection";

interface SeoPageItem {
  id: string;
  entityType: string;
  title: string;
  slug: string;
  url: string;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  secondaryKeywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  noIndex: boolean;
  noFollow: boolean;
  audit: {
    score: number;
    status: "EXCELLENT" | "GOOD" | "NEEDS_WORK" | "CRITICAL";
    issues: string[];
    recommendations: string[];
  };
  updatedAt: string;
}

export default function AdminSeoPagesManager() {
  const [pages, setPages] = useState<SeoPageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<SeoPageItem | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/seo/pages?type=${filterType}&search=${encodeURIComponent(search)}`);
      const json = await res.json();
      if (json.success) {
        setPages(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load SEO pages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [filterType]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const openEditModal = (item: SeoPageItem) => {
    setEditingItem(item);
    setFormData({
      seoTitle: item.seoTitle,
      seoDescription: item.seoDescription,
      focusKeyword: item.focusKeyword,
      secondaryKeywords: item.secondaryKeywords,
      canonicalUrl: item.canonicalUrl,
      ogTitle: item.ogTitle,
      ogDescription: item.ogDescription,
      ogImage: item.ogImage,
      noIndex: item.noIndex,
      noFollow: item.noFollow,
      title: item.title,
      slug: item.slug,
    });
    setErrorMessage("");
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setFormLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/seo/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingItem.id,
          entityType: editingItem.entityType,
          ...formData,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to update SEO.");

      showToast(`SEO updated for "${editingItem.title}".`);
      setEditingItem(null);
      fetchPages();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-700 bg-emerald-50 border-emerald-300";
    if (score >= 70) return "text-amber-700 bg-amber-50 border-amber-300";
    return "text-rose-700 bg-rose-50 border-rose-300";
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
            Pages & Entity SEO Manager
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy-600">
            Customize SERP titles, meta descriptions, target keywords, and Open Graph previews for every public route.
          </p>
        </div>

        <button
          onClick={fetchPages}
          className="p-2.5 rounded-xl border border-brand-warm-300 text-brand-navy-700 hover:bg-brand-warm-100 self-start sm:self-auto"
          title="Refresh List"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filters & Search */}
      <div className="card-luxury p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-brand-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchPages()}
              placeholder="Search by title, keyword, slug..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
            />
          </div>

          <button
            onClick={fetchPages}
            className="btn-gold text-xs px-4 py-2 shrink-0 flex items-center space-x-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Records</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-brand-warm-200/60 text-xs">
          {["ALL", "Page", "Package", "Theme", "Service", "Venue", "Location"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterType.toLowerCase() === t.toLowerCase()
                  ? "bg-brand-navy-950 text-white shadow-sm"
                  : "bg-brand-warm-100 text-brand-navy-700 hover:bg-brand-warm-200"
              }`}
            >
              {t === "ALL" ? "All Entities" : `${t}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Entity Table */}
      {loading ? (
        <div className="card-luxury py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-gold-600 animate-spin mx-auto" />
          <p className="text-xs text-brand-navy-600">Loading entity SEO metadata...</p>
        </div>
      ) : pages.length === 0 ? (
        <div className="card-luxury py-16 text-center space-y-3">
          <Globe className="w-10 h-10 text-brand-warm-400 mx-auto" />
          <p className="text-sm font-semibold text-brand-navy-950">No entities found</p>
          <p className="text-xs text-brand-navy-500">Try changing your search query or filter category.</p>
        </div>
      ) : (
        <div className="card-luxury overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-brand-warm-100/60 border-b border-brand-warm-200 text-brand-navy-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">SEO Title & Description</th>
                  <th className="py-3 px-4">Focus Keyword</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 text-center">Indexing</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-warm-200/70">
                {pages.map((p) => (
                  <tr key={`${p.entityType}-${p.id}`} className="hover:bg-brand-warm-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className="badge-gold bg-brand-navy-950 text-brand-gold-300 text-[9px] px-1.5 py-0.2">
                          {p.entityType}
                        </span>
                        <p className="font-serif font-bold text-brand-navy-950 text-sm max-w-[200px] truncate">
                          {p.title}
                        </p>
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-brand-gold-700 hover:underline flex items-center space-x-1"
                        >
                          <span className="truncate max-w-[150px]">{p.url}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="space-y-1">
                        <p className="font-semibold text-brand-navy-900 line-clamp-1">
                          {p.seoTitle || <span className="text-rose-500 italic">No custom SEO title</span>}
                        </p>
                        <p className="text-[11px] text-brand-navy-600 line-clamp-2">
                          {p.seoDescription || <span className="text-amber-600 italic">No meta description provided</span>}
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {p.focusKeyword ? (
                        <span className="font-mono text-[11px] bg-brand-warm-100 text-brand-navy-800 px-2 py-1 rounded-md border border-brand-warm-300">
                          {p.focusKeyword}
                        </span>
                      ) : (
                        <span className="text-[11px] text-brand-navy-400 italic">Not set</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full border text-[11px] font-mono font-bold ${getScoreColor(p.audit.score)}`}>
                        {p.audit.score}/100
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {!p.noIndex ? (
                        <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          Index
                        </span>
                      ) : (
                        <span className="text-rose-700 font-semibold text-[11px] bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                          Noindex
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openEditModal(p)}
                        className="btn-gold text-xs px-3.5 py-1.5 font-semibold inline-flex items-center space-x-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit SEO</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FULL SEO MODAL WITH LIVE PREVIEW */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-2xl border border-brand-warm-200 animate-scale-in max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-brand-warm-200 pb-3">
              <div>
                <span className="badge-gold bg-brand-navy-950 text-brand-gold-300 text-[10px] px-2 py-0.5">
                  {editingItem.entityType} SEO Editor
                </span>
                <h3 className="text-lg font-serif font-bold text-brand-navy-950 mt-1">
                  {editingItem.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingItem(null)}
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

            <form onSubmit={handleSaveSeo} className="space-y-6">
              <SeoFormSection
                formData={formData}
                onChange={handleFieldChange}
                entityType={editingItem.entityType}
              />

              <div className="pt-4 border-t border-brand-warm-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="btn-outline-navy text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn-gold text-xs px-6 py-2 font-bold flex items-center space-x-2"
                >
                  {formLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save SEO Metadata</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
