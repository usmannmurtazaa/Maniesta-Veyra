import { Container, Section } from '@/components/layout';
import { SectionHeading } from '@/components/shared/section-heading';
import Link from 'next/link';

export const metadata = {
  title: 'Returns & Exchanges | Maniesta Veyra',
  description:
    'Return and exchange policy for Maniesta Veyra orders - including custom-printed items.',
};

export default function ReturnsPage() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Policy"
            title="Returns & exchanges"
            subtitle="We want you to be happy with what you receive."
          />

          <div className="prose prose-neutral mt-10 max-w-none">
            <h2 className="font-display text-2xl font-bold text-mv-text">
              Standard returns
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              Ready-made items can be exchanged within <strong>14 days</strong>{' '}
              of delivery if they are unworn, unwashed, and still have the
              original tags attached. We do not offer cash refunds at this time -
              exchanges or store credit only.
            </p>

            <h2 className="mt-10 font-display text-2xl font-bold text-mv-text">
              Custom-printed items
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              Custom-printed products are made specifically for you and cannot
              be returned or exchanged unless there is a printing or
              manufacturing defect. Please review your design carefully in the
              customizer before adding it to your cart.
            </p>
            <p className="mt-3 text-mv-text-secondary">
              If you receive a custom item with a defect, contact us within 7
              days of delivery with photos of the issue and we will reprint it
              at no cost.
            </p>

            <h2 className="mt-10 font-display text-2xl font-bold text-mv-text">
              Defective or incorrect items
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              If your item arrives damaged, misprinted, or is not what you
              ordered, contact us within 7 days of delivery. We will cover the
              cost of return shipping and send a replacement.
            </p>

            <h2 className="mt-10 font-display text-2xl font-bold text-mv-text">
              How to start a return
            </h2>
            <ol className="mt-4 space-y-2 text-mv-text-secondary list-decimal pl-6">
              <li>Email us at <a href="mailto:maniestaveyra@gmail.com" className="text-mv-accent underline-offset-4 hover:underline">maniestaveyra@gmail.com</a> within the return window.</li>
              <li>Include your order number and a brief reason for the return.</li>
              <li>Wait for our confirmation - we will send you the return address and instructions.</li>
              <li>Ship the item back within 7 days of confirmation.</li>
            </ol>

            <h2 className="mt-10 font-display text-2xl font-bold text-mv-text">
              Return shipping
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              Return shipping for customer-initiated exchanges is paid by the
              customer. For defective or incorrect items, we cover the cost and
              will send a prepaid shipping label.
            </p>

            <h2 className="mt-10 font-display text-2xl font-bold text-mv-text">
              Sale items
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              Items purchased at a discount are eligible for exchange but not
              refunded in cash, unless they arrive defective.
            </p>

            <p className="mt-10 text-sm text-mv-text-secondary">
              Still have a question? Visit our{' '}
              <Link href="/faq" className="text-mv-accent underline-offset-4 hover:underline">
                FAQ
              </Link>{' '}
              or{' '}
              <Link href="/contact" className="text-mv-accent underline-offset-4 hover:underline">
                contact us
              </Link>
              .
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}