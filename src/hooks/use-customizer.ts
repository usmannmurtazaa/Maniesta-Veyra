'use client';

import { useCustomizerStore } from '@/stores/customizer-store';

export function useCustomizer() {
  return useCustomizerStore();
}