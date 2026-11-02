import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/db';
import { dispatchOrderNotifications } from '@/lib/email';
import { Order } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const orders = getOrders(status, search);
    return NextResponse.json({ success: true, orders, count: orders.length });
  } catch (err: any) {
    console.error('Error in GET /api/orders:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.customer || !body.customer.email || !body.customer.firstName) {
      return NextResponse.json(
        { success: false, error: 'Customer name and email are required.' },
        { status: 400 }
      );
    }

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart must contain at least one item.' },
        { status: 400 }
      );
    }

    if (!body.shippingAddress || !body.shippingAddress.address || !body.shippingAddress.city) {
      return NextResponse.json(
        { success: false, error: 'Complete shipping address is required.' },
        { status: 400 }
      );
    }

    // Prepare order input
    const orderInput: Omit<Order, 'id' | 'orderNumber' | 'createdAt'> = {
      customer: {
        firstName: body.customer.firstName.trim(),
        lastName: body.customer.lastName ? body.customer.lastName.trim() : '',
        email: body.customer.email.trim().toLowerCase(),
        phone: body.customer.phone ? body.customer.phone.trim() : ''
      },
      shippingAddress: {
        address: body.shippingAddress.address.trim(),
        apartment: body.shippingAddress.apartment || '',
        city: body.shippingAddress.city.trim(),
        state: body.shippingAddress.state || '',
        postalCode: body.shippingAddress.postalCode.trim(),
        country: body.shippingAddress.country.trim()
      },
      items: body.items,
      subtotal: Number(body.subtotal) || 0,
      discount: Number(body.discount) || 0,
      discountCode: body.discountCode || undefined,
      shippingFee: Number(body.shippingFee) || 0,
      shippingMethod: body.shippingMethod || 'express_courier',
      tax: Number(body.tax) || 0,
      total: Number(body.total) || 0,
      status: 'pending',
      paymentStatus: 'paid', // Simulated instant authorization
      notes: body.notes || '',
      adminEmailNotified: true,
      customerEmailNotified: true,
      giftPackaging: !!body.giftPackaging
    };

    // Save order in database & decrement inventory
    const newOrder = createOrder(orderInput);

    // Dispatch email notifications asynchronously
    const notificationResult = await dispatchOrderNotifications(newOrder);

    return NextResponse.json(
      {
        success: true,
        order: newOrder,
        notification: notificationResult,
        message: 'Order placed successfully. Admin and customer notified.'
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error in POST /api/orders:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
