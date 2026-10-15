'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Store,
  ArrowRight,
  AlertCircle,
  MessageCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { PaymentMethod } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalPaise, deliveryFeePaise, totalPaise, totalCount, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    delivery_address: '',
    city: '',
    postal_code: '',
    order_notes: '',
    payment_method: 'cod' as PaymentMethod,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-pickle-cream text-pickle-red flex items-center justify-center text-3xl mx-auto">
          🏺
        </div>
        <h1 className="font-serif text-2xl font-bold text-pickle-darkText">Your cart is empty</h1>
        <p className="text-xs text-gray-500">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/catalog"
          className="inline-block bg-pickle-red text-white text-xs font-bold px-6 py-2.5 rounded-full"
        >
          Explore Pickles
        </Link>
      </div>
    );
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.customer_name.trim()) {
      errs.customer_name = 'Please enter your full name';
    }
    const cleanPhone = formData.customer_phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.customer_phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.delivery_address.trim()) {
      errs.delivery_address = 'Please enter complete delivery address';
    }
    if (!formData.city.trim()) {
      errs.city = 'Please enter your city / locality';
    }
    const cleanPin = formData.postal_code.replace(/\D/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      errs.postal_code = 'Please enter a valid 6-digit postal PIN code';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        delivery_address: formData.delivery_address,
        city: formData.city,
        postal_code: formData.postal_code,
        order_notes: formData.order_notes,
        payment_method: formData.payment_method,
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(data.error || 'Failed to submit order. Please try again.');
        setSubmitting(false);
        return;
      }

      // Successful order creation
      const createdOrder = data.order;
      clearCart();
      router.push(`/order-confirmation/${createdOrder.order_reference}`);
    } catch (err) {
      console.error('Order submission error:', err);
      setServerError('A network error occurred. Please check your connection and try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="font-serif text-3xl font-extrabold text-pickle-darkText">
          Complete Your Order
        </h1>
        <p className="text-xs text-gray-500">
          Enter your delivery details and choose your preferred payment option.
        </p>
      </div>

      {serverError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-800">Order Submission Error</h4>
            <p className="text-xs text-red-700 mt-0.5">{serverError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Customer & Delivery Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-pickle-cream space-y-4">
            <h2 className="font-serif text-xl font-bold text-pickle-darkText border-b border-gray-100 pb-3 flex items-center gap-2">
              <Truck className="w-5 h-5 text-pickle-red" />
              <span>1. Contact & Delivery Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Kumar"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                    errors.customer_name ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-pickle-red/30`}
                />
                {errors.customer_name && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.customer_name}</p>
                )}
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mobile Number (for delivery updates) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  maxLength={10}
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                    errors.customer_phone ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-pickle-red/30`}
                />
                {errors.customer_phone && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.customer_phone}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Complete Street Address <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="House/Flat No., Street, Landmark"
                value={formData.delivery_address}
                onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                  errors.delivery_address ? 'border-red-500 bg-red-50' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-pickle-red/30`}
              />
              {errors.delivery_address && (
                <p className="text-[11px] text-red-600 mt-1">{errors.delivery_address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* City */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  City / Locality <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hyderabad / Vijayawada / Chennai"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                    errors.city ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-pickle-red/30`}
                />
                {errors.city && <p className="text-[11px] text-red-600 mt-1">{errors.city}</p>}
              </div>

              {/* PIN code */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Postal PIN Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 500001"
                  maxLength={6}
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                    errors.postal_code ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-pickle-red/30`}
                />
                {errors.postal_code && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.postal_code}</p>
                )}
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Special Delivery Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Leave with security / Ring doorbell"
                value={formData.order_notes}
                onChange={(e) => setFormData({ ...formData, order_notes: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pickle-red/30"
              />
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-pickle-cream space-y-4">
            <h2 className="font-serif text-xl font-bold text-pickle-darkText border-b border-gray-100 pb-3 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-pickle-red" />
              <span>2. Select Payment Method</span>
            </h2>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.payment_method === 'cod'
                    ? 'border-pickle-red bg-pickle-cream/40 ring-1 ring-pickle-red'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="cod"
                  checked={formData.payment_method === 'cod'}
                  onChange={() => setFormData({ ...formData, payment_method: 'cod' })}
                  className="mt-1 text-pickle-red focus:ring-pickle-red"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-pickle-darkText">
                    <Banknote className="w-4 h-4 text-pickle-green" />
                    <span>Cash on Delivery (COD)</span>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">
                      Popular
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Pay in cash or UPI to the delivery executive upon receiving your pickle jars.
                  </p>
                </div>
              </label>

              {/* Online Payment / UPI */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.payment_method === 'online'
                    ? 'border-pickle-red bg-pickle-cream/40 ring-1 ring-pickle-red'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="online"
                  checked={formData.payment_method === 'online'}
                  onChange={() => setFormData({ ...formData, payment_method: 'online' })}
                  className="mt-1 text-pickle-red focus:ring-pickle-red"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-pickle-darkText">
                    <CreditCard className="w-4 h-4 text-pickle-red" />
                    <span>Instant Online Payment / UPI</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Pay securely using Google Pay, PhonePe, Paytm, UPI, Cards, or Net Banking.
                  </p>
                </div>
              </label>

              {/* Pay at Store */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.payment_method === 'pay_at_store'
                    ? 'border-pickle-red bg-pickle-cream/40 ring-1 ring-pickle-red'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="pay_at_store"
                  checked={formData.payment_method === 'pay_at_store'}
                  onChange={() => setFormData({ ...formData, payment_method: 'pay_at_store' })}
                  className="mt-1 text-pickle-red focus:ring-pickle-red"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-pickle-darkText">
                    <Store className="w-4 h-4 text-pickle-yellow" />
                    <span>Pay at Store / Self Pickup</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Pick up your packed order directly from our traditional kitchen counter and pay on collection.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-pickle-red hover:bg-pickle-darkred text-white font-bold text-base py-4 rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-60"
          >
            {submitting ? (
              <span>Confirming Order...</span>
            ) : (
              <>
                <Lock className="w-4 h-4 text-pickle-yellow" />
                <span>Place Order • {formatPrice(totalPaise)}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Order Summary on Right */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-pickle-cream space-y-6">
          <h2 className="font-serif text-xl font-bold text-pickle-darkText border-b border-gray-100 pb-3">
            Review Order ({totalCount} items)
          </h2>

          {/* Items Preview */}
          <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center gap-3 text-xs">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
                  <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-pickle-darkText truncate">{product.name}</p>
                  <p className="text-gray-500">
                    {quantity} × {formatPrice(product.price_in_paise)} (250g)
                  </p>
                </div>
                <span className="font-serif font-bold text-pickle-red">
                  {formatPrice(product.price_in_paise * quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-pickle-darkText">{formatPrice(subtotalPaise)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>
                {deliveryFeePaise === 0 ? (
                  <span className="text-pickle-green font-bold uppercase text-[11px]">FREE</span>
                ) : (
                  formatPrice(deliveryFeePaise)
                )}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-pickle-darkText pt-2 border-t border-gray-100">
              <span>Total Payable</span>
              <span className="font-serif text-xl text-pickle-red font-extrabold">
                {formatPrice(totalPaise)}
              </span>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="bg-pickle-cream/50 rounded-2xl p-4 border border-pickle-cream text-xs text-pickle-darkText space-y-2">
            <div className="flex items-center gap-2 font-bold text-pickle-red">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Pickle Mart Guarantee</span>
            </div>
            <p className="text-gray-600 text-[11px] leading-relaxed">
              Every jar is freshly prepared with cold-pressed oils and Grandma’s heirloom recipes. Prices verified directly by our secure server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
