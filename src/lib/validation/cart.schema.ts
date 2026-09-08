import { z } from 'zod';

export const addCartItemSchema = z.object({
  productVariantId: z.string().optional(),
  customDesignId: z.string().optional(),
  quantity: z.number().int().positive().default(1),
}).refine(
  (data) => (data.productVariantId || data.customDesignId) && !(data.productVariantId && data.customDesignId),
  { message: 'Provide exactly one of productVariantId or customDesignId' }
);

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive().optional(),
  isSavedForLater: z.boolean().optional(),
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;