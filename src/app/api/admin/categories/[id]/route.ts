import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const categoryUpdateSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  parentId: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const input = categoryUpdateSchema.parse(body);
    const category = await prisma.category.update({
      where: { id },
      data: input,
    });
    return NextResponse.json({ data: category });
  } catch {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to update category' } },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ data: { success: true } });
  } catch {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to delete category' } },
      { status: 500 }
    );
  }
}