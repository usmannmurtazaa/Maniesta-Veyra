import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { CustomOrderStatus } from '@prisma/client';
import { z } from 'zod';

const statusSchema = z.object({ status: z.nativeEnum(CustomOrderStatus), notes: z.string().optional() });

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin();
    const body = await request.json();
    const { status, notes } = statusSchema.parse(body);
    const tracking = await adminService.updateCustomOrderStatus(params.id, status, notes, session.user.id);
    return NextResponse.json({ data: tracking });
  } catch (error: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to update status' } }, { status: 500 });
  }
}