import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, MessageCircle, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-navy-950 text-brand-warm-100 pt-16 pb-12 border-t border-brand-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-brand-navy-800">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="relative h-16 w-44">
              <Image
                src="/brand/bg remove logo.png"
                alt="AR Events Co. Logo"
                fill
                className="object-contain brightness-110"
              />
            </div>
            <p className="text-brand-gold-400 font-brand-title text-sm tracking-widest uppercase">
              Your Celebration, Our Passion
            </p>
            <p className="text-sm text-brand-navy-200 leading-relaxed">
              Islamabad and Rawalpindi&apos;s premier birthday planning and luxury decor specialists. Turning special milestones into unforgettable memories.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-brand-navy-900 text-brand-gold-400 hover:bg-brand-gold-500 hover:text-brand-navy-950 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-brand-navy-900 text-brand-gold-400 hover:bg-brand-gold-500 hover:text-brand-navy-950 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/923008555123"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-brand-navy-900 text-brand-gold-400 hover:bg-emerald-600 hover:text-white transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Event Services */}
          <div>
            <h4 className="text-base font-semibold text-white tracking-wider uppercase mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-brand-gold-400 mr-2"></span>
              Event Services
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-navy-200">
              <li>
                <Link href="/packages" className="hover:text-brand-gold-400 transition-colors">
                  Birthday Packages
                </Link>
              </li>
              <li>
                <Link href="/themes" className="hover:text-brand-gold-400 transition-colors">
                  Thematic Backdrops & Balloon Decor
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand-gold-400 transition-colors">
                  Photography & 4K Videography
                </Link>
              </li>
              <li>
                <Link href="/venues" className="hover:text-brand-gold-400 transition-colors">
                  Venues in Islamabad & Rawalpindi
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand-gold-400 transition-colors">
                  Custom Themed Cakes & Dessert Tables
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand-gold-400 transition-colors">
                  Kids Magic Shows & Live Counters
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Service Areas (Local SEO Focus) */}
          <div>
            <h4 className="text-base font-semibold text-white tracking-wider uppercase mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-brand-gold-400 mr-2"></span>
              Service Coverage
            </h4>
            <p className="text-xs text-brand-gold-300 font-medium mb-3">
              Direct On-Site Setup Available In:
            </p>
            <ul className="space-y-1.5 text-xs text-brand-navy-300 leading-relaxed">
              <li>• <strong className="text-brand-warm-100">Islamabad:</strong> F-6, F-7, F-8, F-10, F-11, E-7, E-11, G Sectors, I Sectors</li>
              <li>• <strong className="text-brand-warm-100">Islamabad Suburbs:</strong> Bani Gala, Chak Shahzad, Park View City, Bahria Enclave</li>
              <li>• <strong className="text-brand-warm-100">Rawalpindi:</strong> Bahria Town (Phases 1-8), DHA (Phases 1-5), Cantt, Satellite Town, Westridge</li>
            </ul>
          </div>

          {/* Column 4: Direct Contact & Working Hours */}
          <div>
            <h4 className="text-base font-semibold text-white tracking-wider uppercase mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-brand-gold-400 mr-2"></span>
              Contact & Bookings
            </h4>
            <div className="space-y-3 text-sm text-brand-navy-200">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-brand-gold-400 mt-1 flex-shrink-0" />
                <span>Sector F-7 / Blue Area, Islamabad & Bahria Town, Rawalpindi</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-brand-gold-400 flex-shrink-0" />
                <a href="tel:+923008555123" className="hover:text-brand-gold-400 transition-colors">
                  +92 300 8555123
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-brand-gold-400 flex-shrink-0" />
                <a href="mailto:info@areventsco.com" className="hover:text-brand-gold-400 transition-colors">
                  info@areventsco.com
                </a>
              </div>
              <div className="flex items-start space-x-3 pt-1">
                <Clock className="w-4 h-4 text-brand-gold-400 mt-1 flex-shrink-0" />
                <span className="text-xs">Mon - Sun: 10:00 AM - 10:00 PM (Online Bookings 24/7)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-navy-400">
          <p>© {new Date().getFullYear()} AR Events Co. (areventsco.com). All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <Link href="/faq" className="hover:text-brand-gold-400 transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-brand-gold-400 transition-colors">Contact</Link>
            <Link href="/admin" className="text-brand-navy-400 hover:text-brand-gold-400 transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
