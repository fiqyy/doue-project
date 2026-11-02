import { NextRequest, NextResponse } from 'next/server';
import { getProducts, saveProduct } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const products = getProducts(category, search);
    return NextResponse.json({ success: true, products, count: products.length });
  } catch (err: any) {
    console.error('Error in GET /api/products:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, error: 'Name and price are required fields.' },
        { status: 400 }
      );
    }

    const created = saveProduct(body);
    return NextResponse.json({ success: true, product: created }, { status: 201 });
  } catch (err: any) {
    console.error('Error in POST /api/products:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
