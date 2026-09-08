import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  categoryId: z.string(),
  basePrice: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  skuPrefix: z.string().min(1),
  tags: z.array(z.string()).default([]),
  material: z.string().optional(),
  careInstructions: z.string().optional(),
  colors: z.array(z.object({ name: z.string(), hexCode: z.string(), sortOrder: z.number().optional() })),
  sizes: z.array(z.object({ label: z.string(), sortOrder: z.number().optional() })),
  images: z.array(z.object({ url: z.string(), altText: z.string().optional(), isPrimary: z.boolean().optional(), sortOrder: z.number().optional() })),
});

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 20);
    const search = searchParams.get('search') || undefined;
    const result = await adminService.listProducts(page, limit, search);
    return NextResponse.json(result);
  } catch (error: any) {
    if (error.code === 'UNAUTHORIZED' || error.code === 'FORBIDDEN') {
      return NextResponse.json({ error: { code: error.code, message: error.message } }, { status: error.statusCode });
    }
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch products' } }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const input = createProductSchema.parse(body);
    const product = await adminService.createProduct(input);
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues } }, { status: 400 });
    }
    if (error.code === 'UNAUTHORIZED' || error.code === 'FORBIDDEN') {
      return NextResponse.json({ error: { code: error.code, message: error.message } }, { status: error.statusCode });
    }
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to create product' } }, { status: 500 });
  }
}