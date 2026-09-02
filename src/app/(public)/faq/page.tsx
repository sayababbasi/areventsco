import Link from "next/link";
import { Phone, MessageCircle, HelpCircle } from "lucide-react";
import { getSafeFaqs } from "@/lib/data-fallback";

export const revalidate = 60; // 60s ISR Cache

export const metadata = {
  title: "Frequently Asked Questions | AR Events Co. Islamabad & Rawalpindi",
  description: "Get answers about birthday planning, booking procedures, setup times, customization, and payment terms in Islamabad & Rawalpindi.",
};

export default async function FaqPage() {
  const dbFaqs = await getSafeFaqs();

  // Group by category
  const categoriesMap: Record<string, { q: string; a: string }[]> = {};
  for (const faq of dbFaqs) {
    const cat = faq.category || "General";
    if (!categoriesMap[cat]) categoriesMap[cat] = [];
    categoriesMap[cat].push({ q: faq.question, a: faq.answer });
  }

  const categoryEntries = Object.entries(categoriesMap);

  return (
    <div className="py-12 sm:py-16 space-y-16 bg-brand-warm-50/40 min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="badge-gold uppercase tracking-wider text-xs">Help & Guidance</span>
        <h1 className="text-4xl sm:text-5xl font-serif text-brand-navy-950 font-bold">
          Frequently Asked Questions
        </h1>
        <div className="gold-divider mx-auto" />
        <p className="text-brand-navy-700 max-w-2xl mx-auto text-base sm:text-lg">
          Everything you need to know about booking, theme customization, on-site setup times, and payment terms in Islamabad & Rawalpindi.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {categoryEntries.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-brand-warm-200 p-8 space-y-3">
            <HelpCircle className="w-10 h-10 text-brand-warm-400 mx-auto" />
            <p className="text-sm font-semibold text-brand-navy-950">No FAQs published yet.</p>
          </div>
        ) : (
          categoryEntries.map(([category, items], idx) => (
            <div key={idx} className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-navy-950 border-b border-brand-warm-200 pb-2">
                {category}
              </h2>

              <div className="space-y-4">
                {items.map((item, itemIdx) => (
                  <div key={itemIdx} className="card-luxury p-6 space-y-2">
                    <h3 className="text-base font-serif font-bold text-brand-navy-950">
                      {item.q}
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-navy-700 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      {/* Still Have Questions CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-navy-950 text-white rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-xl border border-brand-navy-800">
          <h2 className="text-2xl sm:text-3xl font-serif text-white font-bold">
            Still Have Questions?
          </h2>
          <p className="text-brand-navy-200 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Our event coordinators in Islamabad & Rawalpindi are available 7 days a week to assist with custom themes, venue walk-throughs, and instant date confirmations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="tel:+923160513841"
              className="btn-gold px-6 py-3 text-xs font-bold flex items-center space-x-2 w-full sm:w-auto justify-center"
            >
              <Phone className="w-4 h-4" />
              <span>Call +92 316 0513841</span>
            </a>
            <a
              href="https://wa.me/923160513841"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-2 transition-colors w-full sm:w-auto justify-center shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
