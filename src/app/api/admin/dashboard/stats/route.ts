import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';

export async function GET() {
  try {
    await requireAdmin();
    const stats = await adminService.getDashboardStats();
    return NextResponse.json({ data: stats });
  } catch (error: any) {
    if (error.code === 'UNAUTHORIZED' || error.code === 'FORBIDDEN') {
      return NextResponse.json({ error: { code: error.code, message: error.message } }, { status: error.statusCode });
    }
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch stats' } }, { status: 500 });
  }
}