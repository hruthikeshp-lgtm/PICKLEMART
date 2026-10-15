'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, Menu, X, Shield, Phone, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { totalCount, openCart } = useCart();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'All Pickles', href: '/catalog' },
    { name: 'Veg Pickles', href: '/catalog?category=veg' },
    { name: 'Non-Veg Pickles', href: '/catalog?category=non-veg' },
    { name: 'Track Order', href: '/track-order' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Top Announcement Bar */}
      <div className="bg-pickle-darkred text-pickle-cream px-4 py-1.5 text-xs text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-pickle-yellow animate-pulse" />
        <span>Free Home Delivery across India on orders above ₹500! Freshly prepared, traditional recipes.</span>
        <span className="hidden sm:inline text-pickle-yellow">|</span>
        <span className="hidden sm:inline">Tagline: &quot;Feel the real taste, made by Grandma.&quot;</span>
      </div>

      {/* Main Navbar */}
      <nav className="bg-pickle-red text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-full bg-pickle-yellow flex items-center justify-center text-pickle-darkred shadow-md group-hover:scale-105 transition-transform font-bold text-xl border-2 border-pickle-cream">
                🏺
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-wide text-pickle-cream group-hover:text-pickle-yellow transition-colors">
                  Pickle Mart
                </span>
                <span className="block text-[11px] font-medium tracking-wider text-pickle-yellowLight uppercase">
                  Made by Grandma
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href.includes('?') && pathname === link.href.split('?')[0]);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-pickle-darkred text-pickle-yellow'
                        : 'text-pickle-cream hover:text-pickle-yellow hover:bg-pickle-darkred/60'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search Shortcut */}
              <Link
                href="/catalog"
                className="p-2 text-pickle-cream hover:text-pickle-yellow hover:bg-pickle-darkred rounded-full transition-colors"
                title="Search Pickles"
                aria-label="Search Pickles"
              >
                <Search className="w-5 h-5" />
              </Link>

              {/* Admin Portal Shortcut */}
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-pickle-cream/90 bg-pickle-darkred/80 hover:bg-pickle-darkred rounded-md transition-colors border border-pickle-yellow/30"
                title="Store Admin Panel"
              >
                <Shield className="w-3.5 h-3.5 text-pickle-yellow" />
                <span>Admin</span>
              </Link>

              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative flex items-center gap-2 bg-pickle-yellow hover:bg-yellow-400 text-pickle-darkred font-semibold px-3 sm:px-4 py-2 rounded-full transition-all shadow-md active:scale-95"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">Cart</span>
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-pickle-red rounded-full">
                  {totalCount}
                </span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-pickle-cream hover:text-pickle-yellow focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-pickle-darkred border-t border-pickle-red/50 px-4 pt-3 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-md text-base font-medium text-pickle-cream hover:text-pickle-yellow hover:bg-pickle-red"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-pickle-red/40 flex items-center justify-between">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm text-pickle-cream hover:text-pickle-yellow"
              >
                <Shield className="w-4 h-4 text-pickle-yellow" />
                <span>Admin Portal</span>
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm text-pickle-yellow hover:underline"
              >
                <Phone className="w-4 h-4" />
                <span>Help & Order Info</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
