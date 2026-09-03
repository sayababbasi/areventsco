"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  Loader2,
  Calendar,
  Users,
  TrendingUp,
  ShieldCheck,
  Eye,
  EyeOff,
  Sun,
  Moon,
  LogIn,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col lg:flex-row bg-[#F8F9FD] text-brand-navy-950 font-sans selection:bg-brand-gold-500 selection:text-white">
      {/* ------------------------------------------------------------------ */}
      {/* LEFT PANEL: Visual Showcase & Brand Story                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="hidden lg:flex lg:w-1/2 h-screen max-h-screen relative overflow-hidden bg-brand-navy-950 p-8 xl:p-12 flex-col justify-between select-none">
        {/* Ambient Luxury Background Image with Soft Glow Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/hero_birthday_lawn.jpg"
            alt="AR Events Co. Luxury Setup"
            fill
            priority
            className="object-cover object-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-brand-navy-950/90 to-black/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,175,55,0.2),transparent_60%)]" />
        </div>

        {/* Top Brand Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-block group">
            <div className="flex flex-col items-start space-y-1">
              <Image
                src="/brand/website logo no bg.png"
                alt="AR Events Co."
                width={210}
                height={70}
                className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-[10px] font-bold tracking-[0.25em] text-brand-gold-400 uppercase pl-1">
                Your Celebration Our Passion
              </span>
            </div>
          </Link>
        </div>

        {/* Middle Value Proposition & Features */}
        <div className="relative z-10 my-auto py-6 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Islamabad &amp; Rawalpindi Premier Events</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight font-serif">
            Let&apos;s create{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
              unforgettable moments
            </span>
          </h2>
          <p className="text-sm text-brand-navy-200 mt-3 font-medium leading-relaxed">
            Manage your events, bookings, and clients all in one beautiful dashboard.
          </p>

          {/* 3 Feature Cards */}
          <div className="space-y-3 mt-6">
            <div className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] backdrop-blur-md rounded-2xl p-3.5 flex items-center gap-3.5 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white">Smart Event Management</h3>
                <p className="text-[11px] text-brand-navy-300">
                  Organize, plan and manage events seamlessly.
                </p>
              </div>
            </div>

            <div className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] backdrop-blur-md rounded-2xl p-3.5 flex items-center gap-3.5 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white">Client &amp; Booking Overview</h3>
                <p className="text-[11px] text-brand-navy-300">
                  Keep track of clients, bookings and payments.
                </p>
              </div>
            </div>

            <div className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] backdrop-blur-md rounded-2xl p-3.5 flex items-center gap-3.5 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white">Insights &amp; Reports</h3>
                <p className="text-[11px] text-brand-navy-300">
                  Get real-time insights and grow your business.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Testimonial Card */}
        <div className="relative z-10 bg-white/[0.05] border border-white/[0.1] backdrop-blur-xl rounded-2xl p-4 shadow-2xl max-w-md">
          <div className="text-amber-400 text-2xl font-serif leading-none mb-1">“</div>
          <p className="text-xs text-white/90 font-medium leading-relaxed">
            AR Events Co. made our dream event a perfect reality. Exceptional planning and flawless
            execution!
          </p>
          <div className="flex items-center gap-2.5 mt-3 pt-2.5 border-t border-white/[0.08]">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-brand-navy-950 font-bold text-xs flex items-center justify-center shadow-xs">
              AR
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Ahmed Raza</div>
              <div className="text-[10px] text-brand-gold-300">Happy Client</div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* RIGHT PANEL: Login Form Card                                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-between items-center p-6 sm:p-10 relative">
        {/* Top Row: Mobile Logo & Theme Indicator */}
        <div className="w-full max-w-[440px] flex items-center justify-between pt-2">
          <Link href="/" className="lg:hidden inline-block">
            <Image
              src="/brand/arevents logo.png"
              alt="AR Events Co."
              width={140}
              height={45}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <div className="ml-auto flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded-full shadow-2xs">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-amber-500">
              <Sun className="w-3.5 h-3.5" />
            </div>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400">
              <Moon className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Centered Luxury Login Card */}
        <div className="w-full max-w-[440px] bg-white rounded-3xl p-8 sm:p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.06)] border border-gray-100/80 my-auto">
          {/* Top Monogram Badge */}
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFF8F0] border border-[#FFE8D1] flex items-center justify-center mb-4 shadow-2xs">
            <span className="font-serif font-bold text-xl text-amber-700 tracking-tight">AR✦</span>
          </div>

          {/* Header Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome Back!</h1>
            <p className="text-xs text-gray-500 mt-1">Login to your AR Events Co. account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6342E8]/20 focus:border-[#6342E8] font-medium transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6342E8]/20 focus:border-[#6342E8] font-medium transition-all text-gray-900 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-[#6342E8] focus:ring-[#6342E8]/30"
                />
                <span className="text-[11px] font-medium">Remember me</span>
              </label>
              <a
                href="mailto:info@areventsco.com?subject=Password%20Reset%20Request"
                className="text-[11px] font-medium text-[#6342E8] hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#6342E8] hover:bg-[#5233D4] active:scale-[0.99] text-white font-semibold text-xs shadow-md shadow-[#6342E8]/20 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login to Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200/80" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-medium text-gray-400">
              or continue with
            </span>
          </div>

          {/* Social Sign In Buttons */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => alert("Social login will connect to your Google Workspace account.")}
              className="w-full py-2.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center justify-center gap-2.5 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => alert("Social login will connect to your Apple ID.")}
              className="w-full py-2.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center justify-center gap-2.5 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.85-11.97-14.43-6.2-9.67-11.07-20.91-14.61-33.72-3.54-12.8-5.31-24.63-5.31-35.48 0-14.12 3.42-25.75 10.26-34.9 6.84-9.15 15.34-13.82 25.5-14.01 4.58 0 9.8 1.25 15.66 3.75 5.86 2.5 9.74 3.81 11.64 3.93 1.52-.12 5.56-1.48 12.11-4.07s11.97-3.72 16.32-3.41c12.2.65 21.84 4.89 28.93 12.71-10.67 6.42-15.89 15.34-15.66 26.76.22 8.92 3.65 16.48 10.29 22.68 6.64 6.2 14.54 9.68 23.71 10.45-2.18 6.53-4.8 13.06-7.86 19.59zm-38.38-109.8c0-5.87 2.18-11.53 6.54-16.98 4.36-5.45 9.77-9.04 16.23-10.77.22 1.09.33 2.07.33 2.94 0 5.87-2.3 11.53-6.9 16.98-4.6 5.45-10.09 8.98-16.47 10.58-.1-.98-.27-1.9-.3-2.75z" />
              </svg>
              <span>Continue with Apple</span>
            </button>
          </div>

          {/* Direct Sign Up Link */}
          <div className="text-center pt-5 mt-5 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-[#6342E8] font-bold hover:underline transition-colors ml-1"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Trust Badge */}
        <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5 pt-4 pb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secure &amp; protected. Your data is safe with us.</span>
        </div>
      </div>
    </div>
  );
}
