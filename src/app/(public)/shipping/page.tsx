import { Container, Section } from '@/components/layout';
import { SectionHeading } from '@/components/shared/section-heading';
import Link from 'next/link';

export const metadata = {
  title: 'Shipping | Maniesta Veyra',
  description:
    'Shipping information for Maniesta Veyra orders across Pakistan — delivery times, rates, and tracking.',
};

export default function ShippingPage() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Delivery"
            title="Shipping information"
            subtitle="How and when your order arrives."
          />

          <div className="prose prose-neutral mt-10 max-w-none">
            <h2 className="font-display text-2xl font-bold text-mv-text">
              Delivery times
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              We ship across Pakistan using trusted courier partners. Delivery
              times below are estimates from the moment your order is dispatched.
            </p>
            <ul className="mt-4 space-y-2 text-mv-text-secondary">
              <li className="flex gap-3">
                <span className="w-40 shrink-0 font-medium text-mv-text">Karachi, Lahore, Islamabad</span>
                <span>2–3 business days</span>
              </li>
              <li className="flex gap-3">
                <span className="w-40 shrink-0 font-medium text-mv-text">Other major cities</span>
                <span>3–5 business days</span>
              </li>
              <li className="flex gap-3">
                <span className="w-40 shrink-0 font-medium text-mv-text">Remote areas</span>
                <span>5–7 business days</span>
              </li>
              <li className="flex gap-3">
                <span className="w-40 shrink-0 font-medium text-mv-text">Custom printed items</span>
                <span>Add 2–3 days for production</span>
              </li>
            </ul>

            <h2 className="mt-10 font-display text-2xl font-bold text-mv-text">
              Shipping rates
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              Shipping is calculated at checkout based on your city and the
              weight of your order. Exact rates are shown before you confirm
              payment.
            </p>

            <h2 className="mt-10 font-display text-2xl font-bold text-mv-text">
              Order tracking
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              Once your order is dispatched, you will receive a tracking number
              by email and SMS. You can also view order status any time from{' '}
              <Link href="/account/orders" className="text-mv-accent underline-offset-4 hover:underline">
                your account
              </Link>
              .
            </p>

            <h2 className="mt-10 font-display text-2xl font-bold text-mv-text">
              Packaging
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              Orders are packed in recyclable poly mailers with a branded tissue
              wrap. Custom-printed items include a care card with wash
              instructions.
            </p>

            <h2 className="mt-10 font-display text-2xl font-bold text-mv-text">
              Delivery issues
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              If your order has not arrived within the estimated window, or if
              it arrives damaged, contact us at{' '}
              <a href="mailto:orders@maniestaveyra.com" className="text-mv-accent underline-offset-4 hover:underline">
                orders@maniestaveyra.com
              </a>{' '}
              with your order number and we will make it right.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}