import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/guards';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const session = await requireAuth();
    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    });
    return NextResponse.json({ data: addresses });
  } catch {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch addresses' } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    const { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = body;

    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        fullName,
        phone,
        addressLine1,
        addressLine2: addressLine2 || null,
        city,
        state,
        postalCode,
        country: country || 'PK',
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json({ data: address }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create address' } },
      { status: 500 }
    );
  }
}