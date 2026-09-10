import { z } from 'zod';

export const customDesignAssetSchema = z.object({
  printLocation: z.enum(['FRONT', 'BACK', 'LEFT_SLEEVE', 'RIGHT_SLEEVE']),
  imageUrl: z.string().url(),
  fileName: z.string(),
  fileSize: z.number().int().positive(),
  mimeType: z.string(),
  imageWidth: z.number().int().positive().optional(),
  imageHeight: z.number().int().positive().optional(),
  positionX: z.number().min(0).max(100),
  positionY: z.number().min(0).max(100),
  scale: z.number().min(0.05).max(1),
  rotation: z.number().min(0).max(360),
});

export const customDesignCreateSchema = z.object({
  garmentId: z.string(),
  garmentColorId: z.string(),
  garmentSizeId: z.string(),
  printLocations: z.array(z.enum(['FRONT', 'BACK', 'LEFT_SLEEVE', 'RIGHT_SLEEVE'])),
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
  unitPrice: z.number().positive(),
  totalPrice: z.number().positive(),
  previewImageUrl: z.string().url().optional(),
  assets: z.array(customDesignAssetSchema),
});

export type CustomDesignCreateInput = z.infer<typeof customDesignCreateSchema>;