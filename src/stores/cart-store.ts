'use client';

import { create } from 'zustand';

export interface CartItem {
  id: string;
  productVariantId?: string | null;
  customDesignId?: string | null;
  quantity: number;
  isSavedForLater: boolean;
  price: number; // unit price in PKR
  product?: {
    name: string;
    slug: string;
    imageUrl?: string;
    color?: string;
    size?: string;
  };
  customDesign?: {
    garmentName: string;
    color: string;
    size: string;
    previewImageUrl?: string;
  };
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  isLoading: boolean;
  setCart: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  setLoading: (loading: boolean) => void;
}

const computeTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { totalItems, subtotal };
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalItems: 0,
  subtotal: 0,
  isLoading: false,
  setCart: (items) => {
    const { totalItems, subtotal } = computeTotals(items);
    set({ items, totalItems, subtotal });
  },
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find(
        (i) =>
          i.productVariantId === item.productVariantId &&
          i.customDesignId === item.customDesignId
      );
      let newItems;
      if (existing) {
        newItems = state.items.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        newItems = [...state.items, item];
      }
      const { totalItems, subtotal } = computeTotals(newItems);
      return { items: newItems, totalItems, subtotal };
    }),
  updateItemQuantity: (itemId, quantity) =>
    set((state) => {
      const newItems = state.items.map((i) =>
        i.id === itemId ? { ...i, quantity } : i
      );
      const { totalItems, subtotal } = computeTotals(newItems);
      return { items: newItems, totalItems, subtotal };
    }),
  removeItem: (itemId) =>
    set((state) => {
      const newItems = state.items.filter((i) => i.id !== itemId);
      const { totalItems, subtotal } = computeTotals(newItems);
      return { items: newItems, totalItems, subtotal };
    }),
  setLoading: (loading) => set({ isLoading: loading }),
}));