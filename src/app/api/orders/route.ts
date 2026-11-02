import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/db';
import { dispatchOrderNotifications } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    // Added await here
    const orders = await getOrders(status, search);
    return NextResponse.json({ success: true, orders, count: orders.length });
  } catch (err: any) {
    console.error('Error in GET /api/orders:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.customer || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Customer details and order items are required.' },
        { status: 400 }
      );
    }

    // Added await here
    const newOrder = await createOrder(body);

    // Dispatch emails (already async)
    const emailResult = await dispatchOrderNotifications(newOrder);

    return NextResponse.json(
      {
        success: true,
        order: newOrder,
        emailStatus: emailResult
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error in POST /api/orders:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}