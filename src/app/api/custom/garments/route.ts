import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const garments = await prisma.garment.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        colors: { orderBy: { sortOrder: 'asc' } },
        sizes: { orderBy: { sortOrder: 'asc' } },
        printPricings: {
          where: { isActive: true },
        },
      },
    });
    return NextResponse.json({ data: garments });
  } catch (error) {
    console.error('Error fetching garments:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch garments' } },
      { status: 500 }
    );
  }
}