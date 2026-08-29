import Link from "next/link";
import Image from "next/image";
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
  ShieldAlert,
} from "lucide-react";

export const metadata = {
  title: "Admin Operations Center | AR Events Co.",
  description: "Operations dashboard for managing bookings, catalog, calendar, customers, and financials.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Bookings", href: "/admin/bookings", icon: Layers },
    { name: "Calendar", href: "/admin/calendar", icon: Calendar },
    { name: "Catalog (Packages/Themes)", href: "/admin/catalog", icon: Sparkles },
    { name: "Customers", href: "/admin/bookings", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-brand-warm-50 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-brand-navy-950 text-white flex-shrink-0 flex flex-col justify-between border-r border-brand-navy-800">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-brand-navy-800">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/brand/bg remove logo.png"
                alt="AR Events Co."
                width={160}
                height={48}
                className="h-10 w-auto object-contain brightness-110"
              />
            </Link>
            <div className="mt-2 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-mono text-brand-gold-400 font-semibold uppercase tracking-wider">
                Operations Center
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5 text-xs">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-brand-navy-200 hover:bg-brand-navy-900 hover:text-brand-gold-400 transition-colors font-medium"
              >
                <item.icon className="w-4 h-4 text-brand-gold-400" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* User / Logout */}
        <div className="p-4 border-t border-brand-navy-800 space-y-3">
          <div className="flex items-center space-x-3 px-3 py-2 bg-brand-navy-900/80 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-brand-gold-500 text-brand-navy-950 font-bold flex items-center justify-center text-xs">
              AR
            </div>
            <div className="text-[11px]">
              <p className="font-bold text-white leading-tight">Super Admin</p>
              <p className="text-brand-navy-400">admin@areventsco.com</p>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 text-xs text-brand-navy-400">
            <Link href="/" className="hover:text-white flex items-center space-x-1">
              <Home className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>
            <Link href="/login" className="hover:text-rose-400 flex items-center space-x-1">
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </Link>
          </div>
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
