import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { CustomOrderStatus } from '@prisma/client';
import { z } from 'zod';

const statusSchema = z.object({
  status: z.nativeEnum(CustomOrderStatus),
  notes: z.string().optional(),
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { status, notes } = statusSchema.parse(body);
    const tracking = await adminService.updateCustomOrderStatus(
      id,
      status,
      notes,
      session.user.id
    );
    return NextResponse.json({ data: tracking });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input',
            details: error.issues,
          },
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to update status' } },
      { status: 500 }
    );
  }
}