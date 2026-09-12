'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Container } from '@/components/layout';
import { Button } from '@/components/ui/button';

// CustomizerWizard uses Konva.js which is browser-only.
// Dynamically imported with ssr: false to avoid SSR crashes.
const CustomizerWizard = dynamic(
  () =>
    import('@/components/customizer/customizer-wizard').then((mod) => ({
      default: mod.CustomizerWizard,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="py-16 text-center text-mv-muted">
        Loading custom studio…
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/custom/garments')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load garments');
        return res.json();
      })
      .then((result) => {
        if (!cancelled && result.data) {
          setGarments(result.data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            'We could not load the custom studio right now. Please try again.'
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <Container className="py-16 text-center text-mv-muted">
        Loading custom studio…
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-mv-text">
          Custom Print Studio
        </h1>
        <p className="mt-3 text-mv-text-secondary max-w-md mx-auto">{error}</p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => window.location.reload()}
        >
          Try again
        </Button>
      </Container>
    );
  }

  if (garments.length === 0) {
    return (
      <Container className="py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-mv-text">
          Custom Print Studio
        </h1>
        <p className="mt-3 text-mv-text-secondary max-w-md mx-auto">
          The custom studio is not available right now. Please check back
          shortly.
        </p>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <h1 className="font-display text-3xl font-bold mb-6 text-mv-text">
        Custom Print Studio
      </h1>
      <CustomizerWizard garments={garments} />
    </Container>
  );
}