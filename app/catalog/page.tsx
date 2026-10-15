'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, RefreshCw, X, Sparkles, AlertCircle } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import { Product } from '@/types';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sync state if URL query params change
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get('search');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Fetch all products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by Category
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category_id === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price_in_paise - b.price_in_paise);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price_in_paise - a.price_in_paise);
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'featured':
      default:
        // Featured first, then alphabetical
        list.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return a.name.localeCompare(b.name);
        });
        break;
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const vegCount = products.filter((p) => p.category_id === 'veg').length;
  const nonVegCount = products.filter((p) => p.category_id === 'non-veg').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pickle-darkred to-pickle-red rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-pickle-yellow/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-pickle-yellow inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Pickle Mart Traditional Menu
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-pickle-cream">
            Complete Pickle Catalog
          </h1>
          <p className="text-sm text-pickle-cream/80 leading-relaxed">
            All 43 traditional vegetarian and non-vegetarian pickles from our authentic printed menu. All items packed in 250 g standard packaging.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-card border border-pickle-cream/80 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Live Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by pickle name (e.g. Mango, Chicken, Gongura, Prawn)..."
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pickle-red/30 focus:border-pickle-red bg-pickle-warmWhite"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Control */}
          <div className="md:col-span-6 flex flex-wrap items-center justify-end gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
              <SlidersHorizontal className="w-4 h-4 text-pickle-red" />
              <span>Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 bg-pickle-warmWhite text-pickle-darkText focus:outline-none focus:ring-2 focus:ring-pickle-red/30 focus:border-pickle-red"
            >
              <option value="featured">Popular / Featured First</option>
              <option value="price-asc">Price: Low to High (₹)</option>
              <option value="price-desc">Price: High to Low (₹)</option>
              <option value="name-asc">Alphabetical: A to Z</option>
              <option value="name-desc">Alphabetical: Z to A</option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-pickle-red text-white shadow-sm'
                : 'bg-pickle-cream/60 text-pickle-darkText hover:bg-pickle-cream'
            }`}
          >
            All Products ({products.length})
          </button>

          <button
            onClick={() => setSelectedCategory('veg')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'veg'
                ? 'bg-pickle-green text-white shadow-sm'
                : 'bg-pickle-greenLight/60 text-pickle-green hover:bg-pickle-greenLight'
            }`}
          >
            <span className="veg-badge" />
            <span>Veg Pickles ({vegCount})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('non-veg')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'non-veg'
                ? 'bg-pickle-darkred text-white shadow-sm'
                : 'bg-red-50 text-pickle-red hover:bg-red-100'
            }`}
          >
            <span className="non-veg-badge" />
            <span>Non-Veg Pickles ({nonVegCount})</span>
          </button>
        </div>
      </div>

      {/* Results Count & Active Filters Indicator */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <div>
          Showing <span className="font-bold text-pickle-darkText">{filteredProducts.length}</span> of{' '}
          {products.length} pickles
          {selectedCategory !== 'all' && (
            <span> in <strong className="capitalize text-pickle-red">{selectedCategory === 'veg' ? 'Veg Pickles' : 'Non-Veg Pickles'}</strong></span>
          )}
          {searchQuery && (
            <span> matching &quot;<strong className="text-pickle-darkText">{searchQuery}</strong>&quot;</span>
          )}
        </div>
        {(selectedCategory !== 'all' || searchQuery !== '') && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="text-pickle-red hover:underline font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-pickle-cream shadow-card max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-pickle-cream flex items-center justify-center text-3xl mx-auto">
            🔍
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-pickle-darkText">
              No pickles found
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              We couldn&apos;t find any pickles matching your search &quot;{searchQuery}&quot;. Try searching for &quot;Mango&quot;, &quot;Chicken&quot;, or &quot;Avakaya&quot;.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="bg-pickle-red text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-pickle-darkred transition-colors"
          >
            View All 43 Pickles
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      )}

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

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">
          Loading Pickle Mart Catalog...
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
