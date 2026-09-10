export type PrintLocation = 'FRONT' | 'BACK' | 'LEFT_SLEEVE' | 'RIGHT_SLEEVE';

export interface DesignAssetConfig {
  imageUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  imageWidth?: number;
  imageHeight?: number;
  positionX: number;
  positionY: number;
  scale: number;
  rotation: number;
}

export interface CustomDesignAsset {
  id: string;
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

export interface CustomDesign {
  id: string;
  userId?: string | null;
  garmentId: string;
  garmentColorId: string;
  garmentSizeId: string;
  printLocations: PrintLocation[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string | null;
  previewImageUrl?: string | null;
  assets: CustomDesignAsset[];
  createdAt: string;
  updatedAt: string;
}