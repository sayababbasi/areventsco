import { Star, ShieldCheck, MessageSquareQuote } from "lucide-react";
import Link from "next/link";
import { getSafeReviews } from "@/lib/data-fallback";

export const revalidate = 60; // 60s ISR Cache

export const metadata = {
  title: "Client Reviews & Testimonials | AR Events Co. Islamabad & Rawalpindi",
  description: "Read verified feedback from Islamabad and Rawalpindi parents and hosts who trusted AR Events Co. for their birthday and milestone celebrations.",
};

export default async function ReviewsPage() {
  const reviews = await getSafeReviews();

  return (
    <div className="py-12 sm:py-16 space-y-16 bg-brand-warm-50/40 min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="badge-gold uppercase tracking-wider text-xs">Client Feedback</span>
        <h1 className="text-4xl sm:text-5xl font-serif text-brand-navy-950 font-bold">
          Client Reviews & Stories
        </h1>
        <div className="gold-divider mx-auto" />
        <p className="text-brand-navy-700 max-w-2xl mx-auto text-base sm:text-lg">
          We take immense pride in making celebrations across Islamabad and Rawalpindi stress-free, luxurious, and memorable.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {reviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-brand-warm-200 p-8 space-y-3">
            <MessageSquareQuote className="w-10 h-10 text-brand-warm-400 mx-auto" />
            <p className="text-sm font-semibold text-brand-navy-950">No reviews published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((r) => (
              <div key={r.id} className="card-luxury p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-400" />
                      ))}
                    </div>
                    {r.isVerified && (
                      <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified Client</span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-brand-navy-950 text-base">
                    {r.eventTitle}
                  </h3>
                  <p className="text-brand-navy-700 text-xs sm:text-sm leading-relaxed italic">
                    &ldquo;{r.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-warm-200">
                  <strong className="block text-brand-navy-950 text-sm font-semibold">{r.authorName}</strong>
                  <span className="text-xs text-brand-navy-500">{r.authorLocation}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
