import { publicEnv } from '@/lib/env';

interface ContactPageJsonLdProps {
  supportEmail?: string;
}

export function ContactPageJsonLd({ supportEmail }: ContactPageJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${publicEnv.NEXT_PUBLIC_APP_NAME}`,
    url: `${publicEnv.NEXT_PUBLIC_APP_URL}/contact`,
    mainEntity: {
      '@type': 'Organization',
      name: publicEnv.NEXT_PUBLIC_APP_NAME,
      url: publicEnv.NEXT_PUBLIC_APP_URL,
      contactPoint: supportEmail
        ? {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: supportEmail,
            availableLanguage: ['English', 'Urdu'],
            areaServed: 'PK',
          }
        : undefined,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}