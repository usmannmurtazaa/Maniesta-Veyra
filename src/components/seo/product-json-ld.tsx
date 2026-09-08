interface ProductJsonLdProps {
  product: any;
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map((img: any) => img.url),
    sku: product.skuPrefix,
    brand: {
      '@type': 'Brand',
      name: 'Maniesta Veyra',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'PKR',
      lowPrice: Number(product.basePrice).toFixed(2),
      highPrice: Number(product.basePrice).toFixed(2),
      offerCount: product.variants.length,
      availability: 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.slug}`,
    },
    aggregateRating: product.ratingCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: Number(product.ratingAvg).toFixed(2),
      reviewCount: product.ratingCount,
    } : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}