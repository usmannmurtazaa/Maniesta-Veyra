import { z } from 'zod';

/**
 * Defensive search query schema. Every field falls back to a sane default
 * rather than throwing, so a malformed query string never 500s the page.
 */
export const searchQuerySchema = z.object({
  q: z
    .string()
    .trim()
    .min(1, 'Search query is required')
    .max(100, 'Search query is too long')
    .catch(''),
  page: z.coerce.number().int().positive().catch(1),
  limit: z.coerce.number().int().positive().max(50).catch(20),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;