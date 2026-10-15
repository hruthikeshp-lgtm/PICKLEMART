'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Check, Plus, Minus, Eye, Flame } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails?: (product: Product) => void;
}

export default function ProductCard({ product, onOpenDetails }: ProductCardProps) {
  const { addItem, items, updateQuantity } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  // Check if item is already in cart
  const cartItem = items.find((i) => i.product.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const isVeg = product.category_id === 'veg';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.is_available) return;
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, inCartQty + 1);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, inCartQty - 1);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-pickle-cream/80 overflow-hidden shadow-card hover:shadow-cardHover transition-all duration-300 flex flex-col justify-between">
      {/* Top Image & Badges */}
      <div className="relative aspect-square w-full bg-pickle-cream/30 overflow-hidden">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Veg / Non-Veg Indicator Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm p-1.5 rounded-lg shadow-sm flex items-center gap-1.5 z-10">
          <span className={isVeg ? 'veg-badge' : 'non-veg-badge'} title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'} />
          <span className="text-[11px] font-semibold text-pickle-darkText">
            {isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>

        {/* Spice Level & Featured */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end z-10">
          {product.is_featured && (
            <span className="bg-pickle-yellow text-pickle-darkred text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              Popular
            </span>
          )}
          {product.spice_level && (
            <span className="bg-white/95 backdrop-blur-sm text-pickle-red text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
              <Flame className="w-3 h-3 fill-pickle-red" />
              {product.spice_level}
            </span>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {!product.is_available && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="bg-red-600 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-md tracking-wider shadow">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick View Button on Hover */}
        {onOpenDetails && (
          <button
            onClick={() => onOpenDetails(product)}
            className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-pickle-darkText p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
            title="Quick preview"
            aria-label="View product details"
          >
            <Eye className="w-4 h-4 text-pickle-red" />
          </button>
        )}
      </div>

      {/* Card Info Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-medium text-pickle-green bg-pickle-greenLight/70 px-2 py-0.5 rounded">
              Standard Pack: {product.package_weight_grams} g
            </span>
            <span className="text-xs text-gray-500 capitalize">
              {product.category_id === 'veg' ? 'Veg Pickles' : 'Non-Veg Pickles'}
            </span>
          </div>

          <h3
            onClick={() => onOpenDetails?.(product)}
            className="font-serif text-lg font-bold text-pickle-darkText line-clamp-1 hover:text-pickle-red transition-colors cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          <p className="text-xs text-gray-600 line-clamp-2 mt-1 min-h-[32px] leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Section */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-gray-500 block leading-none">Price for 250 g</span>
            <span className="font-serif text-xl font-extrabold text-pickle-red tracking-tight">
              {formatPrice(product.price_in_paise)}
            </span>
          </div>

          {/* Cart Controls */}
          {product.is_available ? (
            inCartQty > 0 ? (
              <div className="flex items-center bg-pickle-cream rounded-full border border-pickle-yellow p-1 shadow-sm">
                <button
                  onClick={handleDecrease}
                  className="w-7 h-7 rounded-full bg-white hover:bg-pickle-yellow text-pickle-darkred flex items-center justify-center transition-colors shadow-xs"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-pickle-darkText">
                  {inCartQty}
                </span>
                <button
                  onClick={handleIncrease}
                  className="w-7 h-7 rounded-full bg-white hover:bg-pickle-yellow text-pickle-darkred flex items-center justify-center transition-colors shadow-xs"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleQuickAdd}
                disabled={!product.is_available}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 ${
                  justAdded
                    ? 'bg-pickle-green text-white'
                    : 'bg-pickle-yellow hover:bg-yellow-400 text-pickle-darkred'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            )
          ) : (
            <button
              disabled
              className="px-3 py-1.5 bg-gray-100 text-gray-400 rounded-full text-xs font-medium cursor-not-allowed"
            >
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
