import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "Event Gallery & Portfolio | AR Events Co. Islamabad & Rawalpindi",
  description: "Browse real celebration setups, bespoke balloon arches, 3D backdrops, and birthday stages executed in Islamabad and Rawalpindi.",
};

const galleryItems = [
  {
    title: "Grand Midnight & Gold Milestone",
    category: "Adult Milestone",
    location: "Islamabad Club, F-6 Islamabad",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Enchanted Fairytale Princess 5th Birthday",
    category: "Kids Birthday",
    location: "Private Residence, Sector F-7 Islamabad",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Wild One 1st Birthday Safari setup",
    category: "Kids Birthday",
    location: "Bahria Town Phase 7, Rawalpindi",
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "21st Birthday Shimmer Wall & Marquee Numbers",
    category: "Milestone",
    location: "DHA Phase 2, Islamabad",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Intimate Pastel Cloud Lounge Birthday",
    category: "Intimate Home Setup",
    location: "Bani Gala Farmhouse, Islamabad",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Astronaut Space Quest Celebration",
    category: "Kids Birthday",
    location: "Satellite Town, Rawalpindi",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
  },
];

export default function GalleryPage() {
  return (
    <div className="py-12 sm:py-16 space-y-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="badge-gold uppercase tracking-wider text-xs">Our Portfolio</span>
        <h1 className="text-4xl sm:text-5xl font-serif text-brand-navy-950">
          Celebration Gallery
        </h1>
        <div className="gold-divider mx-auto" />
        <p className="text-brand-navy-700 max-w-2xl mx-auto text-base sm:text-lg">
          Take a look at real birthday celebrations, custom 3D backdrops, and luxury balloon installations delivered across the twin cities.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item, idx) => (
            <div key={idx} className="card-luxury group overflow-hidden">
              <div className="relative h-72 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/80 via-transparent to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
                
                <div className="absolute top-4 left-4">
                  <span className="badge-gold bg-brand-navy-950/90 text-brand-gold-300 border-brand-gold-400 text-xs">
                    {item.category}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <h3 className="text-lg font-bold font-serif">{item.title}</h3>
                  <p className="text-xs text-brand-navy-200">{item.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 p-8 bg-brand-warm-50 rounded-2xl border border-brand-warm-200 space-y-4">
          <h3 className="text-2xl font-serif text-brand-navy-950">Want a Similar Setup for Your Birthday?</h3>
          <p className="text-sm text-brand-navy-700 max-w-xl mx-auto">
            Our creative artisans can replicate or customize any of these designs for your venue.
          </p>
          <Link href="/book" className="btn-gold px-8 py-3 text-sm inline-flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Start Your Booking</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
