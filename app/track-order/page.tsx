'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  CheckCircle,
  Clock,
  ChefHat,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';

const STATUS_STEPS: OrderStatus[] = [
  'Pending Confirmation',
  'Confirmed',
  'Preparing',
  'Dispatched',
  'Delivered',
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || '';
  const initialPhone = searchParams.get('phone') || '';

  const [orderRef, setOrderRef] = useState(initialRef);
  const [phone, setPhone] = useState(initialPhone);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If query params are present, auto search
  useEffect(() => {
    if (initialRef && initialPhone) {
      handleTrack(initialRef, initialPhone);
    }
  }, [initialRef, initialPhone]);

  const handleTrack = async (r?: string, p?: string) => {
    const targetRef = r || orderRef;
    const targetPhone = p || phone;

    if (!targetRef.trim()) {
      setError('Please enter your Order Reference (e.g. PM-26123)');
      return;
    }
    if (!targetPhone.trim() || targetPhone.trim().length < 10) {
      setError('Please enter your 10-digit mobile number for verification');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/${targetRef.trim()}?phone=${encodeURIComponent(targetPhone.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Order not found. Please verify your reference and phone number.');
        setOrder(null);
      } else {
        setOrder(data.order);
      }
    } catch (err) {
      console.error('Tracking fetch error:', err);
      setError('Network error tracking order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (step: OrderStatus) => {
    if (!order) return 'upcoming';
    if (order.order_status === 'Cancelled') return 'cancelled';

    const currentIndex = STATUS_STEPS.indexOf(order.order_status);
    const stepIndex = STATUS_STEPS.indexOf(step);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-pickle-red">
          Live Order Status
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-pickle-darkText">
          Track Your Pickle Mart Order
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
          Enter your unique order reference and registered phone number to check current packing and delivery progress.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-pickle-cream">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrack();
          }}
          className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end"
        >
          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Order Reference Number
            </label>
            <input
              type="text"
              placeholder="e.g. PM-26849"
              value={orderRef}
              onChange={(e) => setOrderRef(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pickle-red/30 uppercase font-mono"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Registered Mobile Number
            </label>
            <input
              type="tel"
              placeholder="10-digit mobile"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pickle-red/30"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pickle-red hover:bg-pickle-darkred text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Checking...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Order</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3.5 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Tracking Results Card */}
      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-pickle-cream space-y-8 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <span className="text-xs text-gray-500 font-medium">Tracking Order:</span>
              <h2 className="font-serif text-2xl font-bold text-pickle-red">
                {order.order_reference}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Placed on {formatDate(order.created_at)}</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-gray-500 block">Total Amount:</span>
              <span className="font-serif text-2xl font-extrabold text-pickle-darkText">
                {formatPrice(order.total_in_paise)}
              </span>
              <span className="block text-xs text-green-700 font-semibold capitalize">
                {order.payment_method.toUpperCase()} • {order.payment_status}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          {order.order_status === 'Cancelled' ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-2">
              <XCircle className="w-10 h-10 text-red-500 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-red-800">This Order Has Been Cancelled</h3>
              <p className="text-xs text-red-600 max-w-md mx-auto">
                If you have questions regarding this cancellation or need to place a new order, please contact our support team.
              </p>
            </div>
          ) : (
            <div className="py-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-6 text-center sm:text-left">
                Fulfillment Milestones
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
                {STATUS_STEPS.map((step, idx) => {
                  const state = getStepStatus(step);
                  const isDone = state === 'completed';
                  const isCurrent = state === 'current';

                  return (
                    <div
                      key={step}
                      className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'border-pickle-red bg-pickle-cream/60 ring-2 ring-pickle-red shadow-sm'
                          : isDone
                          ? 'border-green-200 bg-green-50/50'
                          : 'border-gray-100 bg-gray-50 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold text-xs ${
                          isDone
                            ? 'bg-green-600 text-white'
                            : isCurrent
                            ? 'bg-pickle-red text-white animate-pulse'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>

                      <span
                        className={`text-xs font-bold leading-tight ${
                          isCurrent
                            ? 'text-pickle-red'
                            : isDone
                            ? 'text-green-800'
                            : 'text-gray-500'
                        }`}
                      >
                        {step}
                      </span>

                      {isCurrent && (
                        <span className="text-[10px] text-pickle-red font-semibold mt-1">
                          In Progress
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Order Details & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
            {/* Delivery address */}
            <div className="bg-pickle-warmWhite p-4 rounded-2xl border border-pickle-cream space-y-2 text-xs">
              <h4 className="font-bold text-pickle-darkText flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-pickle-red" />
                <span>Delivery Address</span>
              </h4>
              <p className="font-semibold text-pickle-darkText">{order.customer_name}</p>
              <p className="text-gray-600 leading-relaxed">
                {order.delivery_address},<br />
                {order.city} - {order.postal_code}
              </p>
              <p className="text-gray-500">Phone: +91 {order.customer_phone}</p>
            </div>

            {/* Items */}
            <div className="bg-pickle-warmWhite p-4 rounded-2xl border border-pickle-cream space-y-2 text-xs">
              <h4 className="font-bold text-pickle-darkText flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-pickle-yellow" />
                <span>Packs in this Order ({order.items.length})</span>
              </h4>
              <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {order.items.map((it) => (
                  <li key={it.id} className="flex justify-between items-center text-gray-700">
                    <span className="truncate pr-2">
                      {it.quantity} × {it.product_name_snapshot} ({it.package_weight_grams}g)
                    </span>
                    <span className="font-bold text-pickle-red shrink-0">
                      {formatPrice(it.line_total_in_paise)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">
          Loading order tracking...
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
