import { Star, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Client Reviews & Testimonials | AR Events Co. Islamabad & Rawalpindi",
  description: "Read verified feedback from Islamabad and Rawalpindi parents and hosts who trusted AR Events Co. for their birthday and milestone celebrations.",
};

const allReviews = [
  {
    name: "Ayesha Malik",
    location: "Sector F-7/2, Islamabad",
    event: "Zayd's 1st Birthday (Safari Theme)",
    quote: "AR Events Co. delivered beyond our wildest expectations! The balloon garland and life-sized safari cutouts looked like they came straight out of a luxury magazine. The entire setup in our Islamabad residence was completed 3 hours before guests arrived. Highly recommended!",
    date: "August 2026",
    rating: 5,
  },
  {
    name: "Brig. (R) Tariq Mahmood",
    location: "DHA Phase 2, Islamabad",
    event: "Grand 50th Milestone Birthday",
    quote: "Superb execution, polite staff, and impeccable attention to detail. The midnight navy and gold theme with marquee numbers added such a refined elegance to the evening. Abdul Rehman and his team are true professionals in the twin cities.",
    date: "July 2026",
    rating: 5,
  },
  {
    name: "Mahnoor & Bilal",
    location: "Bahria Town Phase 4, Rawalpindi",
    event: "Princess Castle 5th Birthday",
    quote: "Our daughter was mesmerized by the castle backdrop and balloon clouds. Dealing with AR Events Co. was effortless—from online booking to the final clean-up. Best birthday event planners in Rawalpindi!",
    date: "July 2026",
    rating: 5,
  },
  {
    name: "Dr. Danial Hashmi",
    location: "Sector E-7, Islamabad",
    event: "Astronaut Space 6th Birthday",
    quote: "From the LED star effects to the custom astronaut cutout photo booth, everything was pristine. The kids were engaged the whole time with the magic show. Outstanding service!",
    date: "June 2026",
    rating: 5,
  },
  {
    name: "Zainab Chaudhry",
    location: "Chak Shahzad, Islamabad",
    event: "Sweet 16 Rose Gold & Floral Party",
    quote: "The shimmer wall and 4ft marquee numbers were stunning in all our photos. The coordination team was so respectful and punctual. 10/10 experience.",
    date: "June 2026",
    rating: 5,
  },
  {
    name: "Hamid Raza",
    location: "Cantt, Rawalpindi",
    event: "30th Birthday Dinner & Decor",
    quote: "Clean, elegant, and sophisticated. No cheap plastic look—only high-grade metallic balloons, beautiful florals, and crisp lighting. Will book again!",
    date: "May 2026",
    rating: 5,
  },
];

export default function ReviewsPage() {
  return (
    <div className="py-12 sm:py-16 space-y-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="badge-gold uppercase tracking-wider text-xs">Client Feedback</span>
        <h1 className="text-4xl sm:text-5xl font-serif text-brand-navy-950">
          Client Reviews & Stories
        </h1>
        <div className="gold-divider mx-auto" />
        <p className="text-brand-navy-700 max-w-2xl mx-auto text-base sm:text-lg">
          We take immense pride in making celebrations across Islamabad and Rawalpindi stress-free, luxurious, and memorable.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allReviews.map((r, idx) => (
            <div key={idx} className="card-luxury p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-brand-gold-500 fill-brand-gold-500" />
                    ))}
                  </div>
                  <span className="flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Verified Event
                  </span>
                </div>

                <p className="text-xs font-bold text-brand-gold-700">{r.event}</p>
                <p className="text-xs text-brand-navy-700 leading-relaxed italic">
                  &ldquo;{r.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-brand-warm-200 flex items-center justify-between text-xs text-brand-navy-500">
                <div>
                  <p className="font-bold text-brand-navy-900">{r.name}</p>
                  <p>{r.location}</p>
                </div>
                <span>{r.date}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/book" className="btn-gold px-8 py-3.5 text-sm">
            Book Your Event With Us
          </Link>
        </div>
      </section>
    </div>
  );
}
