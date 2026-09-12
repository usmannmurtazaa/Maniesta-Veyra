import { z } from 'zod';

/**
 * Defensive query schema for the shop page.
 *
 * Every field uses `.catch()` so malformed input (arrays from duplicate
 * query params, non-numeric strings, unknown sort values) falls back to a
 * sane default instead of throwing and returning a 500.
 *
 * A shop page should never 500 because of a bad query string.
 */

// Numbers: accept string, coerce; if invalid, use fallback.
const safeInt = (fallback: number, max?: number) =>
  z.coerce
    .number()
    .int()
    .positive()
    .max(max ?? Number.MAX_SAFE_INTEGER)
    .catch(fallback);

// Optional numbers: coerce; if invalid, undefined.
const safeOptionalNumber = z.coerce
  .number()
  .nonnegative()
  .optional()
  .catch(undefined);

// Optional strings: if an array (from ?key=a&key=b), take the first value.
const safeOptionalString = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((v) => (Array.isArray(v) ? v[0] : v))
  .catch(undefined);

const safeSort = z
  .enum(['newest', 'price_asc', 'price_desc', 'popular', 'rating'])
  .catch('newest');

const safeAvailability = z
  .enum(['in_stock', 'out_of_stock'])
  .optional()
  .catch(undefined);

export const productQuerySchema = z.object({
  page: safeInt(1),
  limit: safeInt(20, 50),
  category: safeOptionalString,
  minPrice: safeOptionalNumber,
  maxPrice: safeOptionalNumber,
  sizes: safeOptionalString,
  colors: safeOptionalString,
  rating: z.coerce.number().min(0).max(5).optional().catch(undefined),
  sort: safeSort,
  search: safeOptionalString,
  availability: safeAvailability,
  collections: safeOptionalString,
  tags: safeOptionalString,
});

export type ProductQuery = z.infer<typeof productQuerySchema>;