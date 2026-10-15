'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Check, Plus, Minus, ShieldCheck, Flame, Sparkles, AlertCircle } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  relatedProducts?: Product[];
  onSelectProduct?: (product: Product) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  relatedProducts = [],
  onSelectProduct,
}: ProductDetailModalProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const isVeg = product.category_id === 'veg';

  const handleAddToCart = () => {
    if (!product.is_available) return;
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Modal Window */}
        <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-pickle-cream">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 rounded-full bg-white/80 p-2 text-gray-500 hover:bg-white hover:text-pickle-red shadow transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image side */}
            <div className="relative h-72 md:h-full min-h-[300px] bg-pickle-cream/30">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1.5 z-10">
                <span className={isVeg ? 'veg-badge' : 'non-veg-badge'} />
                <span className="text-xs font-semibold text-pickle-darkText">
                  {isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                </span>
              </div>
            </div>

            {/* Content side */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-pickle-green bg-pickle-greenLight px-2.5 py-1 rounded">
                    Standard Pack: {product.package_weight_grams} g
                  </span>
                  {product.spice_level && (
                    <span className="text-xs font-medium text-pickle-red bg-red-50 px-2 py-1 rounded flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-pickle-red" />
                      {product.spice_level}
                    </span>
                  )}
                </div>

                <h2 className="font-serif text-2xl font-bold text-pickle-darkText">
                  {product.name}
                </h2>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-serif text-2xl font-extrabold text-pickle-red">
                    {formatPrice(product.price_in_paise)}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">/ 250 grams pack</span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    About this pickle
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Storage & Shelf Life Info */}
                <div className="mt-4 bg-pickle-cream/50 rounded-xl p-3 border border-pickle-cream text-xs text-pickle-darkText space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-pickle-red">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Grandma&apos;s Preservation Advice:</span>
                  </div>
                  <p className="text-gray-600">
                    Always use a clean dry spoon. Keep the top oil layer intact to seal in freshness. Store in a cool dry place away from moisture.
                  </p>
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">Select Packs:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-l"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold">{qty}</span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-r"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {product.is_available ? (
                    <button
                      onClick={handleAddToCart}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 ${
                        added
                          ? 'bg-pickle-green text-white'
                          : 'bg-pickle-yellow hover:bg-yellow-400 text-pickle-darkred'
                      }`}
                    >
                      {added ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Cart ({formatPrice(product.price_in_paise * qty)})</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex-1 py-3 text-center bg-gray-100 text-gray-500 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span>Currently Out of Stock</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Pickles from same category */}
          {relatedProducts.length > 0 && (
            <div className="p-6 bg-pickle-cream/30 border-t border-pickle-cream">
              <h4 className="font-serif text-sm font-bold text-pickle-darkText mb-3">
                More from {isVeg ? 'Veg Pickles' : 'Non-Veg Pickles'}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedProducts.slice(0, 4).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectProduct?.(rel)}
                    className="cursor-pointer bg-white p-2 rounded-xl border border-pickle-cream/80 hover:shadow transition-all group"
                  >
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-100 mb-1.5">
                      <Image
                        src={rel.image_url}
                        alt={rel.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-xs font-semibold line-clamp-1 group-hover:text-pickle-red">
                      {rel.name}
                    </p>
                    <p className="text-xs font-bold text-pickle-red">
                      {formatPrice(rel.price_in_paise)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
