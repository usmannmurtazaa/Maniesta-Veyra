import { Prisma, PrintLocation } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';

export class CustomPricingService {
  async calculatePrice(input: {
    garmentId: string;
    printLocations: PrintLocation[];
    quantity: number;
    designSqInchesPerLocation?: Record<string, number>;
  }) {
    const { garmentId, printLocations, quantity, designSqInchesPerLocation = {} } = input;

    const garment = await prisma.garment.findUnique({
      where: { id: garmentId },
      include: {
        printPricings: {
          where: { isActive: true, location: { in: printLocations } },
        },
      },
    });
    if (!garment) throw new Error('Garment not found');

    const baseGarmentPrice = garment.basePrice;
    let printLocationCost = new Prisma.Decimal(0);

    for (const location of printLocations) {
      const pricing = garment.printPricings.find((p) => p.location === location);
      if (pricing) {
        let cost = pricing.baseCost;
        const sqInches = designSqInchesPerLocation[location] || 0;
        if (
          pricing.largePrintThresholdSqIn &&
          sqInches > Number(pricing.largePrintThresholdSqIn) &&
          pricing.largePrintSurcharge
        ) {
          cost = cost.add(pricing.largePrintSurcharge);
        }
        printLocationCost = printLocationCost.add(cost);
      }
    }

    const unitBase = baseGarmentPrice.add(printLocationCost);

    // Quantity discount: check tiers
    let discountPercent = 0;
    const allTiers = garment.printPricings.flatMap((p) => p.quantityDiscountTiers as any[]);
    const uniqueTiers = allTiers.filter(
      (tier, index, self) => self.findIndex((t) => t.minQuantity === tier.minQuantity) === index
    );
    const applicableTier = uniqueTiers
      .filter((tier) => quantity >= tier.minQuantity)
      .sort((a, b) => b.minQuantity - a.minQuantity)[0];
    if (applicableTier) discountPercent = applicableTier.discountPercent || 0;

    const discountMultiplier = new Prisma.Decimal(1).sub(new Prisma.Decimal(discountPercent).div(100));
    const unitPriceAfterDiscount = unitBase.mul(discountMultiplier);

    const unitPrice = unitPriceAfterDiscount;
    const totalPrice = unitPrice.mul(quantity);

    return {
      unitPrice,
      totalPrice,
      baseGarmentPrice,
      printLocationCost,
      quantityDiscountPercent: discountPercent,
      currency: 'PKR',
    };
  }
}

export const customPricingService = new CustomPricingService();