import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface ColorSeed {
  name: string;
  hexCode: string;
}

interface ProductSeed {
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  compareAtPrice?: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  tags: string[];
  material: string;
  careInstructions: string;
  skuPrefix: string;
  colors: ColorSeed[];
  sizes: string[];
  stockPerVariant: number;
}

const CARE =
  'Machine wash cold with similar colors. Do not bleach. Tumble dry low. Warm iron if needed.';
const MATERIAL = '100% Combed Cotton, 220 GSM';
const SIZES_STANDARD = ['S', 'M', 'L', 'XL'];
const SIZES_EXTENDED = ['S', 'M', 'L', 'XL', 'XXL'];

const C = {
  black: { name: 'Black', hexCode: '#1A1A2E' },
  offWhite: { name: 'Off White', hexCode: '#F5F5F0' },
  white: { name: 'White', hexCode: '#FAFAFA' },
  charcoal: { name: 'Charcoal', hexCode: '#36454F' },
  slate: { name: 'Slate Grey', hexCode: '#708090' },
  navy: { name: 'Navy', hexCode: '#1B2845' },
  sand: { name: 'Sand', hexCode: '#C2B280' },
  stone: { name: 'Stone', hexCode: '#A8A8A0' },
  beige: { name: 'Beige', hexCode: '#E8DCC4' },
  olive: { name: 'Olive', hexCode: '#6B7A4A' },
  ivory: { name: 'Ivory', hexCode: '#FFFEF0' },
  cream: { name: 'Cream', hexCode: '#F5EFE0' },
  washedBlack: { name: 'Washed Black', hexCode: '#2C2C2C' },
  indigo: { name: 'Indigo', hexCode: '#3F4E6E' },
  dustyBlue: { name: 'Dusty Blue', hexCode: '#7A96B0' },
} as const;

