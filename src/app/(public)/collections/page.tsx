import Link from 'next/link';
import { ArrowRight, Sparkles, Star, TrendingUp } from 'lucide-react';
import { Container, Section, PageHeader } from '@/components/layout';
import { Reveal } from '@/components/shared/reveal';
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
    description: 'The latest pieces to join the collection.',
    icon: Sparkles,
  },
  {
    slug: 'featured',
    name: 'Featured',
    description: 'Selected pieces from the current drop.',
    icon: Star,
  },
  {
    slug: 'bestseller',
    name: 'Best Sellers',
    description: 'The pieces our customers come back for.',
    icon: TrendingUp,
  },
];

export default function CollectionsPage() {
  return (
    <main>
      <section className="bg-mv-dark text-mv-inverse">
        <Container className="py-20 md:py-28">
          <Reveal>
            <PageHeader
              title="Collections"
              subtitle="Curated selections from Maniesta Veyra"
            />
          </Reveal>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {collections.map((collection, index) => {
              const Icon = collection.icon;
              return (
                <Reveal key={collection.slug} delay={index * 0.05}>
                  <Link
                    href={`/shop?collections=${collection.slug}`}
                    className="group flex h-full flex-col justify-between rounded-lg border border-mv-border bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-mv-primary hover:shadow-md"
                  >
                    <div>
                      <Icon
                        className="h-6 w-6 text-mv-accent"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                      <h2 className="mt-4 font-display text-2xl font-bold text-mv-text group-hover:text-mv-accent transition-colors">
                        {collection.name}
                      </h2>
                      <p className="mt-2 text-sm text-mv-text-secondary">
                        {collection.description}
                      </p>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-mv-text group-hover:text-mv-accent">
                      Explore
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>
    </main>
  );
}