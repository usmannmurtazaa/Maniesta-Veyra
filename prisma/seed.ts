import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.couponUsage.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.customDesignAsset.deleteMany();
  await prisma.customDesign.deleteMany();
  await prisma.customOrderTracking.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productColor.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.printPricing.deleteMany();
  await prisma.garmentVariant.deleteMany();
  await prisma.garmentColor.deleteMany();
  await prisma.garmentSize.deleteMany();
  await prisma.garment.deleteMany();
  await prisma.address.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding categories...');
  const tshirtsCategory = await prisma.category.create({
    data: {
      name: 'T-Shirts',
      slug: 't-shirts',
      description: 'Premium t-shirts for every occasion',
      sortOrder: 1,
      metaTitle: 'T-Shirts | Maniesta Veyra',
      metaDescription: 'Shop premium t-shirts at Maniesta Veyra.',
    },
  });

  const shirtsCategory = await prisma.category.create({
    data: {
      name: 'Casual Shirts',
      slug: 'casual-shirts',
      description: 'Elegant casual shirts',
      sortOrder: 2,
    },
  });

  const hoodiesCategory = await prisma.category.create({
    data: {
      name: 'Hoodies',
      slug: 'hoodies',
      description: 'Comfortable hoodies',
      sortOrder: 3,
    },
  });

  const oversizedCategory = await prisma.category.create({
    data: {
      name: 'Oversized T-Shirts',
      slug: 'oversized-t-shirts',
      parentId: tshirtsCategory.id,
      sortOrder: 1,
    },
  });

  console.log('Seeding products...');
  const product1 = await prisma.product.create({
    data: {
      name: 'Classic Black T-Shirt',
      slug: 'classic-black-t-shirt',
      description: 'A timeless classic black t-shirt made from premium combed cotton.',
      basePrice: new Prisma.Decimal(2499),
      compareAtPrice: new Prisma.Decimal(2999),
      categoryId: tshirtsCategory.id,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      skuPrefix: 'TS-CB',
      tags: ['cotton', 'classic', 'black'],
      material: '100% Combed Cotton',
      careInstructions: 'Machine wash cold, tumble dry low.',
      metaTitle: 'Classic Black T-Shirt | Maniesta Veyra',
      metaDescription: 'Premium black t-shirt made from combed cotton.',
      colors: {
        create: [
          { name: 'Black', hexCode: '#1A1A2E', sortOrder: 1 },
          { name: 'White', hexCode: '#FFFFFF', sortOrder: 2 },
        ],
      },
      sizes: {
        create: [
          { label: 'S', sortOrder: 1 },
          { label: 'M', sortOrder: 2 },
          { label: 'L', sortOrder: 3 },
          { label: 'XL', sortOrder: 4 },
        ],
      },
    },
  });

  // Add variants for product1
  const blackColor = await prisma.productColor.findFirst({
    where: { productId: product1.id, name: 'Black' },
  });
  const whiteColor = await prisma.productColor.findFirst({
    where: { productId: product1.id, name: 'White' },
  });
  const sizes = await prisma.productSize.findMany({
    where: { productId: product1.id },
  });

  for (const color of [blackColor, whiteColor]) {
    for (const size of sizes) {
      await prisma.productVariant.create({
        data: {
          productId: product1.id,
          colorId: color!.id,
          sizeId: size.id,
          sku: `${product1.skuPrefix}-${color!.name.substring(0, 1)}-${size.label}`,
          price: product1.basePrice,
          stock: 50,
          lowStockThreshold: 5,
        },
      });
    }
  }

  // Product 2
  const product2 = await prisma.product.create({
    data: {
      name: 'Oversized Premium Tee',
      slug: 'oversized-premium-tee',
      description: 'Relaxed fit oversized tee with premium feel.',
      basePrice: new Prisma.Decimal(2999),
      categoryId: oversizedCategory.id,
      isFeatured: true,
      skuPrefix: 'TS-OV',
      tags: ['oversized', 'premium', 'streetwear'],
      material: 'Heavyweight Cotton',
      colors: {
        create: [{ name: 'Charcoal', hexCode: '#36454F' }, { name: 'Beige', hexCode: '#F5F5DC' }],
      },
      sizes: {
        create: [{ label: 'M' }, { label: 'L' }, { label: 'XL' }],
      },
    },
  });

  const charcoal = await prisma.productColor.findFirst({
    where: { productId: product2.id, name: 'Charcoal' },
  });
  const beige = await prisma.productColor.findFirst({
    where: { productId: product2.id, name: 'Beige' },
  });
  const sizes2 = await prisma.productSize.findMany({ where: { productId: product2.id } });
  for (const color of [charcoal, beige]) {
    for (const size of sizes2) {
      await prisma.productVariant.create({
        data: {
          productId: product2.id,
          colorId: color!.id,
          sizeId: size.id,
          sku: `${product2.skuPrefix}-${color!.name.substring(0, 1)}-${size.label}`,
          price: product2.basePrice,
          stock: 30,
        },
      });
    }
  }

  console.log('Seeding garments...');
  const tshirtGarment = await prisma.garment.create({
    data: {
      name: 'Classic T-Shirt',
      slug: 'classic-t-shirt',
      description: 'Standard fit t-shirt for custom printing.',
      basePrice: new Prisma.Decimal(2000),
      skuPrefix: 'CUST-TS',
      supportedPrintLocations: ['FRONT', 'BACK', 'LEFT_SLEEVE', 'RIGHT_SLEEVE'],
      printableAreaWidth: new Prisma.Decimal(12),
      printableAreaHeight: new Prisma.Decimal(16),
      sortOrder: 1,
      colors: {
        create: [
          { name: 'Black', hexCode: '#1A1A2E' },
          { name: 'White', hexCode: '#FFFFFF' },
          { name: 'Navy', hexCode: '#000080' },
        ],
      },
      sizes: {
        create: [
          { label: 'S' },
          { label: 'M' },
          { label: 'L' },
          { label: 'XL' },
        ],
      },
    },
  });

  // Garment variants
  const garmentColors = await prisma.garmentColor.findMany({ where: { garmentId: tshirtGarment.id } });
  const garmentSizes = await prisma.garmentSize.findMany({ where: { garmentId: tshirtGarment.id } });
  for (const color of garmentColors) {
    for (const size of garmentSizes) {
      await prisma.garmentVariant.create({
        data: {
          garmentId: tshirtGarment.id,
          colorId: color.id,
          sizeId: size.id,
          sku: `${tshirtGarment.skuPrefix}-${color.name.substring(0, 1)}-${size.label}`,
          stock: 100,
        },
      });
    }
  }

  // Print pricing
  await prisma.printPricing.createMany({
    data: [
      { garmentId: tshirtGarment.id, location: 'FRONT', baseCost: 500 },
      { garmentId: tshirtGarment.id, location: 'BACK', baseCost: 700 },
      { garmentId: tshirtGarment.id, location: 'LEFT_SLEEVE', baseCost: 300 },
      { garmentId: tshirtGarment.id, location: 'RIGHT_SLEEVE', baseCost: 300 },
    ],
  });

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });