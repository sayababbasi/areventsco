import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Frequently Asked Questions | AR Events Co. Islamabad & Rawalpindi",
  description: "Get answers about birthday planning, booking procedures, setup times, customization, and payment terms in Islamabad & Rawalpindi.",
};

const faqs = [
  {
    category: "Coverage & Locations",
    items: [
      {
        q: "Which areas in Islamabad and Rawalpindi do you serve?",
        a: "We serve all sectors of Islamabad (F-6, F-7, F-8, F-10, F-11, E-7, E-11, G sectors, I sectors, Bani Gala, Chak Shahzad, Park View City, Bahria Enclave) and all zones of Rawalpindi including Bahria Town (Phases 1-8), DHA (Phases 1-5), Cantt, Satellite Town, and Westridge.",
      },
      {
        q: "Can you set up in our private home, lawn, or lounge?",
        a: "Yes! Over 60% of our events are set up directly inside private drawing rooms, lounges, backyards, or terrace gardens. We bring all necessary freestanding rigging, frames, and drop cloths so your walls and floors remain completely protected.",
      },
    ],
  },
  {
    category: "Booking & Availability",
    items: [
      {
        q: "How far in advance should I book my event?",
        a: "We recommend booking 1 to 2 weeks in advance to secure your preferred time slot. For bespoke 3D themes, custom woodwork backdrops, or weekend dates, 3 weeks notice allows ample design and production time.",
      },
      {
        q: "How long before the party starts does your decor crew arrive?",
        a: "Our professional setup crew arrives 3 to 4 hours prior to your guest arrival time. We guarantee 100% completion at least 30 minutes before your first guest walks in.",
      },
    ],
  },
  {
    category: "Pricing & Payments",
    items: [
      {
        q: "Are there any hidden travel or cleanup charges?",
        a: "No. All prices listed on our platform are transparent and all-inclusive of delivery, on-site installation, and post-event teardown within Islamabad and Rawalpindi municipal limits.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept online bank transfers (Meezan Bank, HBL, Bank Alfalah), Raast instant payments, and cash on setup day. An advance deposit confirms your booking date.",
      },
    ],
  },
  {
    category: "Customization & Theme Design",
    items: [
      {
        q: "Can I bring my own Pinterest ideas or custom color scheme?",
        a: "Absolutely! Our creative design team specializes in translating your vision and reference images into real 3D backdrop installations, personalized name signage, and custom balloon architecture.",
      },
      {
        q: "Do you supply the birthday cake as well?",
        a: "Yes, we partner with premier artisanal bakeries in Islamabad to provide customized 2-tier and 3-tier fondant or buttercream cakes that match your exact theme palette.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="py-12 sm:py-16 space-y-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="badge-gold uppercase tracking-wider text-xs">Help & Guidance</span>
        <h1 className="text-4xl sm:text-5xl font-serif text-brand-navy-950">
          Frequently Asked Questions
        </h1>
        <div className="gold-divider mx-auto" />
        <p className="text-brand-navy-700 max-w-2xl mx-auto text-base sm:text-lg">
          Everything you need to know about our birthday planning, setup logistics, and booking policies across Islamabad and Rawalpindi.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {faqs.map((group, gIdx) => (
          <div key={gIdx} className="space-y-4">
            <h2 className="text-xl font-bold font-serif text-brand-navy-950 border-b border-brand-warm-300 pb-2">
              {group.category}
            </h2>
            <div className="space-y-4 pt-2">
              {group.items.map((item, idx) => (
                <div key={idx} className="card-luxury p-6 space-y-2">
                  <h3 className="text-base font-bold text-brand-navy-950 flex items-start">
                    <span className="text-brand-gold-600 mr-2 font-serif">Q.</span>
                    <span>{item.q}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-navy-700 pl-6 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Still Have Questions Box */}
        <div className="p-8 rounded-2xl bg-brand-warm-50 border border-brand-gold-200 text-center space-y-4">
          <h3 className="text-xl font-serif text-brand-navy-950">Still Have a Specific Question?</h3>
          <p className="text-xs sm:text-sm text-brand-navy-700 max-w-md mx-auto">
            Our event specialists are available 7 days a week to guide you through ideas and custom packages.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a href="tel:+923008555123" className="btn-navy px-6 py-2.5 text-xs flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5" />
              <span>Call +92 300 8555123</span>
            </a>
            <a
              href="https://wa.me/923008555123"
              target="_blank"
              rel="noreferrer"
              className="btn-gold px-6 py-2.5 text-xs flex items-center space-x-2"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
