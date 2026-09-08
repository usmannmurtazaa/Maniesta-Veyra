'use client';

import { create } from 'zustand';
import { PrintLocation } from '@prisma/client';

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

export interface CustomizerState {
  step: number;
  garmentId?: string;
  garmentColorId?: string;
  garmentSizeId?: string;
  selectedLocations: PrintLocation[];
  activeLocation?: PrintLocation;
  assets: Record<string, DesignAssetConfig>;
  quantity: number;
  notes: string;
  estimatedPrice?: { unitPrice: number; totalPrice: number };
  setStep: (step: number) => void;
  setGarment: (id: string) => void;
  setColor: (id: string) => void;
  setSize: (id: string) => void;
  toggleLocation: (loc: PrintLocation) => void;
  setActiveLocation: (loc: PrintLocation) => void;
  setAssetConfig: (loc: PrintLocation, config: Partial<DesignAssetConfig>) => void;
  setQuantity: (qty: number) => void;
  setNotes: (notes: string) => void;
  setEstimatedPrice: (price: { unitPrice: number; totalPrice: number }) => void;
  reset: () => void;
}

const initialAssets: Record<string, DesignAssetConfig> = {};
['FRONT', 'BACK', 'LEFT_SLEEVE', 'RIGHT_SLEEVE'].forEach((loc) => {
  initialAssets[loc] = {
    positionX: 50,
    positionY: 50,
    scale: 0.5,
    rotation: 0,
  };
});

export const useCustomizerStore = create<CustomizerState>((set) => ({
  step: 1,
  selectedLocations: [],
  activeLocation: undefined,
  assets: initialAssets,
  quantity: 1,
  notes: '',
  setStep: (step) => set({ step }),
  setGarment: (id) => set({ garmentId: id }),
  setColor: (id) => set({ garmentColorId: id }),
  setSize: (id) => set({ garmentSizeId: id }),
  toggleLocation: (loc) =>
    set((state) => {
      const selected = state.selectedLocations.includes(loc)
        ? state.selectedLocations.filter((l) => l !== loc)
        : [...state.selectedLocations, loc];
      return { selectedLocations: selected, activeLocation: loc };
    }),
  setActiveLocation: (loc) => set({ activeLocation: loc }),
  setAssetConfig: (loc, config) =>
    set((state) => ({
      assets: {
        ...state.assets,
        [loc]: { ...state.assets[loc], ...config },
      },
    })),
  setQuantity: (qty) => set({ quantity: qty }),
  setNotes: (notes) => set({ notes }),
  setEstimatedPrice: (price) => set({ estimatedPrice: price }),
  reset: () =>
    set({
      step: 1,
      garmentId: undefined,
      garmentColorId: undefined,
      garmentSizeId: undefined,
      selectedLocations: [],
      activeLocation: undefined,
      assets: initialAssets,
      quantity: 1,
      notes: '',
      estimatedPrice: undefined,
    }),
}));