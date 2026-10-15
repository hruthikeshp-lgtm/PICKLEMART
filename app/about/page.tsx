import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Sparkles, Award, ShieldCheck, Sun, CheckCircle, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-pickle-darkred via-pickle-red to-[#481318] text-pickle-cream py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-pickle-yellow bg-pickle-yellow/20 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 border border-pickle-yellow/40">
            <Sparkles className="w-3.5 h-3.5" />
            Pickle Mart Story
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-white">
            Rooted in Tradition. Crafted with Love.
          </h1>
          <p className="font-serif text-xl sm:text-2xl text-pickle-yellow italic">
            &quot;Feel the real taste, made by Grandma.&quot;
          </p>
          <p className="text-sm sm:text-base text-pickle-cream/80 max-w-2xl mx-auto leading-relaxed pt-2">
            Pickle Mart was born out of a desire to preserve the rich, time-honored culinary heritage of authentic Indian pickles and bring that unmistakable homemade flavor straight to your table.
          </p>
        </div>
      </section>

      {/* Main Story & Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-pickle-cream aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80"
                alt="Traditional Indian Pickle Jars and Spices"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-pickle-cream max-w-xs text-xs space-y-1">
              <span className="font-serif font-bold text-pickle-red block text-sm">
                Pure Homemade Process
              </span>
              <p className="text-gray-600">
                Small-batch preparation with hand-selected sour mangoes, herbs, fresh meats, and cold-pressed oils.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-xs font-bold text-pickle-red uppercase tracking-wider">
              Authentic Indian Culinary Craft
            </span>
            <h2 className="font-serif text-3xl font-bold text-pickle-darkText leading-tight">
              Why Our Pickles Taste Just Like Home
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              In traditional Indian households, pickling isn’t merely cooking—it is an art form mastered over generations. From waiting for the perfect season of raw sour mangoes to hand-measuring roasted mustard seeds and fenugreek, every step requires care, patience, and devotion.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              At Pickle Mart, we stay true to these time-tested traditions. Whether it is our iconic <strong>Mango Avakaya</strong>, tangy <strong>Gongura</strong>, or our rich, slow-simmered <strong>Chicken and Prawn pickles</strong>, our goal is to deliver the warmth, aroma, and punch of true grandma-made pickles.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2 text-pickle-darkText">
                <CheckCircle className="w-4 h-4 text-pickle-green shrink-0" />
                <span>Wood-pressed sesame & mustard oils</span>
              </div>
              <div className="flex items-center gap-2 text-pickle-darkText">
                <CheckCircle className="w-4 h-4 text-pickle-green shrink-0" />
                <span>Hand-pounded regional spices</span>
              </div>
              <div className="flex items-center gap-2 text-pickle-darkText">
                <CheckCircle className="w-4 h-4 text-pickle-green shrink-0" />
                <span>No artificial chemical preservatives</span>
              </div>
              <div className="flex items-center gap-2 text-pickle-darkText">
                <CheckCircle className="w-4 h-4 text-pickle-green shrink-0" />
                <span>Hygienic 250g tamper-evident jars</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars of Quality */}
      <section className="bg-pickle-warmWhite py-12 border-y border-pickle-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-bold text-pickle-red uppercase tracking-wider">
              Our Core Principles
            </span>
            <h2 className="font-serif text-3xl font-bold text-pickle-darkText">
              The Pickle Mart Commitment
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pickle-cream shadow-card space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pickle-cream text-pickle-red flex items-center justify-center">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-pickle-darkText">Traditional Sun-Curing</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Allowing the lemons, amla, and raw spices to mature under natural sunlight locks in genuine flavors and natural longevity without artificial shortcuts.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pickle-cream shadow-card space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pickle-yellow text-pickle-darkred flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-pickle-darkText">Pure & Honest Ingredients</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                We select real country garlic, Guntur red chillies, fresh coriander, ginger, and prime poultry and seafood cuts sourced with utmost freshness.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pickle-cream shadow-card space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pickle-greenLight text-pickle-green flex items-center justify-center">
                <Heart className="w-6 h-6 fill-pickle-green" />
              </div>
              <h3 className="font-serif text-lg font-bold text-pickle-darkText">The Taste of Home</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Every jar delivers that comforting, spicy, tangy burst that elevates hot steamed rice, rotis, dosas, and parathas to a festive celebration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-pickle-darkText">
          Ready to experience genuine grandmother recipes?
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
          Explore our complete digital storefront featuring 43 hand-curated traditional varieties.
        </p>
        <div className="pt-2">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 bg-pickle-red hover:bg-pickle-darkred text-white text-sm font-bold px-8 py-3.5 rounded-full shadow-lg transition-all"
          >
            <span>Explore All 43 Pickles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
