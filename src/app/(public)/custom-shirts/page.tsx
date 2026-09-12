import Link from 'next/link';
import { ArrowRight, Upload, Shirt, Eye } from 'lucide-react';
import { Container, Section, PageHeader } from '@/components/layout';
import { Reveal } from '@/components/shared/reveal';
import { ServiceJsonLd } from '@/components/seo/service-json-ld';
import { Button } from '@/components/ui/button';
import { publicEnv } from '@/lib/env';

export const metadata = {
  title: 'Custom Print Studio | Maniesta Veyra',
  description:
    'Design your own shirt. Upload artwork, position it on the garment, and order it printed to order. Delivery across Pakistan.',
  openGraph: {
    title: 'Custom Print Studio | Maniesta Veyra',
    description:
      'Upload your design, preview it on the shirt, and order it printed to order.',
    url: `${publicEnv.NEXT_PUBLIC_APP_URL}/custom-shirts`,
    type: 'website',
  },
};

const STEPS = [
  {
    icon: Shirt,
    title: 'Choose your garment',
    desc: 'Pick a base shirt and color from the current range.',
  },
  {
    icon: Upload,
    title: 'Upload your design',
    desc: 'PNG, JPG, WebP, or SVG. Up to 10 MB.',
  },
  {
    icon: Eye,
    title: 'Preview and order',
    desc: 'Position and resize your design, then add it to your cart.',
  },
];

export default function CustomShirtsLandingPage() {
  return (
    <>
      <ServiceJsonLd />
      <main>
        {/* Hero */}
        <section className="bg-mv-dark text-mv-inverse">
          <Container className="py-20 md:py-28 lg:py-32">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-mv-accent">
                Custom Print Studio
              </p>
              <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] md:text-5xl lg:text-6xl">
                Wear your identity.
              </h1>
              <p className="mt-6 max-w-lg text-base text-mv-inverse-muted">
                Upload your own artwork, position it on the shirt, and we will
                print it to order. No minimums.
              </p>
              <Link href="/customize" className="mt-8 inline-block">
                <Button size="lg" variant="accent" className="gap-2">
                  Start designing <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* How it works */}
        <Section>
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <PageHeader title="How it works" />
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
              {STEPS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={index * 0.05}>
                    <div className="flex h-full flex-col rounded-lg border border-mv-border bg-white p-6">
                      <Icon
                        className="h-6 w-6 text-mv-accent"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                      <h3 className="mt-4 font-display text-xl font-bold text-mv-text">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-mv-text-secondary">
                        {item.desc}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </Section>

        {/* Pricing note */}
        <Section className="bg-mv-bg-alt">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-2xl font-bold text-mv-text md:text-3xl">
                One transparent price
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                Base garment plus print cost, shown live as you design. Volume
                discounts apply automatically for orders of 10 or more.
              </p>
              <Link href="/customize" className="mt-6 inline-block">
                <Button variant="default" size="lg" className="gap-2">
                  Open the studio <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Container>
        </Section>
      </main>
    </>
  );
}