import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/lib/services/product-service';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = await params;
    const product = await productService.getProductBySlug(slug);
    if (!product) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Product not found' } },
        { status: 404 }
      );
    }
    return NextResponse.json({ data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch product' } },
      { status: 500 }
    );
  }
}