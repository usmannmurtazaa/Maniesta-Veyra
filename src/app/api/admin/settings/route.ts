import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';

export async function GET() {
  try {
    await requireAdmin();
    const settings = await adminService.getSettings();
    return NextResponse.json({ data: settings });
  } catch (error: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch settings' } }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { key, value, description } = body;
    const setting = await adminService.updateSetting(key, value, description);
    return NextResponse.json({ data: setting });
  } catch (error: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to update setting' } }, { status: 500 });
  }
}