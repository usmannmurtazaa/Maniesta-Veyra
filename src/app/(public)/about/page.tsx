import { Container, Section, PageHeader } from '@/components/layout';
import { Reveal } from '@/components/shared/reveal';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { publicEnv } from '@/lib/env';
import { OrganizationJsonLd } from '@/components/seo/organization-json-ld';

export const metadata = {
  title: 'About Maniesta Veyra | Wear Your Identity',
  description:
    'Discover the story behind Maniesta Veyra — a premium ready-to-wear brand and custom print studio built on quality, creativity, and individuality.',
  openGraph: {
    title: 'About Maniesta Veyra',
    description:
      'Discover the story behind Maniesta Veyra — a premium ready-to-wear brand and custom print studio.',
    url: `${publicEnv.NEXT_PUBLIC_APP_URL}/about`,
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <>
      <OrganizationJsonLd />
      <main>
        {/* Hero Section */}
        <section className="bg-mv-dark text-mv-inverse">
          <Container className="py-24 md:py-32">
            <Reveal>
              <PageHeader
                title={publicEnv.NEXT_PUBLIC_APP_NAME}
                subtitle={publicEnv.NEXT_PUBLIC_APP_TAGLINE}
              />
            </Reveal>
          </Container>
        </section>

        {/* Brand Introduction */}
        <Section>
          <Container>
            <Reveal>
              <div className="max-w-3xl space-y-6 text-mv-text-secondary">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-mv-text">
                  A brand for those who refuse to blend in.
                </h2>
                <p className="text-lg leading-relaxed">
                  Maniesta Veyra was created to bridge the gap between ready-to-wear
                  elegance and the desire to wear something truly personal. We are a
                  premium clothing label and custom print studio, offering a curated
                  collection alongside a design experience that puts your identity at
                  the center of every piece.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href="/shop">
                    <Button variant="accent" size="lg">
                      Explore the Collection
                    </Button>
                  </Link>
                  <Link href="/custom-shirts">
                    <Button variant="outline" size="lg">
                      Custom Print Studio
                    </Button>
                  </Link>
                </div>
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* Our Story */}
        <Section className="bg-mv-bg-alt">
          <Container className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-mv-text">
                  Our Story
                </h2>
                <div className="mt-4 space-y-4 text-mv-text-secondary">
                  <p>
                    Maniesta Veyra began with a simple belief: clothing should be more
                    than fabric—it should be a statement. We noticed a gap between
                    mass-produced fashion and the desire for individuality. So we built
                    a brand that offers both: carefully curated ready-to-wear essentials
                    and a custom studio that lets you create pieces that are unmistakably
                    yours.
                  </p>
                  <p>
                    Every stitch, every fabric choice, and every print is guided by our
                    commitment to quality. We work with skilled artisans and modern
                    production techniques to ensure that each garment not only looks
                    premium but feels premium.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
                  alt="Premium clothing hanging on a rack in a modern store"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* Ready-to-Wear */}
        <Section>
          <Container className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal className="order-2 lg:order-1">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop"
                  alt="Folded premium t-shirts stacked neatly"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1} className="order-1 lg:order-2">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-mv-text">
                  Ready-to-Wear
                </h2>
                <p className="mt-4 text-mv-text-secondary leading-relaxed">
                  Our ready-to-wear collection is designed for the modern individual who
                  values both style and substance. From oversized tees to polished shirts,
                  each piece is made from premium fabrics and tailored to a refined fit.
                  We keep our catalog intentional—quality over quantity, always.
                </p>
                <Link href="/shop" className="inline-block mt-6">
                  <Button variant="default">Shop Ready-to-Wear</Button>
                </Link>
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* Custom Print Studio */}
        <Section className="bg-mv-bg-alt">
          <Container className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-mv-text">
                  Custom Print Studio
                </h2>
                <p className="mt-4 text-mv-text-secondary leading-relaxed">
                  Our Custom Print Studio is where your ideas become wearable art. Choose
                  a garment, upload your design, and use our intuitive editor to position,
                  resize, and rotate it exactly how you envision. Whether it&apos;s a single
                  statement piece or a batch for your team, we bring your concept to life
                  with precision and care.
                </p>
                <Link href="/customize" className="inline-block mt-6">
                  <Button variant="accent">Start Designing</Button>
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2070&auto=format&fit=crop"
                  alt="Custom t-shirt printing process"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* Brand Values */}
        <Section>
          <Container>
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-mv-text">
                  What We Stand For
                </h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Quality', description: 'Premium fabrics and meticulous construction in every piece.' },
                { title: 'Creativity', description: 'A platform that encourages you to express yourself freely.' },
                { title: 'Individuality', description: 'Wear something that no one else has—because it’s yours.' },
                { title: 'Craftsmanship', description: 'Attention to detail from first stitch to final print.' },
              ].map((value, index) => (
                <Reveal key={value.title} delay={index * 0.05}>
                  <div className="border border-mv-border rounded-lg p-6 h-full hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-lg text-mv-text">{value.title}</h3>
                    <p className="mt-2 text-sm text-mv-text-secondary">{value.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>

        {/* Why Maniesta Veyra */}
        <Section className="bg-mv-dark text-mv-inverse">
          <Container>
            <Reveal>
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="font-display text-3xl md:text-4xl font-bold">
                  Why Maniesta Veyra?
                </h2>
                <p className="mt-4 text-mv-inverse-muted leading-relaxed">
                  Because you deserve more than off-the-rack. You deserve a brand that
                  respects your individuality, delivers uncompromising quality, and gives
                  you the tools to create something that is truly your own. That is the
                  Maniesta Veyra promise.
                </p>
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  <Link href="/shop">
                    <Button variant="accent" size="lg">
                      Shop the Collection
                    </Button>
                  </Link>
                  <Link href="/custom-shirts">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-mv-inverse/30 text-mv-inverse hover:bg-mv-inverse/10"
                    >
                      Visit Custom Studio
                    </Button>
                  </Link>
                </div>
              </div>
            </Reveal>
          </Container>
        </Section>
      </main>
    </>
  );
}