import { Container, Section, PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { publicEnv } from '@/lib/env';

export const metadata = {
  title: 'Collections | Maniesta Veyra',
  description: 'Explore curated collections from Maniesta Veyra.',
};

export default function CollectionsPage() {
  const collections = [
    { slug: 'new', name: 'New Arrivals', description: 'Fresh drops and latest styles.' },
    { slug: 'featured', name: 'Featured', description: 'Handpicked premium pieces.' },
    { slug: 'bestseller', name: 'Best Sellers', description: 'Customer favorites.' },
  ];

  return (
    <main>
      <section className="bg-mv-dark text-mv-inverse">
        <Container className="py-20 md:py-28">
          <PageHeader
            title="Collections"
            subtitle="Curated collections from Maniesta Veyra"
          />
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Link
                key={collection.slug}
                href={`/shop?collections=${collection.slug}`}
                className="border border-mv-border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <h2 className="font-display text-2xl font-bold text-mv-text">
                  {collection.name}
                </h2>
                <p className="mt-2 text-sm text-mv-text-secondary">
                  {collection.description}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}