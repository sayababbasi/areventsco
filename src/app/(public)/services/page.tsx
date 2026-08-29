import Link from "next/link";
import Image from "next/image";
import { Camera, Sparkles, Utensils, Music, Cake, Smile, ArrowRight } from "lucide-react";
import { formatPKR } from "@/lib/utils";

export const metadata = {
  title: "Birthday & Event Services in Islamabad & Rawalpindi | AR Events Co.",
  description: "Explore bespoke event services: Photography, 4K Videography, Themed Cakes, Balloon Architecture, Marquee Numbers, and Magic Shows in Islamabad & Rawalpindi.",
};

const services = [
  {
    icon: Sparkles,
    title: "Bespoke Balloon Styling & Backdrops",
    desc: "Organic balloon arches, chrome metallic finishes, custom 3D acrylic name cutouts, and themed photo-ready backdrops.",
    price: "From PKR 25,000",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: Camera,
    title: "Event Photography & 4K Video",
    desc: "Professional DSLR photography, family portraits, candid moments, and 4K cinematic reels with licensed music.",
    price: "From PKR 15,000",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: Cake,
    title: "Custom Themed Fondant Cakes",
    desc: "Artisanal multi-tier birthday cakes designed to match your exact theme palette. Flavors: Belgian Fudge, Red Velvet & Salted Caramel.",
    price: "From PKR 14,000",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: Smile,
    title: "Kids Magic & Puppet Shows",
    desc: "Interactive comedy magic shows, balloon twisting artists, and face painting that keep children captivated.",
    price: "From PKR 12,000",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: Utensils,
    title: "Live Carnival Food Counters",
    desc: "Fresh live popcorn carts, colorful cotton candy machines, mini sliders, and waffle stations on-site.",
    price: "From PKR 10,000",
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: Music,
    title: "Sound, Stage Lighting & Cold Sparks",
    desc: "Professional PA sound systems with wireless mics, ambient room uplighting, and indoor-safe cold spark fountain machines.",
    price: "From PKR 8,000",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
  },
];

export default function ServicesPage() {
  return (
    <div className="py-12 sm:py-16 space-y-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="badge-gold uppercase tracking-wider text-xs">A La Carte & Add-Ons</span>
        <h1 className="text-4xl sm:text-5xl font-serif text-brand-navy-950">
          Event Planning & Decor Services
        </h1>
        <div className="gold-divider mx-auto" />
        <p className="text-brand-navy-700 max-w-2xl mx-auto text-base sm:text-lg">
          Add specialized entertainment, high-end photography, custom bakery creations, and special effects to any celebration.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc, idx) => (
            <div key={idx} className="card-luxury overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={svc.image}
                    alt={svc.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white">
                    <span className="badge-gold bg-brand-gold-500 text-white border-none text-xs">
                      {svc.price}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center space-x-2.5 text-brand-gold-600">
                    <svc.icon className="w-5 h-5" />
                    <h3 className="text-lg font-bold text-brand-navy-950 font-serif">
                      {svc.title}
                    </h3>
                  </div>
                  <p className="text-xs text-brand-navy-700 leading-relaxed">
                    {svc.desc}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-brand-warm-100">
                <Link
                  href="/book"
                  className="btn-outline-navy w-full py-2.5 text-xs flex items-center justify-center space-x-1.5"
                >
                  <span>Include in Booking</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
