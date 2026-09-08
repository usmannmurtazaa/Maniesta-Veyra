import { NextRequest, NextResponse } from 'next/server';
import { searchService } from '@/lib/services/search-service';
import { searchQuerySchema } from '@/lib/validation/search.schema';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = searchQuerySchema.parse(searchParams);
    const result = await searchService.search(query);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid search parameters', details: error.issues } },
        { status: 400 }
      );
    }
    console.error('Error searching products:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Search failed' } },
      { status: 500 }
    );
  }
}