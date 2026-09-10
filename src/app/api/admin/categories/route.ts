import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';

export async function GET() {
  try {
    await requireAdmin();
    const categories = await adminService.listCategories();
    return NextResponse.json({ data: categories });
  } catch {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch categories' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const category = await adminService.createCategory(body);
    return NextResponse.json({ data: category }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create category' } },
      { status: 500 }
    );
  }
}