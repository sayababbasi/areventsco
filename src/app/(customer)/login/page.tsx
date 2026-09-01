"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Invalid credentials");
      }

      // Check role and route accordingly
      if (["SUPER_ADMIN", "ADMIN", "EVENT_MANAGER", "STAFF"].includes(json.data.user.role)) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoFill = (roleEmail: string) => {
    setEmail(roleEmail);
    if (roleEmail === "sayababbasi806@gmail.com" || roleEmail === "admin@areventsco.com") {
      setPassword("@dmin@SAYAB123");
    } else {
      setPassword("Password123!");
    }
  };

  return (
    <div className="min-h-screen bg-brand-warm-50/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center justify-center">
          <Image
            src="/brand/website logo no bg.png"
            alt="AR Events Co."
            width={200}
            height={60}
            className="h-14 w-auto object-contain"
          />
        </Link>
        <h1 className="text-2xl font-bold font-serif text-brand-navy-950">
          Client & Team Portal Login
        </h1>
        <p className="text-xs text-brand-navy-600">
          Manage bookings, invoices, dates, and event operations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="card-luxury p-8 space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy-900 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-navy-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="admin@areventsco.com or customer email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-brand-warm-300 focus:ring-2 focus:ring-brand-gold-400 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-brand-navy-900">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-navy-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-brand-warm-300 focus:ring-2 focus:ring-brand-gold-400 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-gold w-full py-3 text-xs font-semibold flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Shortcut Box */}
          <div className="pt-4 border-t border-brand-warm-200 space-y-2">
            <p className="text-[11px] font-semibold text-brand-navy-600 flex items-center">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold-600 mr-1" />
              Quick Demo Fill Credentials:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickDemoFill("admin@areventsco.com")}
                className="p-1.5 rounded bg-brand-warm-100 text-brand-navy-900 font-medium hover:bg-brand-gold-100 text-left truncate"
              >
                👑 Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill("fatima.z@gmail.com")}
                className="p-1.5 rounded bg-brand-warm-100 text-brand-navy-900 font-medium hover:bg-brand-gold-100 text-left truncate"
              >
                👤 Customer (Fatima)
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-brand-navy-600">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-brand-gold-700 font-semibold hover:underline">
                Create Customer Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
