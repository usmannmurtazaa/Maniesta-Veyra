import Image from 'next/image';
import { productService } from '@/lib/services/product-service';
import { categoryService } from '@/lib/services/category-service';
import { Container, Section, PageHeader } from '@/components/layout';
import { ProductCardClient } from '@/components/product/product-card-client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { publicEnv } from '@/lib/env';

async function getFeaturedProducts() {
  const result = await productService.getProducts({
    page: 1,
    limit: 4,
    collections: 'featured',
    sort: 'newest',
  });
  return result.data;
}

async function getNewArrivals() {
  const result = await productService.getProducts({
    page: 1,
    limit: 4,
    collections: 'new',
    sort: 'newest',
  });
  return result.data;
}

async function getBestSellers() {
  const result = await productService.getProducts({
    page: 1,
    limit: 4,
    collections: 'bestseller',
    sort: 'popular',
  });
  return result.data;
}

async function getCategories() {
  return categoryService.getCategoryTree();
}

export default async function HomePage() {
  const [featured, newArrivals, bestSellers, categories] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getBestSellers(),
    getCategories(),
  ]);

  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-mv-dark text-mv-inverse">
          <div className="container-mv py-24 md:py-32 lg:py-40">
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
                {publicEnv.NEXT_PUBLIC_APP_NAME}
              </h1>
              <p className="mt-4 text-lg md:text-xl text-mv-inverse-muted">
                {publicEnv.NEXT_PUBLIC_APP_TAGLINE}
              </p>
              <p className="mt-6 text-mv-inverse-muted max-w-lg">
                Premium ready‑made clothing and a custom print studio. Create something that belongs to you.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/shop">
                  <Button size="lg" variant="accent">
                    Shop Collection <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/custom-shirts">
                  <Button size="lg" variant="outline" className="border-mv-inverse/30 text-mv-inverse hover:bg-mv-inverse/10">
                    Custom Print Studio
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <Section>
          <Container>
            <div className="mb-8">
              <PageHeader title="Shop by Category" subtitle="Discover curated collections" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/shop/${cat.slug}`} className="group">
                  <div className="aspect-square bg-mv-bg-alt rounded-lg overflow-hidden relative">
                    {cat.imageUrl ? (
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-mv-muted">No image</div>
                    )}
                  </div>
                  <p className="mt-2 text-center font-medium">{cat.name}</p>
                </Link>
              ))}
            </div>
          </Container>
        </Section>

        {/* New Arrivals */}
        <Section className="bg-mv-bg-alt">
          <Container>
            <div className="flex items-center justify-between mb-8">
              <PageHeader title="New Arrivals" />
              <Link href="/shop?collections=new">
                <Button variant="ghost">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {newArrivals.map((product) => (
                <ProductCardClient
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  price={Number(product.basePrice)}
                  compareAtPrice={product.compareAtPrice ? Number(product.compareAtPrice) : undefined}
                  imageUrl={product.images[0]?.url}
                  badge="New"
                />
              ))}
            </div>
          </Container>
        </Section>

        {/* Custom Studio CTA */}
        <Section>
          <Container>
            <div className="bg-mv-primary text-mv-inverse rounded-xl p-8 md:p-16 text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold">Create Your Own Shirt</h2>
              <p className="mt-2 text-mv-inverse-muted max-w-xl mx-auto">
                Upload your design, position it, preview it, and order a custom printed shirt made just for you.
              </p>
              <Link href="/customize">
                <Button size="lg" variant="accent" className="mt-6">
                  Start Designing
                </Button>
              </Link>
            </div>
          </Container>
        </Section>

        {/* Best Sellers */}
        <Section className="bg-mv-bg-alt">
          <Container>
            <div className="flex items-center justify-between mb-8">
              <PageHeader title="Best Sellers" />
              <Link href="/shop?collections=bestseller">
                <Button variant="ghost">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bestSellers.map((product) => (
                <ProductCardClient
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  price={Number(product.basePrice)}
                  compareAtPrice={product.compareAtPrice ? Number(product.compareAtPrice) : undefined}
                  imageUrl={product.images[0]?.url}
                />
              ))}
            </div>
          </Container>
        </Section>

        {/* Featured Products */}
        <Section>
          <Container>
            <div className="mb-8">
              <PageHeader title="Featured" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featured.map((product) => (
                <ProductCardClient
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  price={Number(product.basePrice)}
                  compareAtPrice={product.compareAtPrice ? Number(product.compareAtPrice) : undefined}
                  imageUrl={product.images[0]?.url}
                />
              ))}
            </div>
          </Container>
        </Section>
      </main>
    </>
  );
}