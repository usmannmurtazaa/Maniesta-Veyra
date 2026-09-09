import { Container, Section, PageHeader } from '@/components/layout';
import { Reveal } from '@/components/shared/reveal';
import { publicEnv } from '@/lib/env';

export const metadata = {
  title: 'Shipping Policy | Maniesta Veyra',
  description:
    'Learn about shipping areas, processing times, delivery estimates, tracking, and custom-order shipping for Maniesta Veyra.',
  openGraph: {
    title: 'Shipping Policy | Maniesta Veyra',
    description: 'Shipping information and delivery timelines for Maniesta Veyra orders.',
    url: `${publicEnv.NEXT_PUBLIC_APP_URL}/shipping`,
    type: 'website',
  },
};

export default function ShippingPage() {
  return (
    <main>
      <section className="bg-mv-dark text-mv-inverse">
        <Container className="py-20 md:py-28">
          <Reveal>
            <PageHeader
              title="Shipping Policy"
              subtitle="How we prepare and deliver your order"
            />
          </Reveal>
        </Container>
      </section>

      <Section>
        <Container className="max-w-3xl space-y-10">
          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Shipping Areas
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                We currently deliver across Pakistan. If you are outside our standard delivery
                zones, please contact our support team before placing an order.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Processing Time
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                Ready-made items are typically processed within 1–2 business days after
                payment confirmation. Custom print orders require additional production time,
                as detailed in the Custom Print Studio section.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Estimated Delivery
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                Delivery times vary by location. Standard delivery usually takes 2–5 business
                days for major cities and 3–7 business days for other areas. Delays may occur
                due to circumstances beyond our control.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Shipping Charges
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                Shipping fees are calculated at checkout based on your location and order
                value. Free shipping may be available for orders above a certain amount — please
                see the checkout page for the most accurate rates.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Order Tracking
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                Once your order is shipped, you will receive tracking information via email or
                SMS where available. You can also view order status in your account dashboard.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Delays
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                While we strive to meet delivery estimates, occasional delays may occur due to
                weather, courier issues, or high order volume. If your order is significantly
                delayed, please contact our support team.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Address Changes
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                Address changes are only possible before an order is shipped. Contact support
                immediately if you need to update your shipping address.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Custom-Order Shipping
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                Custom printed items require production time (usually 3–5 business days) before
                shipping. Delivery timelines for custom orders combine production plus standard
                shipping estimates.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}