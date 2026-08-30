"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Compass,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  ArrowLeft,
  Globe,
  MapPin,
  Phone,
  Clock,
  Share2,
} from "lucide-react";

export default function AdminSeoSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [settings, setSettings] = useState({
    seo_site_title: "",
    seo_default_description: "",
    seo_canonical_domain: "https://areventsco.com",
    seo_default_og_image: "/images/hero/hero_birthday_lawn.jpg",
    seo_business_name: "AR Events Co.",
    seo_business_phone: "+92 300 8555123",
    seo_business_whatsapp: "+92 300 8555123",
    seo_business_email: "info@areventsco.com",
    seo_business_address: "Sector F-7 / Blue Area & Bahria Town Phase 7",
    seo_business_city: "Islamabad",
    seo_geo_lat: "33.7294",
    seo_geo_lng: "73.0931",
    seo_opening_hours: "Mo-Su 10:00-22:00",
    seo_google_site_verification: "",
    seo_social_instagram: "https://instagram.com/areventsco",
    seo_social_facebook: "https://facebook.com/areventsco",
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/seo/settings");
      const json = await res.json();
      if (json.success && json.data) {
        setSettings((prev) => ({ ...prev, ...json.data }));
      }
    } catch (err) {
      console.error("Failed to load SEO settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/seo/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to save settings.");

      showToast("Global SEO & Business NAP settings saved successfully.");
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setSaveLoading(false);
    }
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
            Global SEO & Business NAP Settings
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy-600">
            Configure site-wide title defaults, Schema.org LocalBusiness NAP data, geo-coordinates, and search verification.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saveLoading}
          className="btn-gold text-xs px-5 py-2.5 flex items-center justify-center space-x-2 shadow-sm shrink-0"
        >
          {saveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      {loading ? (
        <div className="card-luxury py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-gold-600 animate-spin mx-auto" />
          <p className="text-xs text-brand-navy-600">Loading settings...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Global Meta Settings */}
          <div className="card-luxury p-6 space-y-5">
            <div className="flex items-center space-x-2 text-xs font-mono text-brand-gold-600 uppercase tracking-wider border-b border-brand-warm-200 pb-3">
              <Globe className="w-4 h-4" />
              <span className="font-bold">Global Site Metadata</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 md:col-span-2">
                <label className="font-semibold text-brand-navy-900">Default Site Title</label>
                <input
                  type="text"
                  value={settings.seo_site_title}
                  onChange={(e) => setSettings({ ...settings, seo_site_title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="font-semibold text-brand-navy-900">Default Meta Description</label>
                <textarea
                  rows={2}
                  value={settings.seo_default_description}
                  onChange={(e) => setSettings({ ...settings, seo_default_description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-brand-navy-900">Canonical Domain</label>
                <input
                  type="text"
                  value={settings.seo_canonical_domain}
                  onChange={(e) => setSettings({ ...settings, seo_canonical_domain: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-brand-navy-900">Default Open Graph Image</label>
                <input
                  type="text"
                  value={settings.seo_default_og_image}
                  onChange={(e) => setSettings({ ...settings, seo_default_og_image: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white font-mono"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="font-semibold text-brand-navy-900">Google Search Console Verification Token</label>
                <input
                  type="text"
                  value={settings.seo_google_site_verification}
                  onChange={(e) => setSettings({ ...settings, seo_google_site_verification: e.target.value })}
                  placeholder="google-site-verification=..."
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* 2. Local Business NAP */}
          <div className="card-luxury p-6 space-y-5">
            <div className="flex items-center space-x-2 text-xs font-mono text-brand-gold-600 uppercase tracking-wider border-b border-brand-warm-200 pb-3">
              <MapPin className="w-4 h-4" />
              <span className="font-bold">Local Business NAP (Name, Address, Phone for Local SEO)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-brand-navy-900">Business Name</label>
                <input
                  type="text"
                  value={settings.seo_business_name}
                  onChange={(e) => setSettings({ ...settings, seo_business_name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-brand-navy-900">Primary Phone</label>
                <input
                  type="text"
                  value={settings.seo_business_phone}
                  onChange={(e) => setSettings({ ...settings, seo_business_phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-brand-navy-900">WhatsApp Number</label>
                <input
                  type="text"
                  value={settings.seo_business_whatsapp}
                  onChange={(e) => setSettings({ ...settings, seo_business_whatsapp: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-brand-navy-900">Official Email</label>
                <input
                  type="email"
                  value={settings.seo_business_email}
                  onChange={(e) => setSettings({ ...settings, seo_business_email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-brand-navy-900">Physical Address / Headquarters</label>
                <input
                  type="text"
                  value={settings.seo_business_address}
                  onChange={(e) => setSettings({ ...settings, seo_business_address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-brand-navy-900">Primary City</label>
                <input
                  type="text"
                  value={settings.seo_business_city}
                  onChange={(e) => setSettings({ ...settings, seo_business_city: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-brand-navy-900">Latitude (GPS)</label>
                <input
                  type="text"
                  value={settings.seo_geo_lat}
                  onChange={(e) => setSettings({ ...settings, seo_geo_lat: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-brand-navy-900">Longitude (GPS)</label>
                <input
                  type="text"
                  value={settings.seo_geo_lng}
                  onChange={(e) => setSettings({ ...settings, seo_geo_lng: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white font-mono"
                />
              </div>

              <div className="space-y-1 sm:col-span-3">
                <label className="font-semibold text-brand-navy-900">Opening Hours Specification</label>
                <input
                  type="text"
                  value={settings.seo_opening_hours}
                  onChange={(e) => setSettings({ ...settings, seo_opening_hours: e.target.value })}
                  placeholder="Mo-Su 10:00-22:00"
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* 3. Social Profiles */}
          <div className="card-luxury p-6 space-y-5">
            <div className="flex items-center space-x-2 text-xs font-mono text-brand-gold-600 uppercase tracking-wider border-b border-brand-warm-200 pb-3">
              <Share2 className="w-4 h-4" />
              <span className="font-bold">Social Profiles (SameAs Schema)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-brand-navy-900">Instagram Profile URL</label>
                <input
                  type="text"
                  value={settings.seo_social_instagram}
                  onChange={(e) => setSettings({ ...settings, seo_social_instagram: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-brand-navy-900">Facebook Page URL</label>
                <input
                  type="text"
                  value={settings.seo_social_facebook}
                  onChange={(e) => setSettings({ ...settings, seo_social_facebook: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saveLoading}
              className="btn-gold px-8 py-3 font-bold text-sm shadow-lg flex items-center space-x-2"
            >
              {saveLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save All Settings</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
