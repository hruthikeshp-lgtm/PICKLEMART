import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, MessageCircle, Heart, ShieldCheck, Truck, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-pickle-darkred text-pickle-cream border-t-4 border-pickle-yellow">
      {/* Trust Badges Bar */}
      <div className="bg-pickle-red/80 border-b border-pickle-red/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-10 h-10 rounded-full bg-pickle-yellow text-pickle-darkred flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 fill-pickle-darkred" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Authentic Grandma Recipe</h4>
                <p className="text-xs text-pickle-cream/80">Heirloom spice blends & care</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-10 h-10 rounded-full bg-pickle-yellow text-pickle-darkred flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Pure Cold-Pressed Oils</h4>
                <p className="text-xs text-pickle-cream/80">No artificial preservatives</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-10 h-10 rounded-full bg-pickle-yellow text-pickle-darkred flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Fresh Vacuum Packing</h4>
                <p className="text-xs text-pickle-cream/80">Spill-proof, airtight delivery</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-10 h-10 rounded-full bg-pickle-yellow text-pickle-darkred flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Safe & Hygienic</h4>
                <p className="text-xs text-pickle-cream/80">Prepared in traditional clean kitchen</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pickle-yellow flex items-center justify-center text-xl shadow">
                🏺
              </div>
              <span className="font-serif text-2xl font-bold text-pickle-yellow">Pickle Mart</span>
            </div>
            <p className="text-xs text-pickle-cream/90 italic font-serif">
              &quot;Feel the real taste, made by Grandma.&quot;
            </p>
            <p className="text-sm text-pickle-cream/80 leading-relaxed">
              Bringing centuries of traditional Indian pickle craftsmanship straight to your dining table. Made with handpicked ingredients, sun-cured spices, and pure unadulterated oils.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/919876543210?text=Hello%20Pickle%20Mart!%20I%20would%20like%20to%20inquire%20about%20your%20traditional%20pickles."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-pickle-yellow mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-pickle-cream/80">
              <li>
                <Link href="/" className="hover:text-pickle-yellow transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-pickle-yellow transition-colors">
                  Complete Catalog (43 Varieties)
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=veg" className="hover:text-pickle-yellow transition-colors">
                  Vegetarian Pickles (22 Items)
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=non-veg" className="hover:text-pickle-yellow transition-colors">
                  Non-Vegetarian Pickles (21 Items)
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-pickle-yellow transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-pickle-yellow transition-colors">
                  About Pickle Mart
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-pickle-yellow transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-pickle-yellow transition-colors">
                  Store Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-pickle-yellow mb-4">Specialties</h3>
            <ul className="space-y-2 text-sm text-pickle-cream/80">
              <li>
                <Link href="/catalog?search=Mango+Avakaya" className="hover:text-pickle-yellow transition-colors">
                  Mango Avakaya Pickle (₹150 / 250g)
                </Link>
              </li>
              <li>
                <Link href="/catalog?search=Chicken+Pickle" className="hover:text-pickle-yellow transition-colors">
                  Chicken Pickle (₹250 / 250g)
                </Link>
              </li>
              <li>
                <Link href="/catalog?search=Boneless+Chicken" className="hover:text-pickle-yellow transition-colors">
                  Boneless Chicken Pickle (₹300 / 250g)
                </Link>
              </li>
              <li>
                <Link href="/catalog?search=Gongura" className="hover:text-pickle-yellow transition-colors">
                  Gongura Pickle & Combos
                </Link>
              </li>
              <li>
                <Link href="/catalog?search=Prawn" className="hover:text-pickle-yellow transition-colors">
                  Small & Large Prawn Pickles
                </Link>
              </li>
              <li>
                <Link href="/catalog?search=Mutton" className="hover:text-pickle-yellow transition-colors">
                  Mutton & Kheema Pickles
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-pickle-yellow mb-4">Store & Contact</h3>
            <div className="space-y-3 text-sm text-pickle-cream/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-pickle-yellow shrink-0 mt-0.5" />
                <span>
                  Pickle Mart Store & Kitchen<br />
                  Traditional Food Street, Main Bazaar<br />
                  Andhra Pradesh & Telangana, India
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-pickle-yellow shrink-0" />
                <a href="tel:+919876543210" className="hover:text-pickle-yellow">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-pickle-yellow shrink-0" />
                <a href="mailto:orders@picklemart.in" className="hover:text-pickle-yellow">
                  orders@picklemart.in
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-pickle-yellow shrink-0 mt-0.5" />
                <div>
                  <p>Mon - Sat: 9:00 AM - 8:30 PM</p>
                  <p>Sunday: 10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-pickle-red/50 text-center sm:flex sm:justify-between sm:items-center text-xs text-pickle-cream/70">
          <p>© {new Date().getFullYear()} Pickle Mart. All rights reserved. Standard packaging: 250 grams.</p>
          <p className="mt-2 sm:mt-0 font-serif italic text-pickle-yellow/80">
            &quot;Feel the real taste, made by Grandma.&quot;
          </p>
        </div>
      </div>
    </footer>
  );
}
