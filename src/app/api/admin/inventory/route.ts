import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const page = Number(request.nextUrl.searchParams.get('page') || 1);
    const limit = Number(request.nextUrl.searchParams.get('limit') || 20);
    const lowStockOnly = request.nextUrl.searchParams.get('lowStockOnly') === 'true';
    const result = await adminService.listInventory(page, limit, lowStockOnly);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch inventory' } },
      { status: 500 }
    );
  }
}