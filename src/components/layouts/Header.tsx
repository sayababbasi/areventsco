"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Calendar, Menu, X, Sparkles, User } from "lucide-react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Packages", href: "/packages" },
    { name: "Themes", href: "/themes" },
    { name: "Services", href: "/services" },
    { name: "Venues", href: "/venues" },
    { name: "Gallery", href: "/gallery" },
    { name: "Reviews", href: "/reviews" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-warm-200 shadow-subtle transition-all duration-300">
      {/* Top Bar for Location & Contact Info */}
      <div className="bg-brand-navy-950 text-brand-warm-100 py-1.5 px-4 text-xs font-medium border-b border-brand-navy-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-brand-gold-400">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-brand-gold-400" />
              Islamabad & Rawalpindi&apos;s Premier Birthday & Event Planners
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-6">
            <a
              href="https://wa.me/923160513841"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-brand-gold-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5 text-brand-gold-400" />
              +92 316 0513841
            </a>
            <Link
              href="/login"
              className="flex items-center hover:text-brand-gold-300 transition-colors"
            >
              <User className="w-3.5 h-3.5 mr-1 text-brand-gold-400" />
              Client Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative flex items-center h-14 w-auto transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/brand/website logo no bg.png"
                alt="AR Events Co. Logo"
                width={220}
                height={60}
                className="h-12 sm:h-14 w-auto object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-brand-navy-800 hover:text-brand-gold-600 transition-colors relative py-2"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA & Booking Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/book"
              className="btn-gold flex items-center space-x-2 text-sm font-semibold tracking-wide"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Your Event</span>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden items-center space-x-3">
            <Link
              href="/book"
              className="btn-gold py-2 px-3.5 text-xs flex items-center space-x-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book</span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-brand-navy-900 hover:bg-brand-warm-100 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-brand-navy-900" />
              ) : (
                <Menu className="w-6 h-6 text-brand-navy-900" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-brand-warm-200 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200 shadow-elevated">
          <div className="grid grid-cols-1 gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-md text-base font-medium text-brand-navy-900 hover:bg-brand-gold-50 hover:text-brand-gold-700 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-brand-warm-200 space-y-3">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-brand-navy-800 bg-brand-warm-100 rounded-lg hover:bg-brand-warm-200"
            >
              <User className="w-4 h-4 mr-2" />
              Client Dashboard / Login
            </Link>
            <Link
              href="/book"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-gold w-full flex items-center justify-center text-sm font-semibold py-3"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Your Event Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
