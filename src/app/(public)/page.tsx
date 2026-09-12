import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { productService } from '@/lib/services/product-service';
import { Container, Section } from '@/components/layout';
import { SectionHeading } from '@/components/shared/section-heading';
import { ProductCardClient } from '@/components/product/product-card-client';
import { Button } from '@/components/ui/button';
import { publicEnv } from '@/lib/env';

export const revalidate = 300;

async function getFeaturedProducts() {
  const result = await productService.getProducts({
    page: 1,
    limit: 8,
    collections: 'featured',
    sort: 'newest',
  });
  return result.data;
}

async function getNewArrivals() {
  const result = await productService.getProducts({
    page: 1,
    limit: 8,
    collections: 'new',
    sort: 'newest',
  });
  return result.data;
}

async function getBestSellers() {
  const result = await productService.getProducts({
    page: 1,
    limit: 8,
    collections: 'bestseller',
    sort: 'popular',
  });
  return result.data;
}

export default async function HomePage() {
  const [featured, newArrivals, bestSellers] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getBestSellers(),
  ]);

  const heroProduct = featured[0] ?? bestSellers[0] ?? newArrivals[0];

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-mv-border bg-mv-bg">
        <Container className="grid gap-10 py-14 md:grid-cols-2 md:items-center md:gap-12 md:py-20 lg:py-24">
          <div className="order-2 md:order-1">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-mv-accent">
              Drop Shoulder Collection
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] text-mv-text md:text-5xl lg:text-6xl">
              Everyday shirts,
              <br />
              cut for the way
              <br />
              you actually move.
            </h1>
            <p className="mt-6 max-w-md text-base text-mv-text-secondary">
              Heavyweight cotton. Relaxed shoulders. Made in Pakistan for
              everyday wear.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop">
                <Button size="lg" variant="default" className="gap-2">
                  Shop the collection <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/custom-shirts">
                <Button size="lg" variant="outline">
                  Custom Studio
                </Button>
              </Link>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-mv-bg-alt">
              {heroProduct?.images?.[0]?.url ? (
                <Image
                  src={heroProduct.images[0].url}
                  alt={heroProduct.images[0].altText ?? heroProduct.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-mv-muted">
                  <span className="text-sm">Hero image</span>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <Section>
          <Container>
            <div className="flex items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Featured"
                title="Made to wear on repeat"
                subtitle="Selected pieces from the current drop."
              />
              <Link
                href="/shop"
                className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-mv-text hover:text-mv-accent"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {featured.slice(0, 4).map((product) => (
                <ProductCardClient
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  price={Number(product.basePrice)}
                  compareAtPrice={
                    product.compareAtPrice
                      ? Number(product.compareAtPrice)
                      : undefined
                  }
                  imageUrl={product.images[0]?.url}
                  secondaryImageUrl={product.images[1]?.url}
                  categoryName={product.category?.name}
                  badge={product.isNewArrival ? 'New' : undefined}
                  rating={
                    product.ratingCount > 0 ? Number(product.ratingAvg) : undefined
                  }
                  ratingCount={product.ratingCount || undefined}
                  inStock={product.variants.some((v) => v.stock > 0)}
                />
              ))}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Link href="/shop">
                <Button variant="outline">View all products</Button>
              </Link>
            </div>
          </Container>
        </Section>
      )}

      {/* Custom studio CTA */}
      <Section className="bg-mv-primary text-mv-inverse">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-mv-accent">
              Custom Studio
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              Bring your own design.
            </h2>
            <p className="mt-3 text-mv-inverse-muted">
              Upload your artwork, preview it on the shirt, and order it printed
              to order.
            </p>
            <Link href="/customize" className="mt-6 inline-block">
              <Button size="lg" variant="accent">
                Start designing
              </Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* New arrivals */}
      {newArrivals.length > 0 && (
        <Section>
          <Container>
            <div className="flex items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Just landed"
                title="New arrivals"
                subtitle="The latest additions to the collection."
              />
              <Link
                href="/shop?collections=new"
                className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-mv-text hover:text-mv-accent"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {newArrivals.slice(0, 4).map((product) => (
                <ProductCardClient
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  price={Number(product.basePrice)}
                  compareAtPrice={
                    product.compareAtPrice
                      ? Number(product.compareAtPrice)
                      : undefined
                  }
                  imageUrl={product.images[0]?.url}
                  secondaryImageUrl={product.images[1]?.url}
                  categoryName={product.category?.name}
                  badge="New"
                  inStock={product.variants.some((v) => v.stock > 0)}
                />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Best sellers */}
      {bestSellers.length > 0 && (
        <Section className="bg-mv-bg-alt">
          <Container>
            <div className="flex items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Loved"
                title="Best sellers"
                subtitle="The pieces our customers come back for."
              />
              <Link
                href="/shop?collections=bestseller"
                className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-mv-text hover:text-mv-accent"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {bestSellers.slice(0, 4).map((product) => (
                <ProductCardClient
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  price={Number(product.basePrice)}
                  compareAtPrice={
                    product.compareAtPrice
                      ? Number(product.compareAtPrice)
                      : undefined
                  }
                  imageUrl={product.images[0]?.url}
                  secondaryImageUrl={product.images[1]?.url}
                  categoryName={product.category?.name}
                  inStock={product.variants.some((v) => v.stock > 0)}
                />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Brand statement */}
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-mv-accent">
              {publicEnv.NEXT_PUBLIC_APP_NAME}
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">
              {publicEnv.NEXT_PUBLIC_APP_TAGLINE}
            </h2>
            <p className="mt-4 text-mv-text-secondary">
              Considered basics, made to be worn hard and washed often. Built
              in small batches, shipped across Pakistan.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-mv-text hover:text-mv-accent"
            >
              Read our story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </Section>
    </main>
  );
}