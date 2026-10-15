'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotalPaise,
    deliveryFeePaise,
    totalPaise,
    totalCount,
  } = useCart();

  if (!isCartOpen) return null;

  const FREE_THRESHOLD = 50000;
  const remainingForFreeDelivery = Math.max(0, FREE_THRESHOLD - subtotalPaise);
  const freeDeliveryPercent = Math.min(100, (subtotalPaise / FREE_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-pickle-red text-white flex items-center justify-between shadow">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-pickle-yellow" />
              <h2 className="font-serif text-lg font-bold">Your Shopping Cart</h2>
              <span className="text-xs bg-pickle-darkred px-2 py-0.5 rounded-full font-semibold text-pickle-yellow">
                {totalCount} {totalCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1 rounded-full text-pickle-cream hover:text-white hover:bg-pickle-darkred transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Promo Progress Bar */}
          {items.length > 0 && (
            <div className="bg-pickle-cream/60 p-3 border-b border-pickle-cream text-xs text-pickle-darkText">
              {remainingForFreeDelivery > 0 ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between font-medium">
                    <span className="flex items-center gap-1 text-pickle-red">
                      <Truck className="w-3.5 h-3.5" />
                      Add {formatPrice(remainingForFreeDelivery)} more for FREE Delivery!
                    </span>
                    <span className="text-gray-500">{Math.round(freeDeliveryPercent)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pickle-yellow transition-all duration-300"
                      style={{ width: `${freeDeliveryPercent}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-pickle-green font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Congratulations! You unlocked FREE Delivery across India.</span>
                </div>
              )}
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-pickle-cream flex items-center justify-center text-4xl shadow-inner">
                  🏺
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-pickle-darkText">
                    Your cart is currently empty
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs">
                    Explore Grandma&apos;s traditional 43 vegetarian and non-vegetarian pickles prepared with authentic spices.
                  </p>
                </div>
                <Link
                  href="/catalog"
                  onClick={closeCart}
                  className="bg-pickle-red hover:bg-pickle-darkred text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors shadow"
                >
                  Browse Pickle Menu
                </Link>
              </div>
            ) : (
              items.map(({ product, quantity }) => {
                const isVeg = product.category_id === 'veg';
                const lineTotal = product.price_in_paise * quantity;

                return (
                  <div
                    key={product.id}
                    className="flex gap-3 bg-pickle-warmWhite p-3 rounded-xl border border-pickle-cream/80 shadow-xs"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={isVeg ? 'veg-badge' : 'non-veg-badge'} />
                            <h4 className="font-serif text-xs font-bold text-pickle-darkText line-clamp-1">
                              {product.name}
                            </h4>
                          </div>
                          <span className="text-[11px] text-gray-500">
                            {product.package_weight_grams} g pack • {formatPrice(product.price_in_paise)} each
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Stepper & Line Total */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-gray-200 rounded-md bg-white">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1 hover:bg-gray-100 text-gray-600 rounded-l"
                            aria-label="Decrease"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1 hover:bg-gray-100 text-gray-600 rounded-r"
                            aria-label="Increase"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-serif font-bold text-sm text-pickle-red">
                          {formatPrice(lineTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-gray-100 shadow-lg space-y-3">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal ({totalCount} items)</span>
                  <span className="font-semibold text-gray-800">{formatPrice(subtotalPaise)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>
                    {deliveryFeePaise === 0 ? (
                      <span className="text-pickle-green font-bold uppercase text-[10px]">FREE</span>
                    ) : (
                      formatPrice(deliveryFeePaise)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-pickle-darkText pt-2 border-t border-gray-100">
                  <span>Grand Total</span>
                  <span className="text-pickle-red text-base font-serif">
                    {formatPrice(totalPaise)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full text-center border border-pickle-red text-pickle-red hover:bg-pickle-cream text-xs font-bold py-2.5 rounded-xl transition-colors"
                >
                  View Full Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-1.5 bg-pickle-red hover:bg-pickle-darkred text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-md active:scale-95"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-[10px] text-center text-gray-400">
                🔒 Safe & Secure Checkout • Cash on Delivery / UPI Available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
