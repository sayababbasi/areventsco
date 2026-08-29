"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Islamabad");
  const [eventType, setEventType] = useState("Birthday Party");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          city,
          eventType,
          message,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        setErrorMessage(json.error || "Failed to submit inquiry.");
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 space-y-16 bg-brand-warm-50/40 min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="badge-gold uppercase tracking-wider text-xs">Get in Touch</span>
        <h1 className="text-4xl sm:text-5xl font-serif text-brand-navy-950 font-bold">
          Contact AR Events Co.
        </h1>
        <div className="gold-divider mx-auto" />
        <p className="text-brand-navy-700 max-w-2xl mx-auto text-base sm:text-lg">
          We are ready to bring your dream celebration to life. Reach out via phone, WhatsApp, or submit an inquiry below for immediate consultation.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Info & Hours */}
          <div className="lg:col-span-5 space-y-8">
            <div className="card-luxury p-8 space-y-6">
              <h2 className="text-2xl font-serif font-bold text-brand-navy-950">
                Office & Studio
              </h2>

              <div className="space-y-4 text-sm text-brand-navy-700">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-brand-gold-600 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="block text-brand-navy-900">Islamabad & Rawalpindi Operations</strong>
                    <span>Sector F-7 / Blue Area, Islamabad & Bahria Town Phase 7, Rawalpindi</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-brand-gold-600 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="block text-brand-navy-900">Direct Phone Line</strong>
                    <a href="tel:+923001234567" className="hover:text-brand-gold-600 text-base font-semibold">
                      +92 300 1234567
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MessageCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="block text-brand-navy-900">Instant WhatsApp Support</strong>
                    <a
                      href="https://wa.me/923001234567"
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 font-semibold hover:underline"
                    >
                      +92 300 1234567 (Click to Chat)
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-brand-gold-600 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="block text-brand-navy-900">General & Booking Inquiries</strong>
                    <a href="mailto:info@areventsco.com" className="hover:text-brand-gold-600">
                      info@areventsco.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pt-2 border-t border-brand-warm-200">
                  <Clock className="w-5 h-5 text-brand-gold-600 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="block text-brand-navy-900">Operating Hours</strong>
                    <span>Mon - Sun: 10:00 AM – 10:00 PM (Online booking available 24/7)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7">
            <div className="card-luxury p-8 sm:p-10 space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-brand-navy-950">
                  Send an Inquiry
                </h2>
                <p className="text-xs text-brand-navy-600 mt-1">
                  Fill out the form below and our lead event coordinator will contact you directly.
                </p>
              </div>

              {isSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    <h3 className="font-serif font-bold text-base">Inquiry Submitted Successfully!</h3>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Thank you! Your event details have been recorded in our operations pipeline. An AR Events Co. coordinator will reach out to you via WhatsApp or phone shortly.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="btn-gold text-xs px-4 py-2 mt-2 font-semibold"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-brand-navy-900 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sara Ahmed"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs rounded-xl border border-brand-warm-300 focus:outline-none focus:ring-2 focus:ring-brand-gold-400 bg-brand-warm-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-navy-900 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0300 1234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs rounded-xl border border-brand-warm-300 focus:outline-none focus:ring-2 focus:ring-brand-gold-400 bg-brand-warm-50/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-brand-navy-900 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="sara@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs rounded-xl border border-brand-warm-300 focus:outline-none focus:ring-2 focus:ring-brand-gold-400 bg-brand-warm-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-navy-900 mb-1">
                        City / Location *
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs rounded-xl border border-brand-warm-300 focus:outline-none focus:ring-2 focus:ring-brand-gold-400 bg-brand-warm-50/50"
                      >
                        <option value="Islamabad">Islamabad (All Sectors)</option>
                        <option value="Rawalpindi">Rawalpindi (Bahria, DHA, Cantt)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-navy-900 mb-1">
                      Event Type
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-brand-warm-300 focus:outline-none focus:ring-2 focus:ring-brand-gold-400 bg-brand-warm-50/50"
                    >
                      <option value="1st Birthday Party">1st Birthday Party</option>
                      <option value="Kids Birthday Party">Kids Birthday Party</option>
                      <option value="Milestone / Adult Birthday">Milestone / Adult Birthday</option>
                      <option value="Custom Decoration">Custom Decoration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-navy-900 mb-1">
                      Event Details & Custom Requests *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us your desired birthday theme, approximate date, venue location, guest count, and any custom requirements..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-brand-warm-300 focus:outline-none focus:ring-2 focus:ring-brand-gold-400 bg-brand-warm-50/50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-gold w-full py-3 text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Submit Celebration Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
