import { describe, it, expect } from 'vitest';
import { CustomPricingService } from '@/lib/services/custom-pricing-service';
import { Prisma } from '@prisma/client';

// We test the calculation logic by mocking the service methods that query DB.
// Since CustomPricingService uses Prisma directly, we can mock the prisma client.

vi.mock('@/lib/db/prisma', () => ({
  prisma: {
    garment: {
      findUnique: vi.fn(),
    },
  },
}));

describe('CustomPricingService', () => {
  it('calculates base price + print location costs', async () => {
    const { prisma } = await import('@/lib/db/prisma');
    (prisma.garment.findUnique as any).mockResolvedValue({
      basePrice: new Prisma.Decimal(2000),
      printPricings: [
        { location: 'FRONT', baseCost: new Prisma.Decimal(500), largePrintThresholdSqIn: null, largePrintSurcharge: new Prisma.Decimal(0), quantityDiscountTiers: [] },
      ],
    });

    const service = new CustomPricingService();
    const result = await service.calculatePrice({
      garmentId: 'g1',
      printLocations: ['FRONT'],
      quantity: 1,
    });

    expect(result.unitPrice.toNumber()).toBe(2500);
    expect(result.totalPrice.toNumber()).toBe(2500);
  });

  it('applies quantity discount tiers', async () => {
    const { prisma } = await import('@/lib/db/prisma');
    (prisma.garment.findUnique as any).mockResolvedValue({
      basePrice: new Prisma.Decimal(1000),
      printPricings: [
        { location: 'FRONT', baseCost: new Prisma.Decimal(0), largePrintThresholdSqIn: null, largePrintSurcharge: new Prisma.Decimal(0), quantityDiscountTiers: [{ minQuantity: 10, discountPercent: 10 }] },
      ],
    });

    const service = new CustomPricingService();
    const result = await service.calculatePrice({
      garmentId: 'g1',
      printLocations: ['FRONT'],
      quantity: 10,
    });

    expect(result.unitPrice.toNumber()).toBe(900); // 1000 * 0.9
    expect(result.totalPrice.toNumber()).toBe(9000);
  });

  it('adds large print surcharge when threshold exceeded', async () => {
    const { prisma } = await import('@/lib/db/prisma');
    (prisma.garment.findUnique as any).mockResolvedValue({
      basePrice: new Prisma.Decimal(2000),
      printPricings: [
        { location: 'FRONT', baseCost: new Prisma.Decimal(500), largePrintThresholdSqIn: new Prisma.Decimal(50), largePrintSurcharge: new Prisma.Decimal(200), quantityDiscountTiers: [] },
      ],
    });

    const service = new CustomPricingService();
    const result = await service.calculatePrice({
      garmentId: 'g1',
      printLocations: ['FRONT'],
      quantity: 1,
      designSqInchesPerLocation: { FRONT: 60 },
    });

    expect(result.unitPrice.toNumber()).toBe(2700); // 2000 + 500 + 200
  });
});