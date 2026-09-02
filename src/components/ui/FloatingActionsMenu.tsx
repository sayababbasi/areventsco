"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Headphones,
  Tag,
  Mail,
  MessageCircle,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { usePopup } from "./ModalProvider";

export function FloatingActionsMenu() {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const { toast } = usePopup();

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(true);
    toast(`Promo code "${code}" copied to clipboard! (10% OFF)`, "success");
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 select-none">
      <div className="flex flex-col bg-brand-navy-950/95 backdrop-blur-md border-l border-y border-brand-gold-500/40 rounded-l-2xl shadow-[0_10px_35px_rgba(0,0,0,0.45)] overflow-visible py-1.5 divide-y divide-brand-navy-800/60">
        
        {/* 1. CUSTOMER SUPPORT / CALL */}
        <div
          className="relative group"
          onMouseEnter={() => setActiveItem("support")}
          onMouseLeave={() => setActiveItem(null)}
        >
          <a
            href="tel:+923160513841"
            className="w-12 h-12 flex items-center justify-center text-brand-gold-300 hover:text-brand-navy-950 hover:bg-brand-gold-400 transition-all duration-200"
            aria-label="Customer Support"
          >
            <Headphones className="w-5 h-5 transition-transform group-hover:scale-110" />
          </a>

          {/* Flyout Tooltip Left */}
          {activeItem === "support" && (
            <div className="absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 animate-in fade-in slide-in-from-right-2 duration-200 pointer-events-auto">
              <div className="relative bg-brand-navy-950/98 backdrop-blur-lg border border-brand-gold-500/40 rounded-xl p-3.5 shadow-2xl w-60 text-white">
                {/* Arrow Pointer */}
                <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-brand-navy-950 border-t border-r border-brand-gold-500/40 rotate-45" />

                <div className="relative z-10 space-y-1">
                  <div className="flex items-center space-x-1.5 text-brand-gold-400">
                    <Headphones className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Customer Support</span>
                  </div>
                  <p className="text-sm font-semibold text-white tracking-wide">
                    +92 316 0513841
                  </p>
                  <p className="text-[11px] text-brand-navy-300">
                    Available 7 days: 10:00 AM – 10:00 PM
                  </p>
                  <div className="pt-1.5">
                    <a
                      href="tel:+923160513841"
                      className="inline-flex items-center text-xs font-semibold text-brand-gold-400 hover:text-brand-gold-300 underline underline-offset-2"
                    >
                      <span>Click to Call Now</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. SPECIAL OFFER / DISCOUNT */}
        <div
          className="relative group"
          onMouseEnter={() => setActiveItem("offer")}
          onMouseLeave={() => setActiveItem(null)}
        >
          <button
            type="button"
            onClick={() => handleCopyCoupon("ISLAMABAD10")}
            className="w-12 h-12 flex items-center justify-center text-brand-gold-300 hover:text-brand-navy-950 hover:bg-brand-gold-400 transition-all duration-200"
            aria-label="Special Offers"
          >
            <Tag className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>

          {/* Flyout Tooltip Left */}
          {activeItem === "offer" && (
            <div className="absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 animate-in fade-in slide-in-from-right-2 duration-200 pointer-events-auto">
              <div className="relative bg-brand-navy-950/98 backdrop-blur-lg border border-brand-gold-500/40 rounded-xl p-3.5 shadow-2xl w-64 text-white">
                {/* Arrow Pointer */}
                <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-brand-navy-950 border-t border-r border-brand-gold-500/40 rotate-45" />

                <div className="relative z-10 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-brand-gold-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Special Offer</span>
                  </div>
                  <p className="text-xs font-semibold text-white">
                    Get 10% OFF Your Birthday Event!
                  </p>
                  <p className="text-[11px] text-brand-navy-300">
                    Valid for all Islamabad & Rawalpindi bookings.
                  </p>
                  
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyCoupon("ISLAMABAD10")}
                      className="flex items-center justify-between px-2.5 py-1.5 bg-brand-navy-900 border border-brand-gold-500/50 rounded-lg text-xs font-mono font-bold text-brand-gold-300 hover:bg-brand-navy-800 transition flex-1"
                    >
                      <span>ISLAMABAD10</span>
                      {copiedCoupon ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-brand-gold-400" />
                      )}
                    </button>
                    <Link
                      href="/book"
                      className="px-2.5 py-1.5 bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-navy-950 text-[11px] font-bold rounded-lg transition"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. EMAIL INQUIRY */}
        <div
          className="relative group"
          onMouseEnter={() => setActiveItem("email")}
          onMouseLeave={() => setActiveItem(null)}
        >
          <a
            href="mailto:info@areventsco.com"
            className="w-12 h-12 flex items-center justify-center text-brand-gold-300 hover:text-brand-navy-950 hover:bg-brand-gold-400 transition-all duration-200"
            aria-label="Email Us"
          >
            <Mail className="w-5 h-5 transition-transform group-hover:scale-110" />
          </a>

          {/* Flyout Tooltip Left */}
          {activeItem === "email" && (
            <div className="absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 animate-in fade-in slide-in-from-right-2 duration-200 pointer-events-auto">
              <div className="relative bg-brand-navy-950/98 backdrop-blur-lg border border-brand-gold-500/40 rounded-xl p-3.5 shadow-2xl w-60 text-white">
                {/* Arrow Pointer */}
                <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-brand-navy-950 border-t border-r border-brand-gold-500/40 rotate-45" />

                <div className="relative z-10 space-y-1">
                  <div className="flex items-center space-x-1.5 text-brand-gold-400">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Email Inquiry</span>
                  </div>
                  <p className="text-xs font-semibold text-white break-all">
                    info@areventsco.com
                  </p>
                  <p className="text-[11px] text-brand-navy-300">
                    Corporate & bespoke event coordination.
                  </p>
                  <div className="pt-1.5">
                    <a
                      href="mailto:info@areventsco.com"
                      className="inline-flex items-center text-xs font-semibold text-brand-gold-400 hover:text-brand-gold-300 underline underline-offset-2"
                    >
                      <span>Send an Email</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. WHATSAPP DIRECT */}
        <div
          className="relative group"
          onMouseEnter={() => setActiveItem("whatsapp")}
          onMouseLeave={() => setActiveItem(null)}
        >
          <a
            href="https://wa.me/923160513841"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 flex items-center justify-center text-brand-gold-300 hover:text-white hover:bg-emerald-600 transition-all duration-200"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
          </a>

          {/* Flyout Tooltip Left */}
          {activeItem === "whatsapp" && (
            <div className="absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 animate-in fade-in slide-in-from-right-2 duration-200 pointer-events-auto">
              <div className="relative bg-brand-navy-950/98 backdrop-blur-lg border border-brand-gold-500/40 rounded-xl p-3.5 shadow-2xl w-60 text-white">
                {/* Arrow Pointer */}
                <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-brand-navy-950 border-t border-r border-brand-gold-500/40 rotate-45" />

                <div className="relative z-10 space-y-1">
                  <div className="flex items-center space-x-1.5 text-emerald-400">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">WhatsApp Direct</span>
                  </div>
                  <p className="text-xs font-semibold text-white">
                    Chat with Event Lead
                  </p>
                  <p className="text-[11px] text-brand-navy-300">
                    Instant quotes, date checks & catalog samples.
                  </p>
                  <div className="pt-1.5">
                    <a
                      href="https://wa.me/923160513841"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                      <span>Open WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
