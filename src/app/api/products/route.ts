import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/lib/services/product-service';
import { productQuerySchema } from '@/lib/validation/product.schema';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = productQuerySchema.parse(searchParams);
    const result = await productService.getProducts(query);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid query parameters', details: error.issues } },
        { status: 400 }
      );
    }
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch products' } },
      { status: 500 }
    );
  }
}