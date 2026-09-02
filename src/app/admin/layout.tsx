"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Layers,
  Users,
  CreditCard,
  Settings,
  Sparkles,
  Home,
  LogOut,
  Palette,
  Package,
  Wrench,
  PlusCircle,
  FolderTree,
  MapPin,
  UserCheck,
  Boxes,
  FileText,
  Tag,
  Image as ImageIcon,
  Star,
  HelpCircle,
  FileCode,
  Activity,
  BarChart3,
  MessageSquareQuote,
  Building,
  Globe,
  Link2,
  Compass,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigationSections = [
    {
      title: "MAIN MENU",
      items: [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Bookings", href: "/admin/bookings", icon: Layers },
        { name: "Calendar", href: "/admin/calendar", icon: Calendar },
        { name: "Customers", href: "/admin/customers", icon: Users },
        { name: "Leads & Inquiries", href: "/admin/inquiries", icon: MessageSquareQuote },
      ],
    },
    {
      title: "CATALOG",
      items: [
        { name: "Themes", href: "/admin/themes", icon: Palette },
        { name: "Packages", href: "/admin/packages", icon: Package },
        { name: "Services", href: "/admin/services", icon: Wrench },
        { name: "Add-ons", href: "/admin/addons", icon: PlusCircle },
        { name: "All Catalog", href: "/admin/catalog", icon: FolderTree },
      ],
    },
    {
      title: "SEO & DISCOVERY",
      items: [
        { name: "SEO Dashboard", href: "/admin/seo", icon: Globe },
        { name: "Pages & Entities", href: "/admin/seo/pages", icon: FileText },
        { name: "Local SEO Hubs", href: "/admin/seo/locations", icon: MapPin },
        { name: "301 Redirects", href: "/admin/seo/redirects", icon: Link2 },
        { name: "Business NAP", href: "/admin/seo/settings", icon: Compass },
      ],
    },
    {
      title: "OPERATIONS",
      items: [
        { name: "Venues", href: "/admin/venues", icon: Building },
        { name: "Staff & Teams", href: "/admin/staff", icon: UserCheck },
        { name: "Inventory", href: "/admin/inventory", icon: Boxes },
      ],
    },
    {
      title: "FINANCE",
      items: [
        { name: "Payments", href: "/admin/payments", icon: CreditCard },
        { name: "Invoices", href: "/admin/invoices", icon: FileText },
        { name: "Coupons & Discounts", href: "/admin/coupons", icon: Tag },
      ],
    },
    {
      title: "MARKETING & CMS",
      items: [
        { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
        { name: "Reviews & Testimonials", href: "/admin/reviews", icon: Star },
        { name: "FAQs", href: "/admin/faqs", icon: HelpCircle },
        { name: "Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-brand-warm-50 flex flex-col lg:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-brand-navy-950 text-white flex-shrink-0 flex flex-col justify-between border-r border-brand-navy-800 lg:h-screen lg:sticky lg:top-0">
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {/* Brand Header */}
          <div className="p-6 border-b border-brand-navy-800 bg-brand-navy-950/60 sticky top-0 z-10 backdrop-blur-md">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/brand/arevents logo.png"
                alt="AR Events Co."
                width={180}
                height={50}
                className="h-10 w-auto object-contain brightness-110"
              />
            </Link>
            <div className="mt-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-mono text-brand-gold-400 font-bold uppercase tracking-wider">
                  Operations Center
                </span>
              </div>
              <span className="text-[10px] text-brand-navy-400 font-mono">v1.0 Pro</span>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="p-4 mx-3 my-3 bg-brand-navy-900/90 rounded-xl border border-brand-navy-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-gold-600 to-brand-gold-400 text-brand-navy-950 font-bold flex items-center justify-center text-xs shadow-md">
                SA
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Sayab Abbasi</p>
                <p className="text-[10px] text-brand-gold-400 font-medium">CEO & Lead Architect</p>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full font-mono">
              Online
            </span>
          </div>

          {/* Navigation Sections */}
          <nav className="p-3 space-y-6">
            {navigationSections.map((section, idx) => (
              <div key={idx} className="space-y-1">
                <p className="px-3 text-[10px] font-bold font-mono tracking-widest text-brand-navy-400 uppercase">
                  {section.title}
                </p>
                <div className="space-y-0.5 pt-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-brand-gold-600/20 to-brand-gold-600/10 text-brand-gold-300 font-semibold border-l-2 border-brand-gold-400"
                            : "text-brand-navy-200 hover:bg-brand-navy-900 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <item.icon
                            className={`w-4 h-4 ${isActive ? "text-brand-gold-400" : "text-brand-navy-400"}`}
                          />
                          <span>{item.name}</span>
                        </div>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-400" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* User / Logout Bottom Bar */}
        <div className="p-3.5 border-t border-brand-navy-800 bg-brand-navy-950 flex items-center justify-between text-xs text-brand-navy-400">
          <Link href="/" className="hover:text-white flex items-center space-x-1.5 px-2 py-1 rounded-md hover:bg-brand-navy-900 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </Link>
          <Link href="/login" className="hover:text-rose-400 flex items-center space-x-1.5 px-2 py-1 rounded-md hover:bg-brand-navy-900 transition-colors">
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Workspace Area */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
