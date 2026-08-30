"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Globe,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MapPin,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Loader2,
  BarChart3,
  Image as ImageIcon,
  Compass,
  Link2,
} from "lucide-react";

interface HealthData {
  overallScore: number;
  technicalScore: number;
  onPageScore: number;
  imageScore: number;
  localSeoScore: number;
  contentScore: number;
}

interface CountsData {
  totalIndexablePages: number;
  totalEntities: number;
  missingTitles: number;
  missingDescriptions: number;
  missingKeywords: number;
  missingAltImages: number;
  totalImages: number;
  noindexedPages: number;
  totalRedirects: number;
  totalRedirectHits: number;
}

interface EntityItem {
  id: string;
  entityType: string;
  title: string;
  slug: string;
  url: string;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  noIndex: boolean;
  audit: {
    score: number;
    status: "EXCELLENT" | "GOOD" | "NEEDS_WORK" | "CRITICAL";
    issues: string[];
    recommendations: string[];
  };
}

export default function AdminSeoDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [counts, setCounts] = useState<CountsData | null>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [entities, setEntities] = useState<EntityItem[]>([]);
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/seo/dashboard");
      const json = await res.json();
      if (json.success) {
        setHealth(json.data.health);
        setCounts(json.data.counts);
        setIssues(json.data.issues || []);
        setEntities(json.data.entities || []);
      }
    } catch (err) {
      console.error("Failed to load SEO dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-700 bg-emerald-50 border-emerald-300";
    if (score >= 70) return "text-amber-700 bg-amber-50 border-amber-300";
    return "text-rose-700 bg-rose-50 border-rose-300";
  };

  const filteredEntities = entities.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.seoTitle || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.focusKeyword || "").toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "ALL" || e.entityType.toLowerCase() === filterType.toLowerCase();
    const matchesStatus =
      filterStatus === "ALL" ||
      (filterStatus === "NEEDS_WORK" && (e.audit.status === "NEEDS_WORK" || e.audit.status === "CRITICAL")) ||
      (filterStatus === "GOOD" && (e.audit.status === "GOOD" || e.audit.status === "EXCELLENT"));
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-warm-200/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-brand-gold-600 uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4" />
            <span>Enterprise Search Engine Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy-950">
            SEO & Discovery Center
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy-600">
            Manage technical SEO, on-page metadata, local ranking in Islamabad & Rawalpindi, and 301 redirects.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Link
            href="/sitemap.xml"
            target="_blank"
            className="p-2.5 rounded-xl border border-brand-warm-300 text-xs font-semibold text-brand-navy-700 hover:bg-brand-warm-100 flex items-center space-x-1.5"
          >
            <span>XML Sitemap</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <Link
            href="/robots.txt"
            target="_blank"
            className="p-2.5 rounded-xl border border-brand-warm-300 text-xs font-semibold text-brand-navy-700 hover:bg-brand-warm-100 flex items-center space-x-1.5"
          >
            <span>Robots.txt</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-xl border border-brand-warm-300 text-brand-navy-700 hover:bg-brand-warm-100"
            title="Refresh SEO Audit"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Submenu */}
      <div className="flex flex-wrap gap-2 border-b border-brand-warm-200 pb-3">
        <Link
          href="/admin/seo"
          className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-navy-950 text-white shadow-sm flex items-center space-x-1.5"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>SEO Health Dashboard</span>
        </Link>
        <Link
          href="/admin/seo/pages"
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-warm-100 text-brand-navy-700 hover:bg-brand-warm-200 transition-colors flex items-center space-x-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Pages & Entities SEO</span>
        </Link>
        <Link
          href="/admin/seo/locations"
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-warm-100 text-brand-navy-700 hover:bg-brand-warm-200 transition-colors flex items-center space-x-1.5"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Local SEO Hubs</span>
        </Link>
        <Link
          href="/admin/seo/redirects"
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-warm-100 text-brand-navy-700 hover:bg-brand-warm-200 transition-colors flex items-center space-x-1.5"
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>301 Redirects</span>
        </Link>
        <Link
          href="/admin/seo/settings"
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-warm-100 text-brand-navy-700 hover:bg-brand-warm-200 transition-colors flex items-center space-x-1.5"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Global Business NAP</span>
        </Link>
      </div>

      {loading ? (
        <div className="card-luxury py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-gold-600 animate-spin mx-auto" />
          <p className="text-xs text-brand-navy-600">Performing live site SEO audit...</p>
        </div>
      ) : (
        <>
          {/* SEO Health Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Primary Health Gauge */}
            <div className="card-luxury p-6 bg-gradient-to-br from-brand-navy-950 to-brand-navy-900 text-white space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-brand-gold-400 uppercase tracking-widest">
                    Overall SEO Health
                  </span>
                  <ShieldCheck className="w-5 h-5 text-brand-gold-400" />
                </div>
                <div className="mt-4 flex items-baseline space-x-3">
                  <span className="text-5xl font-serif font-bold text-white">
                    {health?.overallScore || 0}%
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                    {health?.overallScore && health.overallScore >= 85 ? "Excellent Status" : "Good — Optimizable"}
                  </span>
                </div>
                <p className="text-xs text-brand-warm-300 mt-2 leading-relaxed">
                  Real-time algorithmic score calculated from {counts?.totalEntities} database entities, metadata lengths, focus keywords, and local Islamabad/Rawalpindi schemas.
                </p>
              </div>

              <div className="pt-4 border-t border-brand-navy-800 flex items-center justify-between text-xs">
                <span className="text-brand-warm-300">Indexable Pages:</span>
                <span className="font-bold text-white">{counts?.totalIndexablePages} Active URLs</span>
              </div>
            </div>

            {/* Category Breakdown Progress */}
            <div className="card-luxury p-6 lg:col-span-2 space-y-4">
              <h3 className="font-serif font-bold text-sm text-brand-navy-950">
                SEO Category Performance Breakdown
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 p-3 rounded-xl bg-brand-warm-50 border border-brand-warm-200">
                  <div className="flex justify-between font-semibold">
                    <span className="text-brand-navy-900">Technical SEO</span>
                    <span className="text-emerald-700">{health?.technicalScore}%</span>
                  </div>
                  <div className="w-full bg-brand-warm-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full" style={{ width: `${health?.technicalScore}%` }} />
                  </div>
                  <p className="text-[10px] text-brand-navy-500">Sitemap, Robots.txt, 301 redirects, SSR</p>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-brand-warm-50 border border-brand-warm-200">
                  <div className="flex justify-between font-semibold">
                    <span className="text-brand-navy-900">On-Page Metadata</span>
                    <span className="text-emerald-700">{health?.onPageScore}%</span>
                  </div>
                  <div className="w-full bg-brand-warm-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full" style={{ width: `${health?.onPageScore}%` }} />
                  </div>
                  <p className="text-[10px] text-brand-navy-500">Titles (30-60 chars) & Meta Descriptions</p>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-brand-warm-50 border border-brand-warm-200">
                  <div className="flex justify-between font-semibold">
                    <span className="text-brand-navy-900">Image SEO & Alt Text</span>
                    <span className="text-brand-gold-700">{health?.imageScore}%</span>
                  </div>
                  <div className="w-full bg-brand-warm-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-brand-gold-500 h-full" style={{ width: `${health?.imageScore}%` }} />
                  </div>
                  <p className="text-[10px] text-brand-navy-500">{counts?.totalImages} Media Assets audited</p>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-brand-warm-50 border border-brand-warm-200">
                  <div className="flex justify-between font-semibold">
                    <span className="text-brand-navy-900">Local SEO (Islamabad/Rwp)</span>
                    <span className="text-emerald-700">{health?.localSeoScore}%</span>
                  </div>
                  <div className="w-full bg-brand-warm-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full" style={{ width: `${health?.localSeoScore}%` }} />
                  </div>
                  <p className="text-[10px] text-brand-navy-500">Hubs, LocalBusiness JSON-LD & NAP</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="card-luxury p-4 space-y-1">
              <span className="text-[11px] text-brand-navy-500">Total Entities</span>
              <p className="text-xl font-serif font-bold text-brand-navy-950">{counts?.totalEntities}</p>
            </div>
            <div className="card-luxury p-4 space-y-1">
              <span className="text-[11px] text-brand-navy-500">Missing Titles</span>
              <p className={`text-xl font-serif font-bold ${counts?.missingTitles ? "text-rose-600" : "text-emerald-600"}`}>
                {counts?.missingTitles}
              </p>
            </div>
            <div className="card-luxury p-4 space-y-1">
              <span className="text-[11px] text-brand-navy-500">Missing Descriptions</span>
              <p className={`text-xl font-serif font-bold ${counts?.missingDescriptions ? "text-amber-600" : "text-emerald-600"}`}>
                {counts?.missingDescriptions}
              </p>
            </div>
            <div className="card-luxury p-4 space-y-1">
              <span className="text-[11px] text-brand-navy-500">Missing Alt Text</span>
              <p className={`text-xl font-serif font-bold ${counts?.missingAltImages ? "text-amber-600" : "text-emerald-600"}`}>
                {counts?.missingAltImages}
              </p>
            </div>
            <div className="card-luxury p-4 space-y-1">
              <span className="text-[11px] text-brand-navy-500">Active Redirects</span>
              <p className="text-xl font-serif font-bold text-brand-navy-950">{counts?.totalRedirects}</p>
            </div>
            <div className="card-luxury p-4 space-y-1">
              <span className="text-[11px] text-brand-navy-500">Redirect Hits</span>
              <p className="text-xl font-serif font-bold text-brand-gold-700">{counts?.totalRedirectHits}</p>
            </div>
          </div>

          {/* Action Items List */}
          {issues.length > 0 && (
            <div className="card-luxury p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-rose-700">
                  <AlertTriangle className="w-4 h-4" />
                  <h3 className="font-serif font-bold text-sm text-brand-navy-950">
                    High Priority Action Items ({issues.length})
                  </h3>
                </div>
                <Link
                  href="/admin/seo/pages"
                  className="text-xs font-bold text-brand-gold-700 hover:text-brand-gold-800 flex items-center space-x-1"
                >
                  <span>Resolve All in Pages SEO</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {issues.map((iss, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="badge-gold bg-brand-navy-950 text-brand-gold-300 text-[9px] px-1.5 py-0.2">
                          {iss.entityType}
                        </span>
                        <span className="font-semibold text-brand-navy-950 truncate max-w-[140px]">
                          {iss.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-rose-800">{iss.issue}</p>
                    </div>
                    <Link
                      href="/admin/seo/pages"
                      className="text-xs font-bold text-brand-gold-700 hover:text-brand-gold-900 shrink-0 mt-1"
                    >
                      Fix →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Entity Health Explorer */}
          <div className="card-luxury p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-warm-200 pb-4">
              <div>
                <h3 className="font-serif font-bold text-base text-brand-navy-950">
                  Website Pages & Entity SEO Health
                </h3>
                <p className="text-xs text-brand-navy-600">
                  Audit scores, title lengths, focus keywords, and indexing status for every route.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-brand-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search page or theme..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 text-xs">
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
                  {t === "ALL" ? "All Types" : `${t}s`}
                </button>
              ))}

              <div className="h-6 w-px bg-brand-warm-300 mx-1 self-center hidden sm:block" />

              <button
                onClick={() => setFilterStatus(filterStatus === "NEEDS_WORK" ? "ALL" : "NEEDS_WORK")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  filterStatus === "NEEDS_WORK"
                    ? "bg-rose-600 text-white"
                    : "bg-brand-warm-100 text-brand-navy-700 hover:bg-brand-warm-200"
                }`}
              >
                Needs Attention
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-brand-warm-200 text-brand-navy-500 font-semibold">
                    <th className="py-3 px-3">Entity</th>
                    <th className="py-3 px-3">SEO Title</th>
                    <th className="py-3 px-3">Focus Keyword</th>
                    <th className="py-3 px-3 text-center">Score</th>
                    <th className="py-3 px-3 text-center">Indexing</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-warm-200/70">
                  {filteredEntities.map((item) => (
                    <tr key={item.id} className="hover:bg-brand-warm-50/60 transition-colors">
                      <td className="py-3 px-3">
                        <div className="space-y-0.5">
                          <span className="badge-gold bg-brand-navy-950 text-brand-gold-300 text-[9px] px-1.5 py-0.2">
                            {item.entityType}
                          </span>
                          <p className="font-bold text-brand-navy-950 truncate max-w-[180px]">{item.title}</p>
                          <p className="text-[10px] text-brand-navy-500 font-mono truncate max-w-[180px]">{item.url}</p>
                        </div>
                      </td>
                      <td className="py-3 px-3 max-w-[240px]">
                        <p className="text-brand-navy-800 line-clamp-1 font-medium">{item.seoTitle || "—"}</p>
                        <p className="text-[10px] text-brand-navy-500 line-clamp-1">{item.seoDescription || "—"}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-brand-navy-700 font-mono text-[11px]">
                          {item.focusKeyword || "None"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold ${getScoreColor(item.audit.score)}`}>
                          {item.audit.score}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {!item.noIndex ? (
                          <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full">
                            Index
                          </span>
                        ) : (
                          <span className="text-rose-700 font-semibold text-[11px] bg-rose-50 px-2 py-0.5 rounded-full">
                            Noindex
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/admin/seo/pages?search=${encodeURIComponent(item.title)}`}
                          className="p-1.5 text-xs font-bold text-brand-gold-700 hover:text-brand-gold-900"
                        >
                          Edit SEO →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
