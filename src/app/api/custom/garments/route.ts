import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

/**
 * Public garment catalog for the customizer.
 *
 * This endpoint is read-only and safe to cache: garments change rarely
 * (via admin panel). A short public cache keeps the customizer fast
 * without serving stale data for long.
 *
 * Rate limiting is intentionally NOT applied here — it's a public GET
 * with a small response, and legitimate clients call it once per page
 * load. If scraping becomes an issue, we can add a limiter then.
 */
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
          orderBy: { location: 'asc' },
        },
        // Stock per color × size so the UI can gray out unavailable options
        variants: {
          where: { isActive: true },
          select: {
            id: true,
            sku: true,
            stock: true,
            colorId: true,
            sizeId: true,
          },
        },
      },
    });

    return NextResponse.json(
      { data: garments },
      {
        headers: {
          // Public CDN cache for 5 minutes; serve stale for up to 1 hour
          // while revalidating in the background.
          'Cache-Control':
            'public, max-age=300, s-maxage=300, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error) {
    console.error('[custom/garments] query failed:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch garments',
        },
      },
      { status: 500 }
    );
  }
}