import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { ReviewStatus } from '@prisma/client';
import { z } from 'zod';

const statusSchema = z.object({ status: z.nativeEnum(ReviewStatus) });

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { status } = statusSchema.parse(body);
    const review = await adminService.updateReviewStatus(params.id, status);
    return NextResponse.json({ data: review });
  } catch (error: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to update review' } }, { status: 500 });
  }
}