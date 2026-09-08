import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { OrderStatus } from '@prisma/client';
import { z } from 'zod';

const statusSchema = z.object({ status: z.nativeEnum(OrderStatus), notes: z.string().optional() });

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { status, notes } = statusSchema.parse(body);
    const order = await adminService.updateOrderStatus(params.id, status, notes);
    return NextResponse.json({ data: order });
  } catch (error: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to update status' } }, { status: 500 });
  }
}