const PRODUCTS: ProductSeed[] = [
  {
    name: 'Essential Drop Shoulder Tee',
    slug: 'essential-drop-shoulder-tee',
    description:
      'A minimalist essential with a relaxed dropped shoulder seam. Cut from heavyweight combed cotton for a soft, structured drape that holds its shape wash after wash.',
    basePrice: 2499,
    compareAtPrice: 2999,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    tags: ['drop-shoulder', 'essential', 'cotton', 'everyday'],
    material: MATERIAL,
    careInstructions: CARE,
    skuPrefix: 'DSH-ESS',
    colors: [C.black, C.offWhite, C.charcoal],
    sizes: SIZES_STANDARD,
    stockPerVariant: 25,
  },
  {
    name: 'Oversized Cotton Drop Shirt',
    slug: 'oversized-cotton-drop-shirt',
    description:
      'A generous oversized cut with a low shoulder seam. Breathable, mid-weight cotton that softens with each wash for a lived-in feel.',
    basePrice: 2799,
    compareAtPrice: 3499,
    isFeatured: true,
    isNewArrival: true,
    tags: ['drop-shoulder', 'oversized', 'cotton'],
    material: MATERIAL,
    careInstructions: CARE,
    skuPrefix: 'DSH-OVC',
    colors: [C.black, C.sand, C.slate],
    sizes: SIZES_EXTENDED,
    stockPerVariant: 20,
  },
  {
    name: 'Urban Street Drop Tee',
    slug: 'urban-street-drop-tee',
    description:
      'Clean streetwear lines with a boxy drop-shoulder silhouette. Built to pair with denim, joggers, or tailoring.',
    basePrice: 2299,
    isNewArrival: true,
    isBestSeller: true,
    tags: ['drop-shoulder', 'streetwear', 'everyday'],
    material: MATERIAL,
    careInstructions: CARE,
    skuPrefix: 'DSH-URB',
    colors: [C.black, C.white, C.navy],
    sizes: SIZES_STANDARD,
    stockPerVariant: 30,
  },
  {
    name: 'Heavy Cotton Drop Shirt',
    slug: 'heavy-cotton-drop-shirt',
    description:
      'A substantial 260 GSM cotton shirt with a structured drop shoulder. Holds its form, resists stretch, and looks sharp worn on its own.',
    basePrice: 3299,
    compareAtPrice: 3999,
    isFeatured: true,
    tags: ['drop-shoulder', 'heavyweight', 'premium'],
    material: '100% Combed Cotton, 260 GSM',
    careInstructions: CARE,
    skuPrefix: 'DSH-HVC',
    colors: [C.black, C.charcoal, C.olive],
    sizes: SIZES_EXTENDED,
    stockPerVariant: 18,
  },
  {
    name: 'Minimal Drop Shoulder Tee',
    slug: 'minimal-drop-shoulder-tee',
    description:
      'Zero branding, zero distractions. Just a clean drop-shoulder tee with a soft hand-feel and a straight hem.',
    basePrice: 2199,
    isNewArrival: true,
    tags: ['drop-shoulder', 'minimal', 'essential'],
    material: MATERIAL,
    careInstructions: CARE,
    skuPrefix: 'DSH-MIN',
    colors: [C.offWhite, C.black, C.beige],
    sizes: SIZES_STANDARD,
    stockPerVariant: 35,
  },
  {
    name: 'Vintage Wash Drop Shirt',
    slug: 'vintage-wash-drop-shirt',
    description:
      'Garment-dyed for a softly faded finish. Each piece carries subtle tonal variation — no two are exactly alike.',
    basePrice: 2999,
    isFeatured: true,
    isNewArrival: true,
    tags: ['drop-shoulder', 'vintage', 'washed'],
    material: MATERIAL,
    careInstructions: CARE,
    skuPrefix: 'DSH-VTG',
    colors: [C.washedBlack, C.stone, C.sand],
    sizes: SIZES_STANDARD,
    stockPerVariant: 15,
  },
  {
    name: 'Comfort Fit Drop Tee',
    slug: 'comfort-fit-drop-tee',
    description:
      'Designed for all-day wear. A slightly shorter body with a relaxed drop shoulder for an easy, uncomplicated fit.',
    basePrice: 2399,
    isBestSeller: true,
    tags: ['drop-shoulder', 'comfort', 'everyday'],
    material: MATERIAL,
    careInstructions: CARE,
    skuPrefix: 'DSH-CMF',
    colors: [C.black, C.navy, C.slate],
    sizes: SIZES_EXTENDED,
    stockPerVariant: 28,
  },
  {
    name: 'Classic Black Drop Shirt',
    slug: 'classic-black-drop-shirt',
    description:
      'A wardrobe anchor. Deep true black with a mid-weight drop shoulder and a straight hem that sits clean over denim.',
    basePrice: 2599,
    compareAtPrice: 3199,
    isFeatured: true,
    isBestSeller: true,
    tags: ['drop-shoulder', 'black', 'classic'],
    material: MATERIAL,
    careInstructions: CARE,
    skuPrefix: 'DSH-CLB',
    colors: [C.black, C.charcoal],
    sizes: SIZES_EXTENDED,
    stockPerVariant: 40,
  },
  {
    name: 'Ivory Drop Shoulder Tee',
    slug: 'ivory-drop-shoulder-tee',
    description:
      'Warm off-white with a subtle sheen. Pairs well with both warm and cool palettes.',
    basePrice: 2699,
    isNewArrival: true,
    tags: ['drop-shoulder', 'ivory', 'neutral'],
    material: MATERIAL,
    careInstructions: CARE,
    skuPrefix: 'DSH-IVR',
    colors: [C.ivory, C.offWhite, C.cream],
    sizes: SIZES_STANDARD,
    stockPerVariant: 22,
  },
  {
    name: 'Sandstone Drop Shirt',
    slug: 'sandstone-drop-shirt',
    description:
      'A muted earth tone with a natural cotton texture. Warm, versatile, and quietly considered.',
    basePrice: 2499,
    isNewArrival: true,
    tags: ['drop-shoulder', 'earth-tone', 'neutral'],
    material: MATERIAL,
    careInstructions: CARE,
    skuPrefix: 'DSH-SND',
    colors: [C.sand, C.stone, C.beige],
    sizes: SIZES_STANDARD,
    stockPerVariant: 20,
  },
  {
    name: 'Slate Grey Drop Tee',
    slug: 'slate-grey-drop-tee',
    description:
      'A cool, mid-toned grey that reads clean against denim and black. Simple, versatile, well-cut.',
    basePrice: 2399,
    isBestSeller: true,
    tags: ['drop-shoulder', 'grey', 'everyday'],
    material: MATERIAL,
    careInstructions: CARE,
    skuPrefix: 'DSH-SLT',
    colors: [C.slate, C.charcoal, C.black],
    sizes: SIZES_STANDARD,
    stockPerVariant: 30,
  },
  {
    name: 'Charcoal Oversized Drop',
    slug: 'charcoal-oversized-drop',
    description:
      'Deep charcoal in a generous oversized cut. Slouchy without losing structure — the drop shoulder does the work.',
    basePrice: 2899,
    compareAtPrice: 3499,
    isFeatured: true,
    tags: ['drop-shoulder', 'oversized', 'charcoal'],
    material: MATERIAL,
    careInstructions: CARE,
    skuPrefix: 'DSH-CHR',
    colors: [C.charcoal, C.black, C.slate],
    sizes: SIZES_EXTENDED,
    stockPerVariant: 20,
  },
  {
    name: 'Washed Indigo Drop Shirt',
    slug: 'washed-indigo-drop-shirt',
    description:
      'Indigo-dyed and stone-washed for a subtle blue cast. A denim-adjacent tone that flatters all skin tones.',
    basePrice: 2999,
    isNewArrival: true,
    tags: ['drop-shoulder', 'indigo', 'washed'],
    material: MATERIAL,
    careInstructions: CARE,
    skuPrefix: 'DSH-IND',
    colors: [C.indigo, C.dustyBlue, C.navy],
    sizes: SIZES_STANDARD,
    stockPerVariant: 18,
  },
  {
    name: 'Boxy Drop Shoulder Tee',
    slug: 'boxy-drop-shoulder-tee',
    description:
      'Cropped-and-boxy with wide shoulders. Sits high on the hip for a proportion-forward silhouette.',
    basePrice: 2599,
    isFeatured: true,
    isNewArrival: true,
    tags: ['drop-shoulder', 'boxy', 'modern'],
    material: MATERIAL,
    careInstructions: CARE,
    skuPrefix: 'DSH-BOX',
    colors: [C.black, C.sand, C.olive],
    sizes: SIZES_STANDARD,
    stockPerVariant: 22,
  },
  {
    name: 'Relaxed Fit Drop Shirt',
    slug: 'relaxed-fit-drop-shirt',
    description:
      'An easy everyday shirt with room through the body and a soft drop shoulder. Wear it tucked, half-tucked, or loose.',
    basePrice: 2699,
    isBestSeller: true,
    tags: ['drop-shoulder', 'relaxed', 'everyday'],
    material: MATERIAL,
    careInstructions: CARE,
    skuPrefix: 'DSH-RLX',
    colors: [C.offWhite, C.black, C.charcoal],
    sizes: SIZES_EXTENDED,
    stockPerVariant: 25,
  },
  {
    name: 'Premium Pima Drop Tee',
    slug: 'premium-pima-drop-tee',
    description:
      'Long-staple Pima cotton for a distinctly smoother finish. Exceptionally soft, keeps color, holds shape.',
    basePrice: 4499,
    compareAtPrice: 5499,
    isFeatured: true,
    tags: ['drop-shoulder', 'pima', 'premium'],
    material: '100% Peruvian Pima Cotton, 200 GSM',
    careInstructions: CARE,
    skuPrefix: 'DSH-PIM',
    colors: [C.black, C.navy, C.ivory],
    sizes: SIZES_EXTENDED,
    stockPerVariant: 12,
  },
  {
    name: 'Signature Drop Shoulder',
    slug: 'signature-drop-shoulder',
    description:
      'Our signature cut — a slightly longer body, mid-weight cotton, and a well-proportioned drop shoulder.',
    basePrice: 3499,
    isBestSeller: true,
    isFeatured: true,
    tags: ['drop-shoulder', 'signature', 'premium'],
    material: '100% Combed Cotton, 240 GSM',
    careInstructions: CARE,
    skuPrefix: 'DSH-SIG',
    colors: [C.black, C.charcoal, C.stone],
    sizes: SIZES_EXTENDED,
    stockPerVariant: 20,
  },
  {
    name: 'Everyday Drop Shirt',
    slug: 'everyday-drop-shirt',
    description:
      'The one you reach for without thinking. Clean, comfortable, and made to last through the week.',
    basePrice: 2199,
    tags: ['drop-shoulder', 'everyday', 'essential'],
    material: MATERIAL,
    careInstructions: CARE,
    skuPrefix: 'DSH-EVR',
    colors: [C.black, C.white, C.navy, C.slate],
    sizes: SIZES_EXTENDED,
    stockPerVariant: 35,
  },
  {
    name: 'Studio Drop Tee',
    slug: 'studio-drop-tee',
    description:
      'A quietly refined cut with a slightly more fitted shoulder. Designed for the studio, the street, and everything between.',
    basePrice: 2799,
    isNewArrival: true,
    tags: ['drop-shoulder', 'studio', 'modern'],
    material: MATERIAL,
    careInstructions: CARE,
    skuPrefix: 'DSH-STD',
    colors: [C.sand, C.olive, C.charcoal],
    sizes: SIZES_STANDARD,
    stockPerVariant: 22,
  },
  {
    name: 'Atelier Oversized Drop',
    slug: 'atelier-oversized-drop',
    description:
      'Our most considered oversized cut. Longer sleeves, lower shoulders, and a body that hangs beautifully. Limited production.',
    basePrice: 4999,
    compareAtPrice: 5999,
    isFeatured: true,
    tags: ['drop-shoulder', 'atelier', 'limited', 'premium'],
    material: '100% Organic Combed Cotton, 260 GSM',
    careInstructions: CARE,
    skuPrefix: 'DSH-ATL',
    colors: [C.black, C.charcoal, C.cream, C.slate],
    sizes: SIZES_EXTENDED,
    stockPerVariant: 10,
  },
];

