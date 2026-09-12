import { publicEnv } from '@/lib/env';

export function ServiceJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Custom Print Studio',
    description:
      'Custom shirt printing service. Upload your own artwork, preview it on the garment, and order it printed to order.',
    provider: {
      '@type': 'Organization',
      name: publicEnv.NEXT_PUBLIC_APP_NAME,
      url: publicEnv.NEXT_PUBLIC_APP_URL,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Pakistan',
    },
    serviceType: 'Custom apparel printing',
    url: `${publicEnv.NEXT_PUBLIC_APP_URL}/custom-shirts`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}