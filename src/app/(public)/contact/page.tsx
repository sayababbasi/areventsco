import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";

export const metadata = {
  title: "Contact AR Events Co. | Islamabad & Rawalpindi Event Planners",
  description: "Get in touch with AR Events Co. for birthday planning consultations, custom decor quotes, and date reservations across Islamabad & Rawalpindi.",
};

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-16 space-y-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="badge-gold uppercase tracking-wider text-xs">Get in Touch</span>
        <h1 className="text-4xl sm:text-5xl font-serif text-brand-navy-950">
          Contact AR Events Co.
        </h1>
        <div className="gold-divider mx-auto" />
        <p className="text-brand-navy-700 max-w-2xl mx-auto text-base sm:text-lg">
          We are ready to bring your dream celebration to life. Reach out via phone, WhatsApp, or submit an inquiry below.
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
                    <span>Sector F-7 / Blue Area, Islamabad & Bahria Town, Rawalpindi</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-brand-gold-600 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="block text-brand-navy-900">Direct Phone Line</strong>
                    <a href="tel:+923008555123" className="hover:text-brand-gold-600 text-base font-semibold">
                      +92 300 8555123
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MessageCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="block text-brand-navy-900">Instant WhatsApp Support</strong>
                    <a
                      href="https://wa.me/923008555123"
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 font-semibold hover:underline"
                    >
                      +92 300 8555123 (Click to Chat)
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
                  Fill out the form below and our lead coordinator will respond within 2 hours.
                </p>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-navy-900 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sara Ahmed"
                      className="w-full px-4 py-2.5 text-xs rounded-lg border border-brand-warm-300 focus:outline-none focus:ring-2 focus:ring-brand-gold-400"
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
                      className="w-full px-4 py-2.5 text-xs rounded-lg border border-brand-warm-300 focus:outline-none focus:ring-2 focus:ring-brand-gold-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-navy-900 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sara@example.com"
                      className="w-full px-4 py-2.5 text-xs rounded-lg border border-brand-warm-300 focus:outline-none focus:ring-2 focus:ring-brand-gold-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-navy-900 mb-1">
                      City / Location *
                    </label>
                    <select className="w-full px-4 py-2.5 text-xs rounded-lg border border-brand-warm-300 focus:outline-none focus:ring-2 focus:ring-brand-gold-400 bg-white">
                      <option>Islamabad (All Sectors & Suburbs)</option>
                      <option>Rawalpindi (Bahria, DHA, Cantt)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-navy-900 mb-1">
                    Event Type & Estimated Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1st Birthday Celebration, Oct 15"
                    className="w-full px-4 py-2.5 text-xs rounded-lg border border-brand-warm-300 focus:outline-none focus:ring-2 focus:ring-brand-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-navy-900 mb-1">
                    Tell Us About Your Vision & Special Requests
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Theme preferences, balloon colors, cake requirements, or venue details..."
                    className="w-full px-4 py-2.5 text-xs rounded-lg border border-brand-warm-300 focus:outline-none focus:ring-2 focus:ring-brand-gold-400"
                  ></textarea>
                </div>

                <button
                  type="button"
                  className="btn-gold w-full py-3.5 text-sm flex items-center justify-center space-x-2 font-semibold"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
