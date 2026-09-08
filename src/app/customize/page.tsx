'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/layout';
import { CustomizerWizard } from '@/components/customizer/customizer-wizard';
import { useCustomizerStore } from '@/stores/customizer-store';

export default function CustomizePage() {
  const [garments, setGarments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/custom/garments')
      .then((res) => res.json())
      .then((result) => {
        if (result.data) setGarments(result.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Container className="py-16 text-center">Loading custom studio...</Container>;
  }

  return (
    <Container className="py-8">
      <h1 className="font-display text-3xl font-bold mb-6">Custom Print Studio</h1>
      <CustomizerWizard garments={garments} />
    </Container>
  );
}