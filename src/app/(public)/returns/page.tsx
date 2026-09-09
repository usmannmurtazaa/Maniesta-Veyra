import { Container, Section, PageHeader } from '@/components/layout';
import { Reveal } from '@/components/shared/reveal';
import { publicEnv } from '@/lib/env';

export const metadata = {
  title: 'Returns & Exchanges | Maniesta Veyra',
  description:
    'Understand return eligibility, non-returnable items, custom print policies, and the return process for Maniesta Veyra.',
  openGraph: {
    title: 'Returns & Exchanges | Maniesta Veyra',
    description: 'Return and exchange policy for Maniesta Veyra products.',
    url: `${publicEnv.NEXT_PUBLIC_APP_URL}/returns`,
    type: 'website',
  },
};

export default function ReturnsPage() {
  return (
    <main>
      <section className="bg-mv-dark text-mv-inverse">
        <Container className="py-20 md:py-28">
          <Reveal>
            <PageHeader
              title="Returns & Exchanges"
              subtitle="Our commitment to your satisfaction"
            />
          </Reveal>
        </Container>
      </section>

      <Section>
        <Container className="max-w-3xl space-y-10">
          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Return Eligibility
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                Ready-made items may be eligible for return or exchange within a limited period
                after delivery, provided they are unworn, unwashed, and in original packaging
                with tags attached. The exact return window is communicated during checkout
                and in your order confirmation.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Non-Returnable Items
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                For hygiene reasons, certain items such as undergarments and accessories may not
                be returnable. Items marked as final sale or clearance are also non-returnable.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Custom Printed Items
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                Custom printed items are made to order and cannot be returned or exchanged
                unless there is a manufacturing defect or an error on our part. Please review
                your design carefully before ordering.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Damaged or Wrong Items
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                If you receive a damaged or incorrect item, contact our support team within 48
                hours of delivery with photos and your order number. We will arrange a
                replacement or refund as appropriate.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Return Process
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                To initiate a return, contact support with your order details. We will provide
                instructions and a return address. Return shipping costs may be deducted from
                your refund unless the item is defective.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Refunds
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                Once your return is received and inspected, we will process the refund to your
                original payment method. Please allow up to 7–10 business days for the refund
                to appear in your account.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}