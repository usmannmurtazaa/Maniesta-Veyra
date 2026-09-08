import { prisma } from '@/lib/db/prisma';
import { PrintLocation } from '@prisma/client';
import { uploadToPrivateBucket } from '@/lib/storage/upload';

interface DesignAssetInput {
  printLocation: PrintLocation;
  imageUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  imageWidth?: number;
  imageHeight?: number;
  positionX: number;
  positionY: number;
  scale: number;
  rotation: number;
}

export class CustomDesignService {
  async createDesign(input: {
    userId?: string;
    garmentId: string;
    garmentColorId: string;
    garmentSizeId: string;
    printLocations: PrintLocation[];
    quantity: number;
    notes?: string;
    unitPrice: number;
    totalPrice: number;
    previewImageUrl?: string;
    assets: DesignAssetInput[];
  }) {
    const design = await prisma.customDesign.create({
      data: {
        userId: input.userId,
        garmentId: input.garmentId,
        garmentColorId: input.garmentColorId,
        garmentSizeId: input.garmentSizeId,
        printLocations: input.printLocations,
        quantity: input.quantity,
        notes: input.notes,
        unitPrice: input.unitPrice,
        totalPrice: input.totalPrice,
        previewImageUrl: input.previewImageUrl,
        assets: {
          create: input.assets.map((asset) => ({
            printLocation: asset.printLocation,
            imageUrl: asset.imageUrl,
            fileName: asset.fileName,
            fileSize: asset.fileSize,
            mimeType: asset.mimeType,
            imageWidth: asset.imageWidth,
            imageHeight: asset.imageHeight,
            positionX: asset.positionX,
            positionY: asset.positionY,
            scale: asset.scale,
            rotation: asset.rotation,
          })),
        },
      },
      include: {
        assets: true,
      },
    });
    return design;
  }
}

export const customDesignService = new CustomDesignService();