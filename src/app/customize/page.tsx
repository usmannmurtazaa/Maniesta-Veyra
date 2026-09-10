'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Container } from '@/components/layout';

// ✅ CRITICAL: CustomizerWizard uses Konva.js which is browser-only.
// Must be dynamically imported with ssr: false to avoid SSR crashes.
const CustomizerWizard = dynamic(
  () =>
    import('@/components/customizer/customizer-wizard').then((mod) => ({
      default: mod.CustomizerWizard,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="py-16 text-center text-mv-muted">
        Loading custom studio...
      </div>
    ),
  }
);

interface Garment {
  id: string;
  name: string;
  basePrice: number | string;
  colors: Array<{ id: string; name: string; hexCode: string }>;
  sizes: Array<{ id: string; label: string }>;
  supportedPrintLocations: string[];
}

export default function CustomizePage() {
  const [garments, setGarments] = useState<Garment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/custom/garments')
      .then((res) => res.json())
      .then((result) => {
        if (result.data) setGarments(result.data);
      })
      .catch(() => {
        setGarments([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container className="py-16 text-center text-mv-muted">
        Loading custom studio...
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <h1 className="font-display text-3xl font-bold mb-6">Custom Print Studio</h1>
      <CustomizerWizard garments={garments} />
    </Container>
  );
}