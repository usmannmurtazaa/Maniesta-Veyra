import Link from 'next/link';
import { Container, Section, PageHeader } from '@/components/layout';
import { publicEnv } from '@/lib/env';

export const metadata = {
  title: 'Collections | Maniesta Veyra',
  description:
    'Explore curated collections from Maniesta Veyra — new arrivals, featured pieces, and best sellers.',
  openGraph: {
    title: 'Collections | Maniesta Veyra',
    description: 'Explore curated collections from Maniesta Veyra.',
    url: `${publicEnv.NEXT_PUBLIC_APP_URL}/collections`,
    type: 'website',
  },
};

const collections = [
  {
    slug: 'new',
    name: 'New Arrivals',
    description: 'Fresh drops and the latest styles from Maniesta Veyra.',
  },
  {
    slug: 'featured',
    name: 'Featured',
    description: 'Handpicked premium pieces curated by our team.',
  },
  {
    slug: 'bestseller',
    name: 'Best Sellers',
    description: 'Customer favourites — the pieces our community loves most.',
  },
];

export default function CollectionsPage() {
  return (
    <main>
      <section className="bg-mv-dark text-mv-inverse">
        <Container className="py-20 md:py-28">
          <PageHeader
            title="Collections"
            subtitle="Curated selections from Maniesta Veyra"
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
                className="group border border-mv-border rounded-lg p-6 hover:shadow-md hover:border-mv-primary transition-all"
              >
                <h2 className="font-display text-2xl font-bold text-mv-text group-hover:text-mv-accent transition-colors">
                  {collection.name}
                </h2>
                <p className="mt-2 text-sm text-mv-text-secondary">
                  {collection.description}
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-mv-accent">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}