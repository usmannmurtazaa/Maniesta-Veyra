import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const days = Number(request.nextUrl.searchParams.get('days') || 30);
    const analytics = await adminService.getSalesAnalytics(days);
    return NextResponse.json({ data: analytics });
  } catch (error: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch analytics' } }, { status: 500 });
  }
}