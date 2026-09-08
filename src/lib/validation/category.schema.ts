import { z } from 'zod';

export const categoryQuerySchema = z.object({
  parent: z.string().optional(),
  includeInactive: z.boolean().default(false),
});

export type CategoryQuery = z.infer<typeof categoryQuerySchema>;