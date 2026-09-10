'use client';

import { create } from 'zustand';

interface WishlistProduct {
  id: string;
  slug: string;
  name: string;
  basePrice: number;
  compareAtPrice?: number | null;
  imageUrl?: string;
}

interface WishlistState {
  items: WishlistProduct[];
  isLoading: boolean;
  setItems: (items: WishlistProduct[]) => void;
  addItem: (item: WishlistProduct) => void;
  removeItem: (productId: string) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  items: [],
  isLoading: false,
  setItems: (items) => set({ items }),
  addItem: (item) =>
    set((state) => {
      const exists = state.items.some((i) => i.id === item.id);
      if (exists) return state;
      return { items: [...state.items, item] };
    }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== productId),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  clear: () => set({ items: [] }),
}));