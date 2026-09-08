import { z } from 'zod';

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  category: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  sizes: z.string().optional(), // comma-separated values
  colors: z.string().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'popular', 'rating']).default('newest'),
  search: z.string().optional(),
  availability: z.enum(['in_stock', 'out_of_stock']).optional(),
  collections: z.string().optional(), // comma-separated: featured, new, bestseller
  tags: z.string().optional(),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;