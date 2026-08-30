import Link from "next/link";
import { Sparkles, Home, ArrowLeft, Search, Calendar } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-navy-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-gold-500/10 via-transparent to-transparent" />

      <div className="relative max-w-md w-full text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-brand-gold-500/20 text-brand-gold-400 flex items-center justify-center mx-auto border border-brand-gold-500/30">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono text-brand-gold-400 uppercase tracking-widest">
            Error 404 • Page Not Found
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Celebration Out of View
          </h1>
          <p className="text-xs sm:text-sm text-brand-warm-300 leading-relaxed">
            The page you are looking for might have been moved, renamed, or is temporarily unavailable. Explore our luxury birthday catalog below.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="btn-gold w-full sm:w-auto text-xs px-5 py-2.5 flex items-center justify-center space-x-2 font-bold shadow-lg"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/packages"
            className="btn-outline-gold w-full sm:w-auto text-xs px-5 py-2.5 flex items-center justify-center space-x-2 bg-brand-navy-900/60"
          >
            <Calendar className="w-4 h-4" />
            <span>Browse Packages</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-brand-navy-800 text-[11px] text-brand-navy-400">
          AR Events Co. • Luxury Birthday Planning in Islamabad & Rawalpindi
        </div>
      </div>
    </div>
  );
}
