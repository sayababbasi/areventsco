"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Save,
  Loader2,
  Building,
  Phone,
  Mail,
  MapPin,
  Globe,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form Fields
  const [companyName, setCompanyName] = useState("AR Events Co.");
  const [tagline, setTagline] = useState("YOUR CELEBRATION, OUR PASSION");
  const [phone, setPhone] = useState("+92 316 0513841");
  const [whatsapp, setWhatsapp] = useState("+92 316 0513841");
  const [email, setEmail] = useState("sayababbasi0@gmail.com");
  const [address, setAddress] = useState("Main Boulevard, Sector F-7 / Bahria Town Phase 7, Islamabad & Rawalpindi");
  const [serviceAreas, setServiceAreas] = useState("Islamabad (All Sectors) & Rawalpindi (Bahria Town, DHA, Cantt)");
  const [metaTitle, setMetaTitle] = useState("AR Events Co. | Premier Birthday Decoration & Event Styling in Islamabad & Rawalpindi");
  const [metaDescription, setMetaDescription] = useState("Luxury birthday themes, balloon arches, 3D marquee letters, and on-site decoration styling across the Twin Cities.");

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/settings");
      const json = await res.json();
      if (json.success && json.data) {
        const s = json.data;
        if (s.company_name) setCompanyName(s.company_name);
        if (s.tagline) setTagline(s.tagline);
        if (s.contact_phone) setPhone(s.contact_phone);
        if (s.contact_whatsapp) setWhatsapp(s.contact_whatsapp);
        if (s.contact_email) setEmail(s.contact_email);
        if (s.office_address) setAddress(s.office_address);
        if (s.service_areas) setServiceAreas(s.service_areas);
        if (s.meta_title) setMetaTitle(s.meta_title);
        if (s.meta_description) setMetaDescription(s.meta_description);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const payload = {
        company_name: companyName,
        tagline,
        contact_phone: phone,
        contact_whatsapp: whatsapp,
        contact_email: email,
        office_address: address,
        service_areas: serviceAreas,
        meta_title: metaTitle,
        meta_description: metaDescription,
      };

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-warm-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-brand-gold-600 uppercase tracking-wider font-semibold">
            <Settings className="w-3.5 h-3.5" />
            <span>Platform Configuration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-brand-navy-950 font-bold mt-1">
            Business Settings & SEO
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy-600 mt-1">
            Central source of truth for business contact numbers, Twin Cities coverage zones, branding, and local SEO.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      {/* FORM */}
      <form onSubmit={handleSaveSettings} className="space-y-8 text-xs">
        {/* Business Identity */}
        <div className="bg-white p-6 rounded-2xl border border-brand-warm-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-brand-navy-950 flex items-center space-x-2">
            <Building className="w-4 h-4 text-brand-gold-600" />
            <span>Company Branding & Tagline</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-brand-navy-900 mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-brand-navy-950 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-brand-navy-900 mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-brand-navy-950"
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers & Channels */}
        <div className="bg-white p-6 rounded-2xl border border-brand-warm-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-brand-navy-950 flex items-center space-x-2">
            <Phone className="w-4 h-4 text-brand-gold-600" />
            <span>Twin Cities Contact Channels</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-brand-navy-900 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block font-bold text-brand-navy-900 mb-1">WhatsApp Hotline</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block font-bold text-brand-navy-900 mb-1">Support Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-brand-navy-900 mb-1">Office / Studio Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-brand-navy-900 mb-1">Service Coverage Zones</label>
            <input
              type="text"
              value={serviceAreas}
              onChange={(e) => setServiceAreas(e.target.value)}
              className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl"
            />
          </div>
        </div>

        {/* Local SEO */}
        <div className="bg-white p-6 rounded-2xl border border-brand-warm-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-brand-navy-950 flex items-center space-x-2">
            <Globe className="w-4 h-4 text-brand-gold-600" />
            <span>Search Engine Optimization (SEO)</span>
          </h3>

          <div>
            <label className="block font-bold text-brand-navy-900 mb-1">Global Meta Title</label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-brand-navy-950 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-brand-navy-900 mb-1">Global Meta Description</label>
            <textarea
              rows={3}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-brand-navy-950"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="btn-gold px-8 py-3 text-xs font-semibold flex items-center space-x-2 shadow-md"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save All Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
