'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle,
  Truck,
  Package,
  Calendar,
  Phone,
  MapPin,
  MessageCircle,
  Printer,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';

export default function OrderConfirmationPage() {
  const params = useParams();
  const ref = params.ref as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      if (!ref) return;
      try {
        const res = await fetch(`/api/orders/${ref}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
        } else {
          setError(data.error || 'Unable to retrieve order details.');
        }
      } catch (err) {
        console.error('Failed to load order:', err);
        setError('Network error loading order confirmation.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [ref]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-500">
        <div className="w-12 h-12 border-4 border-pickle-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p>Loading your order confirmation...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h1 className="font-serif text-2xl font-bold text-pickle-darkText">Order Not Found</h1>
        <p className="text-xs text-gray-500">{error || 'Please check your order reference number.'}</p>
        <Link
          href="/"
          className="inline-block bg-pickle-red text-white text-xs font-bold px-6 py-2.5 rounded-full"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  // Generate WhatsApp order message
  const itemsText = order.items
    .map((i) => `• ${i.product_name_snapshot} (${i.package_weight_grams}g) x ${i.quantity} = ${formatPrice(i.line_total_in_paise)}`)
    .join('%0A');

  const whatsappMessage = `*New Pickle Mart Order Confirmation*%0A*Order Reference:* ${order.order_reference}%0A*Customer:* ${order.customer_name}%0A*Phone:* ${order.customer_phone}%0A*Delivery Address:* ${order.delivery_address}, ${order.city} - ${order.postal_code}%0A%0A*Items Ordered:*%0A${itemsText}%0A%0A*Total Amount:* ${formatPrice(order.total_in_paise)}%0A*Payment Method:* ${order.payment_method.toUpperCase()}%0A*Status:* ${order.order_status}%0A%0AThank you for ordering Grandma's authentic pickles!`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Success Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-green-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl text-center space-y-3">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <span className="text-xs font-bold tracking-wider uppercase bg-white/20 px-3 py-1 rounded-full">
          Order Successfully Placed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
          Thank You, {order.customer_name}!
        </h1>
        <p className="text-sm text-green-100 max-w-lg mx-auto leading-relaxed">
          Your order has been recorded and received by Grandma&apos;s kitchen. We are preparing your fresh pickles!
        </p>
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-pickle-cream space-y-6">
        {/* Header Details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
          <div>
            <span className="text-xs text-gray-500 font-medium">Order Reference Number:</span>
            <div className="font-serif text-2xl font-extrabold text-pickle-red tracking-wide">
              {order.order_reference}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Placed on {formatDate(order.created_at)}</p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-pickle-yellow/30 text-pickle-darkred border border-pickle-yellow">
              <Package className="w-3.5 h-3.5" />
              <span>Status: {order.order_status}</span>
            </span>
            <button
              onClick={() => window.print()}
              className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Customer & Delivery Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-pickle-warmWhite p-5 rounded-2xl border border-pickle-cream/80 text-xs text-gray-700">
          <div className="space-y-2">
            <h4 className="font-bold text-pickle-darkText uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-pickle-red" />
              <span>Delivery Details</span>
            </h4>
            <p className="font-semibold text-sm text-pickle-darkText">{order.customer_name}</p>
            <p className="text-gray-600 leading-relaxed">
              {order.delivery_address},<br />
              {order.city} - {order.postal_code}
            </p>
            <p className="flex items-center gap-1 text-gray-500">
              <Phone className="w-3.5 h-3.5" />
              <span>+91 {order.customer_phone}</span>
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-pickle-darkText uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-pickle-red" />
              <span>Payment & Fulfillment</span>
            </h4>
            <p>
              <strong>Payment Method:</strong>{' '}
              <span className="capitalize">{order.payment_method.replace('_', ' ')}</span>
            </p>
            <p>
              <strong>Payment Status:</strong>{' '}
              <span className="capitalize font-semibold text-green-700">{order.payment_status}</span>
            </p>
            {order.order_notes && (
              <p>
                <strong>Delivery Notes:</strong> <em>{order.order_notes}</em>
              </p>
            )}
          </div>
        </div>

        {/* Ordered Items Table */}
        <div className="space-y-3">
          <h3 className="font-serif text-lg font-bold text-pickle-darkText">Ordered Pickles</h3>
          <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
            {order.items.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-pickle-darkText text-sm">
                    {item.product_name_snapshot}
                  </h4>
                  <p className="text-gray-500">
                    Standard Pack: {item.package_weight_grams} g • Quantity: {item.quantity} × {formatPrice(item.unit_price_in_paise)}
                  </p>
                </div>
                <span className="font-serif font-extrabold text-sm text-pickle-red">
                  {formatPrice(item.line_total_in_paise)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Calculations */}
        <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-600 max-w-xs ml-auto">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-pickle-darkText">{formatPrice(order.subtotal_in_paise)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>
              {order.delivery_fee_in_paise === 0 ? (
                <span className="text-pickle-green font-bold">FREE</span>
              ) : (
                formatPrice(order.delivery_fee_in_paise)
              )}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold text-pickle-darkText pt-2 border-t border-gray-100">
            <span>Total Paid/Payable</span>
            <span className="font-serif text-xl font-extrabold text-pickle-red">
              {formatPrice(order.total_in_paise)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <a
            href={`https://wa.me/919876543210?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-md transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Details to WhatsApp Store</span>
          </a>

          <div className="flex items-center gap-3">
            <Link
              href={`/track-order?ref=${order.order_reference}&phone=${order.customer_phone}`}
              className="inline-flex items-center gap-2 bg-pickle-red hover:bg-pickle-darkred text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-md transition-colors"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Status</span>
            </Link>

            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 border border-pickle-red text-pickle-red hover:bg-pickle-cream px-5 py-3 rounded-2xl text-xs font-bold transition-colors"
            >
              <span>Back to Store</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