async function main() {
  console.log('🌱 Seeding Maniesta Veyra...\n');

  // -----------------------------------------------------------------------
  // Clear product-related data ONLY.
  // We intentionally do NOT clear users, orders, coupons, or custom designs
  // so that real data survives a re-seed.
  // -----------------------------------------------------------------------
  console.log('Clearing existing products & categories...');
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // -----------------------------------------------------------------------
  // Category
  // -----------------------------------------------------------------------
  console.log('Creating "Drop Shoulder Shirts" category...');
  const category = await prisma.category.create({
    data: {
      name: 'Drop Shoulder Shirts',
      slug: 'drop-shoulder-shirts',
      description:
        'Relaxed-fit shirts with a dropped shoulder seam. Built for an easy, modern silhouette.',
      sortOrder: 1,
      isActive: true,
      metaTitle: 'Drop Shoulder Shirts | Maniesta Veyra',
      metaDescription:
        'Shop premium drop shoulder shirts at Maniesta Veyra. Relaxed fits, heavyweight cotton, made for everyday wear.',
    },
  });

  // -----------------------------------------------------------------------
  // Products
  // -----------------------------------------------------------------------
  let totalVariants = 0;
  let totalImages = 0;

  for (const p of PRODUCTS) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        categoryId: category.id,
        basePrice: new Prisma.Decimal(p.basePrice),
        compareAtPrice: p.compareAtPrice
          ? new Prisma.Decimal(p.compareAtPrice)
          : null,
        isActive: true,
        isFeatured: p.isFeatured ?? false,
        isNewArrival: p.isNewArrival ?? false,
        isBestSeller: p.isBestSeller ?? false,
        tags: p.tags,
        material: p.material,
        careInstructions: p.careInstructions,
        skuPrefix: p.skuPrefix,
        metaTitle: `${p.name} | Maniesta Veyra`,
        metaDescription: p.description.slice(0, 155),
      },
    });

    const colors = await Promise.all(
      p.colors.map((c, i) =>
        prisma.productColor.create({
          data: {
            productId: product.id,
            name: c.name,
            hexCode: c.hexCode,
            sortOrder: i,
          },
        })
      )
    );

    const sizes = await Promise.all(
      p.sizes.map((label, i) =>
        prisma.productSize.create({
          data: {
            productId: product.id,
            label,
            sortOrder: i,
          },
        })
      )
    );

    for (const color of colors) {
      for (const size of sizes) {
        const sku = `${p.skuPrefix}-${color.name
          .replace(/\s+/g, '')
          .slice(0, 3)
          .toUpperCase()}-${size.label}`;
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            colorId: color.id,
            sizeId: size.id,
            sku,
            stock: p.stockPerVariant,
            lowStockThreshold: 5,
            isActive: true,
          },
        });
        totalVariants++;
      }
    }

    for (let i = 1; i <= 3; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: `/images/products/${p.slug}-${i}.jpg`,
          altText: `${p.name} — view ${i}`,
          sortOrder: i - 1,
          isPrimary: i === 1,
        },
      });
      totalImages++;
    }
  }

  // -----------------------------------------------------------------------
  // Custom Print Studio — garment + print pricing
  //
  // This section is REQUIRED for /customize to work. Without it, the
  // customizer has no garments to offer.
  // -----------------------------------------------------------------------
  console.log('\n🎨 Seeding custom print studio...');
  await prisma.printPricing.deleteMany();
  await prisma.garmentVariant.deleteMany();
  await prisma.garmentColor.deleteMany();
  await prisma.garmentSize.deleteMany();
  await prisma.garment.deleteMany();

  const garment = await prisma.garment.create({
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
      isActive: true,
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

  const garmentColors = await prisma.garmentColor.findMany({
    where: { garmentId: garment.id },
  });
  const garmentSizes = await prisma.garmentSize.findMany({
    where: { garmentId: garment.id },
  });

  for (const color of garmentColors) {
    for (const size of garmentSizes) {
      await prisma.garmentVariant.create({
        data: {
          garmentId: garment.id,
          colorId: color.id,
          sizeId: size.id,
          sku: `${garment.skuPrefix}-${color.name.substring(0, 1)}-${size.label}`,
          stock: 100,
        },
      });
    }
  }

  await prisma.printPricing.createMany({
    data: [
      { garmentId: garment.id, location: 'FRONT', baseCost: 500 },
      { garmentId: garment.id, location: 'BACK', baseCost: 700 },
      { garmentId: garment.id, location: 'LEFT_SLEEVE', baseCost: 300 },
      { garmentId: garment.id, location: 'RIGHT_SLEEVE', baseCost: 300 },
    ],
  });

  // -----------------------------------------------------------------------
  // Report
  // -----------------------------------------------------------------------
  console.log(`\n✅ Seed complete.`);
  console.log(`   Category:        Drop Shoulder Shirts`);
  console.log(`   Products:        ${PRODUCTS.length}`);
  console.log(`   Variants:        ${totalVariants}`);
  console.log(`   Images (stubs):  ${totalImages}`);
  console.log(`   Custom garment:  ${garment.name}`);
  console.log(
    `\n📸 Add real product images to /public/images/products/{slug}-1.jpg`
  );
  console.log(`   See /public/images/products/README.md for the slug list.`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });