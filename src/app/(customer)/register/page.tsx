"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Phone, MapPin, ArrowRight, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Islamabad");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, city, address, password }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Registration failed");
      }

      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
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
          Create Client Account
        </h1>
        <p className="text-xs text-brand-navy-600">
          Track birthday bookings, invoices, and event updates in Islamabad & Rawalpindi
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="card-luxury p-8 space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-brand-navy-900 mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-brand-navy-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Fatima Zahra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-brand-warm-300 focus:ring-2 focus:ring-brand-gold-400 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy-900 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-navy-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="fatima@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-brand-warm-300 focus:ring-2 focus:ring-brand-gold-400 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-brand-navy-900 mb-1">WhatsApp / Phone *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-brand-navy-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="0316 0513841"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-brand-warm-300 focus:ring-2 focus:ring-brand-gold-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy-900 mb-1">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-brand-warm-300 bg-white focus:ring-2 focus:ring-brand-gold-400 font-medium"
                >
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy-900 mb-1">Home / Setup Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-brand-navy-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Sector F-8/2 Islamabad or Bahria Town Rawalpindi..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-brand-warm-300 focus:ring-2 focus:ring-brand-gold-400 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy-900 mb-1">Create Password *</label>
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
              className="btn-gold w-full py-3 text-xs font-semibold flex items-center justify-center space-x-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-brand-navy-600">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-gold-700 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
