'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotalPaise,
    deliveryFeePaise,
    totalPaise,
    totalCount,
  } = useCart();

  const FREE_THRESHOLD = 50000;
  const remainingForFreeDelivery = Math.max(0, FREE_THRESHOLD - subtotalPaise);
  const freeDeliveryPercent = Math.min(100, (subtotalPaise / FREE_THRESHOLD) * 100);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-pickle-cream flex items-center justify-center text-5xl mx-auto shadow-inner">
          🏺
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-pickle-darkText">
            Your Cart is Empty
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            You haven&apos;t added any traditional pickles to your cart yet. Explore our 43 varieties of Grandma&apos;s authentic recipes!
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 bg-pickle-red hover:bg-pickle-darkred text-white text-sm font-bold px-8 py-3.5 rounded-full transition-all shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Pickle Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-pickle-darkText">
            Your Shopping Cart
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Review your traditional pickle selections before proceeding to delivery checkout.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-700 font-semibold self-start sm:self-auto flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items Table / List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free delivery bar */}
          <div className="bg-pickle-cream/80 p-4 rounded-2xl border border-pickle-cream shadow-xs text-xs">
            {remainingForFreeDelivery > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between font-medium">
                  <span className="flex items-center gap-1.5 text-pickle-red font-semibold">
                    <Truck className="w-4 h-4" />
                    Add {formatPrice(remainingForFreeDelivery)} more to unlock FREE Delivery!
                  </span>
                  <span className="text-gray-500">{Math.round(freeDeliveryPercent)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pickle-yellow transition-all duration-300"
                    style={{ width: `${freeDeliveryPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-pickle-green font-bold">
                <ShieldCheck className="w-5 h-5" />
                <span>You qualify for FREE Delivery across India!</span>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl shadow-card border border-pickle-cream/80 divide-y divide-gray-100 overflow-hidden">
            {items.map(({ product, quantity }) => {
              const isVeg = product.category_id === 'veg';
              const lineTotal = product.price_in_paise * quantity;

              return (
                <div key={product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className={isVeg ? 'veg-badge' : 'non-veg-badge'} />
                      <h3 className="font-serif text-base font-bold text-pickle-darkText">
                        {product.name}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500">
                      Standard Pack: {product.package_weight_grams} g • {isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                    </p>
                    <p className="text-xs font-semibold text-pickle-red">
                      {formatPrice(product.price_in_paise)} / jar
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-200 rounded-lg bg-pickle-warmWhite">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-2 hover:bg-gray-100 text-gray-600 rounded-l"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-pickle-darkText">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-2 hover:bg-gray-100 text-gray-600 rounded-r"
                      aria-label="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="w-28 text-center sm:text-right">
                    <span className="text-xs text-gray-400 block sm:hidden">Line Total:</span>
                    <span className="font-serif font-extrabold text-base text-pickle-red">
                      {formatPrice(lineTotal)}
                    </span>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(product.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 text-xs font-bold text-pickle-red hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping (Add more pickles)</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-card border border-pickle-cream space-y-6">
          <h2 className="font-serif text-xl font-bold text-pickle-darkText border-b border-gray-100 pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Items Subtotal ({totalCount} packs)</span>
              <span className="font-semibold text-pickle-darkText">{formatPrice(subtotalPaise)}</span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span>Standard Delivery Fee</span>
                <p className="text-[10px] text-gray-400">Free on orders above ₹500</p>
              </div>
              <span className="font-semibold">
                {deliveryFeePaise === 0 ? (
                  <span className="text-pickle-green font-bold uppercase">FREE</span>
                ) : (
                  formatPrice(deliveryFeePaise)
                )}
              </span>
            </div>

            <div className="flex justify-between pt-3 border-t border-gray-100 text-base font-bold text-pickle-darkText">
              <span>Grand Total</span>
              <span className="font-serif text-xl font-extrabold text-pickle-red">
                {formatPrice(totalPaise)}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 text-right">
              Inclusive of all taxes & packaging
            </p>
          </div>

          {/* Action Button */}
          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-2 bg-pickle-red hover:bg-pickle-darkred text-white font-bold text-sm py-3.5 rounded-2xl shadow-md transition-all active:scale-95"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-pickle-green shrink-0" />
              <span>100% Homemade Authenticity Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-pickle-green shrink-0" />
              <span>Leak-proof vacuum jar packaging</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
