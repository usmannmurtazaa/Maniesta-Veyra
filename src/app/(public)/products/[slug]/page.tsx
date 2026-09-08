import { notFound } from 'next/navigation';
import { productService } from '@/lib/services/product-service';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductInfo } from '@/components/product/product-info';
import { RelatedProducts } from '@/components/product/related-products';
import { Container } from '@/components/layout';
import { ProductJsonLd } from '@/components/seo/product-json-ld';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld';
import { Suspense } from 'react';

interface ProductPageProps {
  params: { slug: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await productService.getProductBySlug(params.slug);
  if (!product) notFound();

  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: product.category.name, path: `/shop/${product.category.slug}` },
    { name: product.name, path: `/products/${product.slug}` },
  ];

  return (
    <Container className="py-8">
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductGallery images={product.images} />
        <ProductInfo product={product} />
      </div>

      <Suspense fallback={<div>Loading related products...</div>}>
        <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
      </Suspense>
    </Container>
  );
}