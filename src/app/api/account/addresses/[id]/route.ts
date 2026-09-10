import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/guards';
import { prisma } from '@/lib/db/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== session.user.id) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Not your address' } },
        { status: 403 }
      );
    }

    await prisma.address.delete({ where: { id } });
    return NextResponse.json({ data: { success: true } });
  } catch {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to delete address' } },
      { status: 500 }
    );
  }
}