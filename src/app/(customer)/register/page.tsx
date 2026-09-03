"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  ArrowRight,
  Loader2,
  Calendar,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Islamabad");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify your password.");
      return;
    }

    if (!agreeTerms) {
      setError("Please accept the terms of service to create your account.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, city, address, password }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Registration failed. Please try again.");
      }

      // Registration sets ar_session cookie, redirect seamlessly to client dashboard
      router.push("/dashboard");
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
        {/* Ambient Luxury Background Image */}
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
            <div className="flex flex-col items-start space-y-0.5">
              <Image
                src="/brand/website logo no bg.png"
                alt="AR Events Co."
                width={190}
                height={60}
                className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-[9px] font-bold tracking-[0.25em] text-brand-gold-400 uppercase pl-0.5">
                Your Celebration Our Passion
              </span>
            </div>
          </Link>
        </div>

        {/* Middle Value Proposition */}
        <div className="relative z-10 my-auto py-2 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-[11px] font-semibold mb-2.5">
            <Sparkles className="w-3 h-3" />
            <span>Join Islamabad &amp; Rawalpindi Premier Event Studio</span>
          </div>

          <h2 className="text-2xl xl:text-3xl font-extrabold text-white leading-tight font-serif">
            Plan your celebration with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
              effortless luxury
            </span>
          </h2>
          <p className="text-xs text-brand-navy-200 mt-2 font-medium leading-relaxed">
            Create your account to book decorations, view instant pricing, download official
            invoices, and track setup progress.
          </p>

          {/* 3 Client Benefits */}
          <div className="space-y-2.5 mt-5">
            <div className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] backdrop-blur-md rounded-xl p-3 flex items-center gap-3 transition-all duration-300">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white">Instant Online Booking</h3>
                <p className="text-[10.5px] text-brand-navy-300">
                  Select your theme, customize packages, and reserve your date in 2 minutes.
                </p>
              </div>
            </div>

            <div className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] backdrop-blur-md rounded-xl p-3 flex items-center gap-3 transition-all duration-300">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white">Digital Invoices &amp; Payments</h3>
                <p className="text-[10.5px] text-brand-navy-300">
                  Secure advance card payments via Safepay with automatic PDF receipts.
                </p>
              </div>
            </div>

            <div className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] backdrop-blur-md rounded-xl p-3 flex items-center gap-3 transition-all duration-300">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white">Direct Lead Coordination</h3>
                <p className="text-[10.5px] text-brand-navy-300">
                  Dedicated setup manager arrives 3 hours early for a flawless event.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Badge */}
        <div className="relative z-10 bg-white/[0.05] border border-white/[0.1] backdrop-blur-xl rounded-xl p-3 shadow-2xl max-w-md flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">100% On-Time Setup Guarantee</div>
            <div className="text-[10.5px] text-brand-navy-300">
              500+ successful celebrations delivered in Islamabad &amp; Rawalpindi.
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* RIGHT PANEL: Sign Up Form Card                                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="w-full lg:w-1/2 h-screen max-h-screen overflow-y-auto flex flex-col justify-between items-center p-4 sm:p-6 lg:p-6 relative">
        {/* Top Row: Mobile Logo & Theme Indicator */}
        <div className="w-full max-w-[440px] flex items-center justify-between">
          <Link href="/" className="lg:hidden inline-block">
            <Image
              src="/brand/arevents logo.png"
              alt="AR Events Co."
              width={120}
              height={38}
              className="h-8 w-auto object-contain"
            />
          </Link>
          <div className="ml-auto flex items-center gap-1 p-0.5 bg-white border border-gray-200 rounded-full shadow-2xs">
            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-amber-500">
              <Sun className="w-3 h-3" />
            </div>
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-gray-400">
              <Moon className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Centered Luxury Sign Up Card */}
        <div className="w-full max-w-[440px] bg-white rounded-2xl p-5 sm:p-6 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.06)] border border-gray-100/80 my-auto">
          {/* Top Monogram Badge */}
          <div className="w-10 h-10 mx-auto rounded-xl bg-[#FFF8F0] border border-[#FFE8D1] flex items-center justify-center mb-2 shadow-2xs">
            <span className="font-serif font-bold text-base text-amber-700 tracking-tight">AR✦</span>
          </div>

          {/* Header Title */}
          <div className="text-center mb-3">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">Create Your Account</h1>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Join AR Events Co. to manage your bookings and events
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-3 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-medium text-center">
              {error}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="Fatima Zahra"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6342E8]/20 focus:border-[#6342E8] font-medium transition-all text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="fatima@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6342E8]/20 focus:border-[#6342E8] font-medium transition-all text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  WhatsApp / Phone *
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="0300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6342E8]/20 focus:border-[#6342E8] font-medium transition-all text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#6342E8]/20 focus:border-[#6342E8] font-medium transition-all text-gray-900"
                >
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Home / Setup Address (Optional)
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Sector F-7/2 Islamabad or Bahria Town..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6342E8]/20 focus:border-[#6342E8] font-medium transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-8 pr-8 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6342E8]/20 focus:border-[#6342E8] font-medium transition-all text-gray-900 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6342E8]/20 focus:border-[#6342E8] font-medium transition-all text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Terms of Service Checkbox */}
            <div className="pt-0.5">
              <label className="flex items-start gap-1.5 cursor-pointer select-none text-gray-600">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-3.5 h-3.5 mt-0.5 rounded border-gray-300 text-[#6342E8] focus:ring-[#6342E8]/30"
                />
                <span className="text-[10.5px] leading-tight text-gray-500">
                  I agree to AR Events Co.&apos;s{" "}
                  <Link href="/faq" className="text-[#6342E8] font-semibold hover:underline">
                    Terms
                  </Link>{" "}
                  &amp;{" "}
                  <Link href="/faq" className="text-[#6342E8] font-semibold hover:underline">
                    Booking Policies
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#6342E8] hover:bg-[#5233D4] active:scale-[0.99] text-white font-semibold text-xs shadow-md shadow-[#6342E8]/20 transition-all flex items-center justify-center gap-1.5 mt-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account &amp; Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-3 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200/80" />
            </div>
            <span className="relative bg-white px-2.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
              or sign up with
            </span>
          </div>

          {/* Social Sign Up - 2 Column Row to save height */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => alert("Social registration will connect to your Google Workspace account.")}
              className="w-full py-2 px-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px] font-semibold text-gray-700 flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => alert("Social registration will connect to your Apple ID.")}
              className="w-full py-2 px-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px] font-semibold text-gray-700 flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.85-11.97-14.43-6.2-9.67-11.07-20.91-14.61-33.72-3.54-12.8-5.31-24.63-5.31-35.48 0-14.12 3.42-25.75 10.26-34.9 6.84-9.15 15.34-13.82 25.5-14.01 4.58 0 9.8 1.25 15.66 3.75 5.86 2.5 9.74 3.81 11.64 3.93 1.52-.12 5.56-1.48 12.11-4.07s11.97-3.72 16.32-3.41c12.2.65 21.84 4.89 28.93 12.71-10.67 6.42-15.89 15.34-15.66 26.76.22 8.92 3.65 16.48 10.29 22.68 6.64 6.2 14.54 9.68 23.71 10.45-2.18 6.53-4.8 13.06-7.86 19.59zm-38.38-109.8c0-5.87 2.18-11.53 6.54-16.98 4.36-5.45 9.77-9.04 16.23-10.77.22 1.09.33 2.07.33 2.94 0 5.87-2.3 11.53-6.9 16.98-4.6 5.45-10.09 8.98-16.47 10.58-.1-.98-.27-1.9-.3-2.75z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>

          {/* Already Have Account Link */}
          <div className="text-center pt-3 mt-3 border-t border-gray-100">
            <p className="text-[11px] text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#6342E8] font-bold hover:underline transition-colors ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Trust Badge */}
        <div className="text-center text-[10.5px] text-gray-400 flex items-center justify-center gap-1 py-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secure &amp; protected. Your data is safe with us.</span>
        </div>
      </div>
    </div>
  );
}
