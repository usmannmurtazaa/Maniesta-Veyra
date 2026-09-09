import { Container, Section, PageHeader } from '@/components/layout';
import { Reveal } from '@/components/shared/reveal';
import { publicEnv } from '@/lib/env';

export const metadata = {
  title: 'Terms & Conditions | Maniesta Veyra',
  description:
    'Terms and conditions governing the use of Maniesta Veyra website and services.',
  openGraph: {
    title: 'Terms & Conditions | Maniesta Veyra',
    description: 'Terms of use for Maniesta Veyra.',
    url: `${publicEnv.NEXT_PUBLIC_APP_URL}/terms`,
    type: 'website',
  },
};

export default function TermsPage() {
  return (
    <main>
      <section className="bg-mv-dark text-mv-inverse">
        <Container className="py-20 md:py-28">
          <Reveal>
            <PageHeader
              title="Terms & Conditions"
              subtitle="Please read these terms carefully"
            />
          </Reveal>
        </Container>
      </section>

      <Section>
        <Container className="max-w-3xl space-y-10">
          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Account Usage
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                You are responsible for maintaining the confidentiality of your account
                credentials and for all activities that occur under your account. Provide
                accurate and current information and notify us immediately of any unauthorized
                use.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Products and Pricing
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                We strive to display accurate product images, descriptions, and prices.
                However, minor variations may occur. Prices are subject to change without
                notice. All prices are listed in Pakistani Rupees (PKR) unless otherwise stated.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Orders and Payments
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                By placing an order, you agree to pay the total amount shown at checkout.
                We accept Cash on Delivery, bank transfer, and other payment methods as
                displayed. Your order is confirmed only after payment verification (where
                applicable) and stock availability.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Cancellations
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                Orders may be cancelled before they are processed. Custom orders can only be
                cancelled while in PENDING_REVIEW status. Once production begins, cancellation
                is not possible.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Custom Designs and Artwork
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                You retain ownership of the artwork you upload. By submitting a design, you
                grant us a limited license to print it solely for your order. You confirm that
                you have the right to use the artwork and that it does not infringe on any
                third-party rights.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Prohibited Content
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                You may not upload or request printing of content that is unlawful, defamatory,
                obscene, hateful, or infringes on intellectual property rights. We reserve the
                right to refuse any custom order that violates these terms.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Refunds
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                Refund eligibility is described in our Returns Policy. Custom printed items are
                non-refundable except in cases of manufacturing defects or errors on our part.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Liability
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                To the fullest extent permitted by law, Maniesta Veyra shall not be liable for
                indirect or consequential damages arising from the use of our website or
                products. Our total liability is limited to the amount paid for the specific
                product.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Policy Changes
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                We may update these terms from time to time. The latest version will always be
                available on this page. Continued use of our services after changes constitutes
                acceptance of the revised terms.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}