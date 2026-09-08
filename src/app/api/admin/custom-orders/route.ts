import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { CustomOrderStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const page = Number(request.nextUrl.searchParams.get('page') || 1);
    const limit = Number(request.nextUrl.searchParams.get('limit') || 20);
    const status = request.nextUrl.searchParams.get('status') as CustomOrderStatus | undefined;
    const result = await adminService.listCustomOrders(page, limit, status);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch custom orders' } }, { status: 500 });
  }
}