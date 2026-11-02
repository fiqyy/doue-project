import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await getOrderById(params.id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order reference not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, trackingNumber, carrier } = body;

    if (!status) {
      return NextResponse.json({ success: false, error: 'Status is required' }, { status: 400 });
    }

    const updated = await updateOrderStatus(params.id, status, trackingNumber, carrier);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order: updated,
      message: `Order ${updated.orderNumber} status updated to ${status}`
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}