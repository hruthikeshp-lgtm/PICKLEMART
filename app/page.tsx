'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Heart, ShieldCheck, Truck, ShoppingBag, Star, CheckCircle2, Award } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import { Product } from '@/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load featured products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const featuredVeg = products.filter((p) => p.category_id === 'veg' && p.is_featured).slice(0, 4);
  const featuredNonVeg = products.filter((p) => p.category_id === 'non-veg' && p.is_featured).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-pickle-darkred via-pickle-red to-[#4A1218] text-pickle-cream overflow-hidden py-16 sm:py-24">
        {/* Decorative background spice glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-pickle-yellow/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-pickle-yellow/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-pickle-yellow/20 border border-pickle-yellow/40 text-pickle-yellow px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Heirloom Indian Recipes • 100% Homemade</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Traditional Taste. <br />
                <span className="text-pickle-yellow">Homemade Goodness.</span>
              </h1>

              <p className="text-lg sm:text-xl text-pickle-cream/90 font-serif italic">
                &quot;Feel the real taste, made by Grandma.&quot;
              </p>

              <p className="text-sm sm:text-base text-pickle-cream/80 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Explore our delicious range of traditional vegetarian and non-vegetarian pickles. Handcrafted in small batches with farm-fresh raw mangoes, sun-cured spices, and wood-pressed sesame oil.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/catalog"
                  className="flex items-center gap-2 bg-pickle-yellow hover:bg-yellow-400 text-pickle-darkred font-bold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Shop Now</span>
                </Link>

                <Link
                  href="/catalog?category=veg"
                  className="flex items-center gap-2 border-2 border-pickle-yellow text-pickle-yellow hover:bg-pickle-yellow hover:text-pickle-darkred font-bold text-sm sm:text-base px-6 py-3 rounded-full transition-all"
                >
                  <span>Explore Veg Range</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/catalog?category=non-veg"
                  className="flex items-center gap-2 text-pickle-cream/90 hover:text-white underline text-sm sm:text-base px-2 py-2 transition-colors"
                >
                  <span>Non-Veg Pickles</span>
                </Link>
              </div>

              {/* Quick stats pills */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-pickle-red/80 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <span className="font-serif text-2xl font-bold text-pickle-yellow">43+</span>
                  <p className="text-xs text-pickle-cream/70">Menu Varieties</p>
                </div>
                <div>
                  <span className="font-serif text-2xl font-bold text-pickle-yellow">250g</span>
                  <p className="text-xs text-pickle-cream/70">Standard Pack</p>
                </div>
                <div>
                  <span className="font-serif text-2xl font-bold text-pickle-yellow">100%</span>
                  <p className="text-xs text-pickle-cream/70">Pure Spices & Oil</p>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-pickle-yellow/40 aspect-[4/3] sm:aspect-square">
                  <Image
                    src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80"
                    alt="Authentic Indian Mango Avakaya Pickle in traditional bowl"
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-xs font-bold uppercase tracking-wider text-pickle-yellow">
                      Grandma&apos;s Signature
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold">
                      Mango Avakaya & Gongura
                    </h3>
                    <p className="text-xs text-pickle-cream/80 mt-1">
                      Aged to perfection in stone jars (jaadi) with cold-pressed oil
                    </p>
                  </div>
                </div>

                {/* Floating highlight badge */}
                <div className="absolute -bottom-5 -left-5 bg-white text-pickle-darkText p-3.5 rounded-2xl shadow-xl border border-pickle-cream flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pickle-cream flex items-center justify-center text-xl">
                    🌿
                  </div>
                  <div>
                    <p className="text-xs font-bold">Zero Preservatives</p>
                    <p className="text-[10px] text-gray-500">Natural salt & oil curing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY SPOTLIGHT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-pickle-red">
            Handcrafted Selection
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-pickle-darkText">
            Explore By Categories
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Choose from our extensive 43-item menu, freshly packed in hygienic 250-gram jars.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Veg Pickles Card */}
          <Link
            href="/catalog?category=veg"
            className="group relative rounded-3xl overflow-hidden shadow-card hover:shadow-cardHover transition-all border border-pickle-cream bg-white flex flex-col sm:flex-row h-full"
          >
            <div className="relative w-full sm:w-1/2 h-56 sm:h-auto bg-gray-100 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80"
                alt="Vegetarian Pickles Collection"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-white/95 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                <span className="veg-badge" />
                <span className="text-xs font-bold text-pickle-green">100% Pure Veg</span>
              </div>
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-pickle-green uppercase tracking-wider">
                  22 Authentic Varieties
                </span>
                <h3 className="font-serif text-2xl font-bold text-pickle-darkText group-hover:text-pickle-red transition-colors mt-1">
                  Vegetarian Pickles
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  From fiery Mango Avakaya and Bellam Avakaya to Gongura, Ginger, Garlic, and Red Chilli pickles.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="text-[11px] bg-pickle-cream text-pickle-darkText px-2 py-0.5 rounded">
                    Mango Avakaya ₹150
                  </span>
                  <span className="text-[11px] bg-pickle-cream text-pickle-darkText px-2 py-0.5 rounded">
                    Bellam Avakaya ₹140
                  </span>
                  <span className="text-[11px] bg-pickle-cream text-pickle-darkText px-2 py-0.5 rounded">
                    Gongura ₹140
                  </span>
                </div>
              </div>
              <div className="pt-6 flex items-center gap-2 text-sm font-bold text-pickle-red group-hover:translate-x-1 transition-transform">
                <span>View All 22 Veg Pickles</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Non-Veg Pickles Card */}
          <Link
            href="/catalog?category=non-veg"
            className="group relative rounded-3xl overflow-hidden shadow-card hover:shadow-cardHover transition-all border border-pickle-cream bg-white flex flex-col sm:flex-row h-full"
          >
            <div className="relative w-full sm:w-1/2 h-56 sm:h-auto bg-gray-100 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80"
                alt="Non-Vegetarian Pickles Collection"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-white/95 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                <span className="non-veg-badge" />
                <span className="text-xs font-bold text-pickle-red">Rich Non-Veg</span>
              </div>
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-pickle-red uppercase tracking-wider">
                  21 Royal Varieties
                </span>
                <h3 className="font-serif text-2xl font-bold text-pickle-darkText group-hover:text-pickle-red transition-colors mt-1">
                  Non-Veg Pickles
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  Slow-simmered Chicken, Boneless Chicken, Natukodi, Korameenu Fish, Prawns, Mutton, and Gongura infusions.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="text-[11px] bg-red-50 text-pickle-red px-2 py-0.5 rounded">
                    Chicken ₹250
                  </span>
                  <span className="text-[11px] bg-red-50 text-pickle-red px-2 py-0.5 rounded">
                    Boneless Chicken ₹300
                  </span>
                  <span className="text-[11px] bg-red-50 text-pickle-red px-2 py-0.5 rounded">
                    Prawns ₹375
                  </span>
                </div>
              </div>
              <div className="pt-6 flex items-center gap-2 text-sm font-bold text-pickle-red group-hover:translate-x-1 transition-transform">
                <span>View All 21 Non-Veg Pickles</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. FEATURED VEG BESTSELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-pickle-green font-semibold text-xs tracking-wider uppercase">
              <span className="veg-badge" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-pickle-darkText mt-1">
              Popular Vegetarian Pickles
            </h2>
          </div>
          <Link
            href="/catalog?category=veg"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-pickle-red hover:text-pickle-darkred transition-colors"
          >
            <span>See all 22 Veg Pickles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVeg.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. FEATURED NON-VEG DELICACIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-pickle-red font-semibold text-xs tracking-wider uppercase">
              <span className="non-veg-badge" />
              <span>Royal Flavors</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-pickle-darkText mt-1">
              Signature Non-Veg Pickles
            </h2>
          </div>
          <Link
            href="/catalog?category=non-veg"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-pickle-red hover:text-pickle-darkred transition-colors"
          >
            <span>See all 21 Non-Veg Pickles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredNonVeg.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. GRANDMA'S TRADITION STORY SECTION */}
      <section className="bg-pickle-cream/60 py-16 sm:py-20 border-y border-pickle-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Story Imagery Collage */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-lg border-2 border-pickle-yellow aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&auto=format&fit=crop&q=80"
                  alt="Traditional Indian spices and pickle preparation"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-pickle-darkred text-pickle-cream p-5 rounded-2xl shadow-xl max-w-xs hidden sm:block border border-pickle-yellow">
                <p className="font-serif italic text-sm text-pickle-yellow font-bold">
                  &quot;The secret lies in unhurried patience, hand-ground spices, and pure sesame oil.&quot;
                </p>
                <p className="text-xs text-pickle-cream/70 mt-1">— Grandma&apos;s Wisdom</p>
              </div>
            </div>

            {/* Story Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-pickle-red font-bold text-xs uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Our Heritage & Craft</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-pickle-darkText leading-tight">
                Authentic Taste, Handcrafted with Love & Pure Care
              </h2>

              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                At Pickle Mart, our journey started with Grandma’s cherished ceramic jars (bharanies) lined up on the sunlit terrace. Every pickle recipe is passed down through generations, strictly avoiding factory shortcuts, artificial colors, or chemical preservatives.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-pickle-green shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-pickle-darkText">Traditional Sun-Drying</h4>
                    <p className="text-xs text-gray-600">Retaining authentic natural tartness and intense aroma.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-pickle-green shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-pickle-darkText">Cold-Pressed Oils</h4>
                    <p className="text-xs text-gray-600">Pure wood-pressed gingelly and mustard oils for digestion.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-pickle-green shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-pickle-darkText">Fresh Cut Meats & Veggies</h4>
                    <p className="text-xs text-gray-600">Crisp sour mangoes and high-grade poultry, fish & prawns.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-pickle-green shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-pickle-darkText">Stone-Ground Spices</h4>
                    <p className="text-xs text-gray-600">Whole roasted mustard, fenugreek, and Guntur chillies.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 bg-pickle-red hover:bg-pickle-darkred text-white text-sm font-bold px-6 py-3 rounded-full transition-colors shadow"
                >
                  <span>Read Our Full Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW TO ORDER: 3 EASY STEPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-pickle-red">
            Hassle-Free Shopping
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-pickle-darkText">
            How It Works in 3 Simple Steps
          </h2>
          <p className="text-sm text-gray-600 max-w-lg mx-auto">
            Order your favorite traditional pickles in just a few clicks. No mandatory account required!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-pickle-cream shadow-card text-center space-y-4 relative">
            <div className="w-14 h-14 rounded-2xl bg-pickle-cream text-pickle-red font-serif text-2xl font-bold flex items-center justify-center mx-auto shadow-inner">
              1
            </div>
            <h3 className="font-serif text-xl font-bold text-pickle-darkText">Choose Your Pickles</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Explore 43 varieties of vegetarian & non-vegetarian pickles. Filter by spicy level or category, and add to your cart.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-pickle-cream shadow-card text-center space-y-4 relative">
            <div className="w-14 h-14 rounded-2xl bg-pickle-yellow text-pickle-darkred font-serif text-2xl font-bold flex items-center justify-center mx-auto shadow-inner">
              2
            </div>
            <h3 className="font-serif text-xl font-bold text-pickle-darkText">Simple Checkout</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Enter your delivery address and choose Cash on Delivery (COD), Pay at Store, or Instant Online Payment.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-pickle-cream shadow-card text-center space-y-4 relative">
            <div className="w-14 h-14 rounded-2xl bg-pickle-greenLight text-pickle-green font-serif text-2xl font-bold flex items-center justify-center mx-auto shadow-inner">
              3
            </div>
            <h3 className="font-serif text-xl font-bold text-pickle-darkText">Fresh Doorstep Delivery</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Vacuum-sealed in leak-proof 250g packaging and dispatched swiftly. Track your order status in real time!
            </p>
          </div>
        </div>
      </section>

      {/* 7. CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-pickle-darkred to-pickle-red rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-xl border-2 border-pickle-yellow">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold text-pickle-yellow uppercase tracking-wider">
              Ready for authentic taste?
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-pickle-cream">
              Taste the True Grandma&apos;s Recipe Today
            </h2>
            <p className="text-xs sm:text-sm text-pickle-cream/80">
              Orders placed today are freshly packed and shipped directly to your doorstep. Free delivery above ₹500!
            </p>
          </div>
          <Link
            href="/catalog"
            className="shrink-0 bg-pickle-yellow hover:bg-yellow-400 text-pickle-darkred font-bold text-base px-8 py-4 rounded-full shadow-lg transition-transform hover:scale-105"
          >
            Explore Complete Menu (43 Items)
          </Link>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          relatedProducts={products.filter(
            (p) => p.category_id === selectedProduct.category_id && p.id !== selectedProduct.id
          )}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />
      )}
    </div>
  );
}
