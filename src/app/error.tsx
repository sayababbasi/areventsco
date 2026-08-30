"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-brand-navy-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="relative max-w-md w-full text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono text-rose-400 uppercase tracking-widest">
            Application Exception
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Something went wrong
          </h1>
          <p className="text-xs text-brand-warm-300 leading-relaxed">
            An unexpected error occurred while loading this page. Our technical team has been notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="btn-gold w-full sm:w-auto text-xs px-5 py-2.5 flex items-center justify-center space-x-2 font-bold shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="btn-outline-gold w-full sm:w-auto text-xs px-5 py-2.5 flex items-center justify-center space-x-2 bg-brand-navy-900/60"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
