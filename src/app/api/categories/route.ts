import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from '@/lib/services/category-service';
import { categoryQuerySchema } from '@/lib/validation/category.schema';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = categoryQuerySchema.parse(searchParams);
    const categories = await categoryService.getCategories(query);
    return NextResponse.json({ data: categories });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid query parameters', details: error.issues } },
        { status: 400 }
      );
    }
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch categories' } },
      { status: 500 }
    );
  }
}