import { NextResponse } from 'next/server';
import { getOrderById, getOrderByReference, updateOrderStatus, updatePaymentStatus } from '@/lib/db';
import { OrderStatus, PaymentStatus } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const authHeader = request.headers.get('authorization');
    const adminPass = process.env.ADMIN_SECRET || 'admin123';
    const isAdmin = authHeader === `Bearer ${adminPass}`;

    // Can lookup by ID or order_reference
    let order = getOrderById(params.id);
    if (!order) {
      order = getOrderByReference(params.id);
    }

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Security check: if not admin, must match phone number (or phone not required if accessing immediately after checkout via order ref)
    if (!isAdmin && phone) {
      const sanitizedReqPhone = phone.replace(/\D/g, '').slice(-10);
      const sanitizedOrderPhone = order.customer_phone.replace(/\D/g, '').slice(-10);
      if (sanitizedReqPhone !== sanitizedOrderPhone) {
        return NextResponse.json({ success: false, error: 'Phone number does not match this order reference' }, { status: 403 });
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminPass = process.env.ADMIN_SECRET || 'admin123';
    if (!authHeader || authHeader !== `Bearer ${adminPass}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized administrative operation' }, { status: 401 });
    }

    const body = await request.json();
    const { order_status, payment_status } = body;

    let updated = null;
    if (order_status) {
      updated = updateOrderStatus(params.id, order_status as OrderStatus);
    }
    if (payment_status) {
      updated = updatePaymentStatus(params.id, payment_status as PaymentStatus);
    }

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}
