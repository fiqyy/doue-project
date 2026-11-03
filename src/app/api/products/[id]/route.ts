import { NextRequest, NextResponse } from 'next/server';
import { getProductById, saveProduct, deleteProduct } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // CRITICAL FIX: Added await here so the database write completes
    const updated = await saveProduct({ ...body, id });

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // CRITICAL FIX: Added await here so the delete operation completes
    const deleted = await deleteProduct(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Product not found or already deleted' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}