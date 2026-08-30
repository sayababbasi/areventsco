"use client";

import React, { useState } from "react";
import {
  Globe,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Monitor,
  Share2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { calculateSeoScore, SeoEntity } from "@/lib/seo";

interface SeoFormSectionProps {
  formData: {
    seoTitle?: string;
    seoDescription?: string;
    focusKeyword?: string;
    secondaryKeywords?: string;
    canonicalUrl?: string;
    ogImage?: string;
    noIndex?: boolean;
    noFollow?: boolean;
    title?: string;
    name?: string;
    description?: string;
    slug?: string;
  };
  onChange: (field: string, value: any) => void;
  entityType?: string;
}

export function SeoFormSection({
  formData,
  onChange,
  entityType = "Content",
}: SeoFormSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile" | "social">("desktop");

  const title = formData.seoTitle || formData.title || formData.name || "AR Events Co.";
  const description =
    formData.seoDescription ||
    formData.description ||
    "Luxury birthday decoration and party styling in Islamabad & Rawalpindi.";
  const focusKeyword = formData.focusKeyword || "";
  const slug = formData.slug || "item";
  const ogImage = formData.ogImage || "/images/hero/hero_birthday_lawn.jpg";

  const entityForScore: SeoEntity = {
    title: formData.title || formData.name,
    seoTitle: formData.seoTitle,
    seoDescription: formData.seoDescription,
    description: formData.description,
    focusKeyword: formData.focusKeyword,
    ogImage: formData.ogImage,
    noIndex: formData.noIndex,
  };

  const audit = calculateSeoScore(entityForScore);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-700 bg-emerald-50 border-emerald-300";
    if (score >= 70) return "text-amber-700 bg-amber-50 border-amber-300";
    return "text-rose-700 bg-rose-50 border-rose-300";
  };

  return (
    <div className="border border-brand-warm-300 rounded-2xl p-5 bg-brand-warm-50/50 space-y-5">
      {/* Header with Live Score */}
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-brand-gold-500/20 text-brand-gold-600 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-brand-navy-950">
              Search Engine Optimization (SEO & Social Sharing)
            </h4>
            <p className="text-[11px] text-brand-navy-600">
              Configure Google SERP title, meta description, keywords, and Open Graph card.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`px-2.5 py-1 rounded-full border text-xs font-mono font-bold flex items-center space-x-1.5 ${getScoreColor(audit.score)}`}>
            <span>SEO Score: {audit.score}/100</span>
          </div>
          <button type="button" className="text-brand-navy-500 hover:text-brand-navy-900">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-6 pt-3 border-t border-brand-warm-200">
          {/* Live Preview Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-navy-800">
                Live Search & Social Preview
              </span>
              <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-brand-warm-200 text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop")}
                  className={`px-2 py-1 rounded flex items-center space-x-1 ${
                    previewMode === "desktop"
                      ? "bg-brand-navy-950 text-white font-semibold"
                      : "text-brand-navy-600 hover:bg-brand-warm-100"
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  <span>Google Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile")}
                  className={`px-2 py-1 rounded flex items-center space-x-1 ${
                    previewMode === "mobile"
                      ? "bg-brand-navy-950 text-white font-semibold"
                      : "text-brand-navy-600 hover:bg-brand-warm-100"
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Google Mobile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("social")}
                  className={`px-2 py-1 rounded flex items-center space-x-1 ${
                    previewMode === "social"
                      ? "bg-brand-navy-950 text-white font-semibold"
                      : "text-brand-navy-600 hover:bg-brand-warm-100"
                  }`}
                >
                  <Share2 className="w-3 h-3" />
                  <span>Social Share (OG)</span>
                </button>
              </div>
            </div>

            {/* Google Preview Container */}
            {previewMode !== "social" ? (
              <div className={`p-4 bg-white rounded-xl border border-brand-warm-200 space-y-1 ${previewMode === "mobile" ? "max-w-md mx-auto" : ""}`}>
                <div className="flex items-center space-x-2 text-xs text-[#202124]">
                  <div className="w-4 h-4 rounded-full bg-brand-navy-950 flex items-center justify-center text-[9px] text-brand-gold-300 font-bold">
                    AR
                  </div>
                  <span className="font-medium text-xs">AR Events Co.</span>
                  <span className="text-gray-400">›</span>
                  <span className="text-gray-500 text-[11px] truncate">
                    https://areventsco.com/{slug}
                  </span>
                </div>
                <h4 className="text-base text-[#1a0dab] hover:underline font-medium cursor-pointer line-clamp-1">
                  {title}
                </h4>
                <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                  {description}
                </p>
              </div>
            ) : (
              /* Social Share Card Preview */
              <div className="max-w-md mx-auto bg-white rounded-xl border border-brand-warm-300 overflow-hidden shadow-sm">
                <div className="h-40 w-full bg-brand-navy-900 relative">
                  <img
                    src={ogImage}
                    alt="Social Share"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                    1200 x 630 OG Preview
                  </div>
                </div>
                <div className="p-3.5 space-y-1 bg-brand-warm-50/50">
                  <span className="text-[10px] uppercase tracking-wider text-brand-navy-500 font-mono">
                    AREVENTSCO.COM
                  </span>
                  <h5 className="font-bold text-xs text-brand-navy-950 line-clamp-1">
                    {title}
                  </h5>
                  <p className="text-[11px] text-brand-navy-600 line-clamp-2">
                    {description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-brand-navy-900">
                  Custom SEO Title
                </label>
                <span className={`text-[10px] font-mono ${title.length > 65 || title.length < 30 ? "text-amber-600 font-bold" : "text-emerald-700"}`}>
                  {title.length}/65 characters (ideal: 30–60)
                </span>
              </div>
              <input
                type="text"
                value={formData.seoTitle || ""}
                onChange={(e) => onChange("seoTitle", e.target.value)}
                placeholder="e.g. Lavender Dream Birthday Theme in Islamabad | AR Events Co."
                className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-brand-navy-900">
                  SEO Meta Description
                </label>
                <span className={`text-[10px] font-mono ${description.length > 165 || description.length < 120 ? "text-amber-600 font-bold" : "text-emerald-700"}`}>
                  {description.length}/165 characters (ideal: 120–160)
                </span>
              </div>
              <textarea
                rows={3}
                value={formData.seoDescription || ""}
                onChange={(e) => onChange("seoDescription", e.target.value)}
                placeholder="Compelling 140–160 character description designed to maximize click-through rate on Google search results..."
                className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-brand-navy-900">
                Primary Focus Keyword
              </label>
              <input
                type="text"
                value={formData.focusKeyword || ""}
                onChange={(e) => onChange("focusKeyword", e.target.value)}
                placeholder="e.g. birthday decoration Islamabad"
                className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-brand-navy-900">
                Canonical URL Override (Optional)
              </label>
              <input
                type="text"
                value={formData.canonicalUrl || ""}
                onChange={(e) => onChange("canonicalUrl", e.target.value)}
                placeholder="https://areventsco.com/..."
                className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="font-semibold text-brand-navy-900">
                Social Share Image (OG Image URL)
              </label>
              <input
                type="text"
                value={formData.ogImage || ""}
                onChange={(e) => onChange("ogImage", e.target.value)}
                placeholder="/images/themes/... or https://..."
                className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
              />
            </div>

            <div className="flex items-center space-x-6 md:col-span-2 pt-2">
              <label className="flex items-center space-x-2 text-xs font-semibold text-brand-navy-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.noIndex || false}
                  onChange={(e) => onChange("noIndex", e.target.checked)}
                  className="w-4 h-4 text-brand-gold-600 rounded"
                />
                <span className={formData.noIndex ? "text-rose-600 font-bold" : ""}>
                  Block Search Engines (noindex)
                </span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-semibold text-brand-navy-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.noFollow || false}
                  onChange={(e) => onChange("noFollow", e.target.checked)}
                  className="w-4 h-4 text-brand-gold-600 rounded"
                />
                <span>Do Not Follow Links (nofollow)</span>
              </label>
            </div>
          </div>

          {/* Actionable Recommendations */}
          {audit.recommendations.length > 0 && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5 text-xs text-amber-900">
              <div className="font-bold flex items-center space-x-1.5 text-amber-800">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>SEO Improvement Suggestions:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
                {audit.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
