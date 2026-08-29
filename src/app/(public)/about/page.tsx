import Link from "next/link";
import Image from "next/image";
import { Sparkles, Heart, ShieldCheck, Trophy, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Us | AR Events Co. Islamabad & Rawalpindi",
  description: "Learn about AR Events Co., Islamabad and Rawalpindi's trusted luxury event planners dedicated to creating magical celebrations.",
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16 space-y-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="badge-gold uppercase tracking-wider text-xs">Our Story & Mission</span>
        <h1 className="text-4xl sm:text-5xl font-serif text-brand-navy-950">
          About AR Events Co.
        </h1>
        <div className="gold-divider mx-auto" />
        <p className="text-brand-navy-700 max-w-2xl mx-auto text-base sm:text-lg">
          Your Celebration, Our Passion. We are dedicated to crafting bespoke milestone moments with uncompromising attention to detail and Pakistani warmth.
        </p>
      </section>

      {/* Story & Image Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl font-serif text-brand-navy-950">
              Redefining Event Planning in the Twin Cities
            </h2>
            <p className="text-sm text-brand-navy-700 leading-relaxed">
              Founded in Islamabad, AR Events Co. was established with one singular vision: to eliminate the stress of party planning and replace it with pure delight, awe-inspiring decor, and flawless execution.
            </p>
            <p className="text-sm text-brand-navy-700 leading-relaxed">
              From intimate 1st birthday milestones in home lounges to grand banquet celebrations across Islamabad Club, PC Rawalpindi, and Bahria Town, our team of passionate artisans, backdrop carpenters, balloon artists, and on-site coordinators treat every celebration as if it were our own.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-brand-warm-50 border border-brand-warm-200">
                <span className="text-2xl font-bold font-serif text-brand-gold-700">500+</span>
                <p className="text-xs text-brand-navy-700 font-medium mt-1">Events Executed</p>
              </div>
              <div className="p-4 rounded-xl bg-brand-warm-50 border border-brand-warm-200">
                <span className="text-2xl font-bold font-serif text-brand-gold-700">100%</span>
                <p className="text-xs text-brand-navy-700 font-medium mt-1">Dedicated On-Site Team</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-elevated border-2 border-brand-gold-200">
              <Image
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80"
                alt="AR Events Co. Team Event Decor"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-brand-warm-50 py-16 border-y border-brand-warm-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="badge-gold uppercase tracking-wider text-xs">Our Pillars</span>
            <h2 className="text-3xl font-serif text-brand-navy-950">Why Families Trust Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-luxury p-6 space-y-3">
              <div className="p-3 bg-brand-gold-50 text-brand-gold-600 rounded-xl w-fit">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-navy-950 font-serif">
                Uncompromising Quality
              </h3>
              <p className="text-xs text-brand-navy-700 leading-relaxed">
                We use premium-grade double-stuffed balloons, sturdy 3D wooden arches, high-lumens LED neon signs, and fresh designer florals.
              </p>
            </div>

            <div className="card-luxury p-6 space-y-3">
              <div className="p-3 bg-brand-gold-50 text-brand-gold-600 rounded-xl w-fit">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-navy-950 font-serif">
                Punctual & Reliable Setup
              </h3>
              <p className="text-xs text-brand-navy-700 leading-relaxed">
                Our crew arrives 3-4 hours prior to guests. We guarantee 100% completion before your first guest walks through the door.
              </p>
            </div>

            <div className="card-luxury p-6 space-y-3">
              <div className="p-3 bg-brand-gold-50 text-brand-gold-600 rounded-xl w-fit">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-navy-950 font-serif">
                Transparent Minor-Unit Pricing
              </h3>
              <p className="text-xs text-brand-navy-700 leading-relaxed">
                No surprises on event day. Everything is itemized, agreed upon upfront, and tracked cleanly on your client invoice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-serif text-brand-navy-950">Let&apos;s Create Something Special</h2>
          <p className="text-sm text-brand-navy-700">
            Speak with an event coordinator today or select your birthday package online.
          </p>
          <div className="pt-2">
            <Link href="/book" className="btn-gold px-8 py-3.5 text-sm inline-flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Book Your Event</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
