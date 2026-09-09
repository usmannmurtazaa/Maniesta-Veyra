export function ContactPageJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Maniesta Veyra',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/contact`,
    mainEntity: {
      '@type': 'Organization',
      name: 'Maniesta Veyra',
      email: process.env.EMAIL_FROM,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}