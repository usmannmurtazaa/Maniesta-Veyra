export interface ProductColor {
  id: string;
  name: string;
  hexCode: string;
  sortOrder?: number;
}

export interface ProductSize {
  id: string;
  label: string;
  sortOrder?: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  price?: number | null;
  stock: number;
  colorId: string;
  sizeId: string;
  lowStockThreshold?: number;
  isActive?: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  categoryId: string;
  basePrice: number;
  compareAtPrice?: number | null;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  tags: string[];
  material?: string | null;
  careInstructions?: string | null;
  skuPrefix: string;
  ratingAvg: number;
  ratingCount: number;
  colors: ProductColor[];
  sizes: ProductSize[];
  variants: ProductVariant[];
  images: ProductImage[];
  category?: {
    name: string;
    slug: string;
  };
}