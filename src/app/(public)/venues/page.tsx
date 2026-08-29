import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, Building, ArrowRight } from "lucide-react";
import { formatPKR } from "@/lib/utils";

export const metadata = {
  title: "Partner Birthday Venues Islamabad & Rawalpindi | AR Events Co.",
  description: "Discover top event venues in Islamabad and Rawalpindi: Banquet halls, terrace lawns, private farmhouses, or at-home setups.",
};

const venues = [
  {
    slug: "islamabad-club-banquets",
    name: "Islamabad Club & Marquee Suites",
    city: "Islamabad",
    address: "Main Murree Road, Near Club Road, Islamabad",
    capacity: 120,
    type: "Indoor Luxury Banquet",
    feeMinor: 5000000,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    desc: "Prestigious indoor banquet suite with crystal chandeliers, high ceilings, full air conditioning, and dedicated valet parking.",
  },
  {
    slug: "monal-margalla-lawn",
    name: "Margalla Terraced Event Lawn",
    city: "Islamabad",
    address: "Daman-e-Koh / Margalla Hills Road, Islamabad",
    capacity: 150,
    type: "Outdoor Scenic Terrace",
    feeMinor: 6500000,
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
    desc: "Panoramic views of Islamabad and cool mountain breeze ideal for scenic afternoon, sunset, and night birthday setups.",
  },
  {
    slug: "bahria-grand-lawn-rawalpindi",
    name: "Bahria Grand Garden Terrace",
    city: "Rawalpindi",
    address: "Civic Center, Bahria Town Phase 7, Rawalpindi",
    capacity: 100,
    type: "Garden & Gazebo Hall",
    feeMinor: 4000000,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    desc: "Lush private garden with paved gazebo area perfect for outdoor kids parties and family milestone celebrations in Rawalpindi.",
  },
  {
    slug: "private-residence-venue",
    name: "Customer's Private Residence / Farmhouse",
    city: "Islamabad / Rawalpindi",
    address: "Your home, terrace, backyard or farmhouse",
    capacity: 200,
    type: "Home / Private Space",
    feeMinor: 0,
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80",
    desc: "We bring our complete decor, lighting, and entertainment crew directly to your private home or rented farmhouse with zero extra venue fee.",
  },
];

export default function VenuesPage() {
  return (
    <div className="py-12 sm:py-16 space-y-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="badge-gold uppercase tracking-wider text-xs">Locations & Spaces</span>
        <h1 className="text-4xl sm:text-5xl font-serif text-brand-navy-950">
          Birthday & Event Venues
        </h1>
        <div className="gold-divider mx-auto" />
        <p className="text-brand-navy-700 max-w-2xl mx-auto text-base sm:text-lg">
          Whether you prefer a scenic Margalla Hills terrace, a luxury indoor banquet hall, or an intimate setup in your own home, we handle full coordination.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {venues.map((v) => (
            <div key={v.slug} className="card-luxury flex flex-col justify-between group">
              <div>
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={v.image}
                    alt={v.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/80 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="badge-gold bg-brand-navy-950/90 text-brand-gold-300 border-brand-gold-400">
                      {v.city}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold font-serif">{v.name}</h3>
                    <p className="text-xs text-brand-navy-200 flex items-center mt-1">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-brand-gold-400" />
                      {v.address}
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold pb-3 border-b border-brand-warm-200">
                    <span className="flex items-center text-brand-navy-700">
                      <Building className="w-4 h-4 mr-1 text-brand-gold-600" />
                      {v.type}
                    </span>
                    <span className="flex items-center text-brand-navy-700">
                      <Users className="w-4 h-4 mr-1 text-brand-gold-600" />
                      Up to {v.capacity} Guests
                    </span>
                    <span className="text-brand-gold-700 font-bold">
                      {v.feeMinor === 0 ? "Zero Venue Fee" : formatPKR(v.feeMinor)}
                    </span>
                  </div>

                  <p className="text-xs text-brand-navy-700 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-brand-warm-100">
                <Link
                  href={`/book?venue=${encodeURIComponent(v.name)}`}
                  className="btn-gold w-full py-3 text-xs flex items-center justify-center space-x-1.5"
                >
                  <span>Select Venue for Booking</span>
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
