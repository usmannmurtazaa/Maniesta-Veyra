import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { SectionHeading } from '@/components/shared/section-heading';
import { Button } from '@/components/ui/button';
import { OrganizationJsonLd } from '@/components/seo/organization-json-ld';
import { publicEnv } from '@/lib/env';

export const metadata = {
  title: 'About | Maniesta Veyra',
  description:
    'Maniesta Veyra is a Pakistan-based clothing label. We make drop shoulder shirts in small batches and run a custom print studio.',
  openGraph: {
    title: 'About Maniesta Veyra',
    description:
      'A Pakistan-based clothing label making drop shoulder shirts and running a small custom print studio.',
    url: `${publicEnv.NEXT_PUBLIC_APP_URL}/about`,
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <>
      <OrganizationJsonLd />
      <main>
        {/* Intro */}
        <Section>
          <Container>
            <div className="mx-auto max-w-3xl">
              <SectionHeading
                eyebrow="About"
                title="A small clothing label, based in Pakistan."
              />
              <div className="space-y-5 text-mv-text-secondary">
                <p className="text-lg">
                  {publicEnv.NEXT_PUBLIC_APP_NAME} makes everyday clothing. We
                  started with one product - the drop shoulder shirt - because
                  it&apos;s the piece we wear most and the one worth getting
                  right first.
                </p>
                <p>
                  Every shirt is cut from 220–260 GSM combed cotton, built for
                  repeated washes, and produced in small batches so we can
                  actually keep an eye on what ships.
                </p>
              </div>
            </div>
          </Container>
        </Section>

        {/* What we make */}
        <Section className="bg-mv-bg-alt">
          <Container>
            <div className="grid gap-12 md:grid-cols-2 md:gap-16">
              <div>
                <h2 className="font-display text-2xl font-bold text-mv-text md:text-3xl">
                  What we make
                </h2>
                <div className="mt-4 space-y-4 text-mv-text-secondary">
                  <p>
                    Right now, our range focuses on drop shoulder shirts in a
                    small set of colors and sizes. The fit is relaxed, the
                    shoulders are dropped, and the hem is straight - designed to
                    sit clean over denim, joggers, or tailored trousers.
                  </p>
                  <p>
                    We don&apos;t chase every trend. If a piece doesn&apos;t hold
                    up over months of wear, we don&apos;t sell it.
                  </p>
                </div>
                <Link href="/shop" className="mt-6 inline-block">
                  <Button>Shop the collection</Button>
                </Link>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-mv-text md:text-3xl">
                  Custom print studio
                </h2>
                <div className="mt-4 space-y-4 text-mv-text-secondary">
                  <p>
                    Beyond ready-made pieces, we run a small custom print studio.
                    Upload your own artwork, position it on the shirt, and
                    we&apos;ll print it to order on the same fabric we use for
                    our own collection.
                  </p>
                  <p>
                    The editor lets you move, scale, and rotate your design on
                    the front, back, or sleeves. You see the price update as you
                    go - no surprises at checkout.
                  </p>
                </div>
                <Link href="/custom-shirts" className="mt-6 inline-block">
                  <Button variant="accent">Visit the studio</Button>
                </Link>
              </div>
            </div>
          </Container>
        </Section>

        {/* How we work — three short principles, not five generic ones */}
        <Section>
          <Container>
            <div className="mx-auto max-w-3xl">
              <SectionHeading
                eyebrow="How we work"
                title="Three things we try to get right."
              />
              <div className="space-y-8">
                <div>
                  <h3 className="font-display text-xl font-bold text-mv-text">
                    One product, done properly
                  </h3>
                  <p className="mt-2 text-mv-text-secondary">
                    We&apos;d rather sell one shirt that fits well and lasts than
                    twenty that don&apos;t. Our range grows slowly, and only when
                    we have something worth adding.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-mv-text">
                    Small batches, real fabric
                  </h3>
                  <p className="mt-2 text-mv-text-secondary">
                    Everything we sell is made in small runs so we can check
                    quality before it ships. Fabric weights and materials are
                    listed on every product page - no vague claims.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-mv-text">
                    Made and shipped in Pakistan
                  </h3>
                  <p className="mt-2 text-mv-text-secondary">
                    We&apos;re based in Pakistan and ship across the country with
                    delivery in 3–5 business days. If you&apos;re outside
                    Pakistan and want to order, get in touch.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* CTA */}
        <Section className="bg-mv-primary text-mv-inverse">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                {publicEnv.NEXT_PUBLIC_APP_TAGLINE}
              </h2>
              <p className="mt-3 text-mv-inverse-muted">
                Browse the collection, or design your own shirt in the custom
                studio.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/shop">
                  <Button variant="accent" size="lg">
                    Shop the collection
                  </Button>
                </Link>
                <Link href="/customize">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-mv-inverse/30 text-mv-inverse hover:bg-mv-inverse/10"
                  >
                    Start designing
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      </main>
    </>
  );
}