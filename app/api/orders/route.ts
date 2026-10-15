import { NextResponse } from 'next/server';
import { getOrders, createOrder, getProductById } from '@/lib/db';
import { generateOrderReference } from '@/lib/utils';
import { Order, OrderItem } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminPass = process.env.ADMIN_SECRET || 'admin123';
    if (!authHeader || authHeader !== `Bearer ${adminPass}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized administrative operation' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const orders = getOrders({ status, search });
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_phone,
      delivery_address,
      city,
      postal_code,
      order_notes,
      payment_method,
      items, // array of { product_id, quantity }
    } = body;

    // Field validation
    if (!customer_name?.trim()) {
      return NextResponse.json({ success: false, error: 'Customer name is required' }, { status: 400 });
    }
    if (!customer_phone?.trim() || customer_phone.trim().length < 10) {
      return NextResponse.json({ success: false, error: 'A valid 10-digit mobile number is required' }, { status: 400 });
    }
    if (!delivery_address?.trim()) {
      return NextResponse.json({ success: false, error: 'Delivery address is required' }, { status: 400 });
    }
    if (!city?.trim()) {
      return NextResponse.json({ success: false, error: 'City or locality is required' }, { status: 400 });
    }
    if (!postal_code?.trim() || postal_code.trim().length < 6) {
      return NextResponse.json({ success: false, error: 'A valid 6-digit postal code is required' }, { status: 400 });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Your cart is empty' }, { status: 400 });
    }

    const orderId = `ord-${Date.now()}`;
    const orderReference = generateOrderReference();

    // SERVER-SIDE CALCULATION: Recalculate each item and price using verified database records
    let calculatedSubtotalPaise = 0;
    const validatedOrderItems: OrderItem[] = [];

    for (const item of items) {
      const product = getProductById(item.product_id);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product with ID "${item.product_id}" is no longer available` },
          { status: 400 }
        );
      }
      if (!product.is_available) {
        return NextResponse.json(
          { success: false, error: `Product "${product.name}" is currently out of stock` },
          { status: 400 }
        );
      }

      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
      const lineTotal = product.price_in_paise * quantity;
      calculatedSubtotalPaise += lineTotal;

      validatedOrderItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        order_id: orderId,
        product_id: product.id,
        product_name_snapshot: product.name,
        unit_price_in_paise: product.price_in_paise,
        package_weight_grams: product.package_weight_grams || 250,
        quantity,
        line_total_in_paise: lineTotal,
      });
    }

    // Server-side delivery fee calculation (free above ₹500, else ₹50)
    const FREE_THRESHOLD = 50000; // 500.00
    const STANDARD_FEE = 5000; // 50.00
    const deliveryFeePaise = calculatedSubtotalPaise >= FREE_THRESHOLD ? 0 : STANDARD_FEE;
    const totalPaise = calculatedSubtotalPaise + deliveryFeePaise;

    const newOrder: Order = {
      id: orderId,
      order_reference: orderReference,
      customer_name: customer_name.trim(),
      customer_phone: customer_phone.trim(),
      delivery_address: delivery_address.trim(),
      city: city.trim(),
      postal_code: postal_code.trim(),
      order_notes: order_notes?.trim() || '',
      subtotal_in_paise: calculatedSubtotalPaise,
      delivery_fee_in_paise: deliveryFeePaise,
      discount_in_paise: 0,
      total_in_paise: totalPaise,
      payment_method: payment_method || 'cod',
      payment_status: payment_method === 'online' ? 'paid' : 'pending',
      order_status: 'Confirmed', // Orders placed are immediately confirmed and enter fulfillment pipeline
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: validatedOrderItems,
    };

    const savedOrder = createOrder(newOrder);

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: savedOrder,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, error: 'Internal server error while processing order' }, { status: 500 });
  }
}
