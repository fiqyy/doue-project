import { NextRequest, NextResponse } from 'next/server';
import { getEmailNotifications, getOrderById } from '@/lib/db';
import { dispatchOrderNotifications, generateOrderEmailHtml } from '@/lib/email';

export async function GET() {
  try {
    const emails = getEmailNotifications();
    return NextResponse.json({ success: true, emails, count: emails.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, action, recipientType } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID required' }, { status: 400 });
    }

    const order = getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (action === 'preview') {
      const html = generateOrderEmailHtml(order, recipientType || 'admin');
      return NextResponse.json({ success: true, html });
    }

    if (action === 'resend') {
      const res = await dispatchOrderNotifications(order);
      return NextResponse.json({
        success: true,
        message: `Notification resent for order ${order.orderNumber}`,
        result: res
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
