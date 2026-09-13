import { Container, Section } from '@/components/layout';
import { SectionHeading } from '@/components/shared/section-heading';
import Link from 'next/link';

export const metadata = {
  title: 'FAQ | Maniesta Veyra',
  description:
    'Answers to common questions about orders, sizing, shipping, returns, and custom printing.',
};

const FAQ_SECTIONS = [
  {
    title: 'Orders & Payment',
    questions: [
      {
        q: 'How do I place an order?',
        a: 'Browse the shop, select a product, choose your size and color, and add it to your cart. When you are ready, head to checkout and choose your preferred payment method. We accept cash on delivery and bank transfer across Pakistan.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept Cash on Delivery (COD) and Bank Transfer. Online card payments are coming soon. If you need a different arrangement, contact us and we will work with you.',
      },
      {
        q: 'Can I modify or cancel my order?',
        a: 'You can cancel a pending order from your account before it enters processing. Once production has started, orders can no longer be cancelled. Reach out to us as soon as possible if you need to make a change.',
      },
    ],
  },
  {
    title: 'Sizing & Fit',
    questions: [
      {
        q: 'What sizes do you offer?',
        a: 'Drop shoulder shirts are available in S, M, L, XL, and XXL, depending on the design. Size availability is shown on each product page.',
      },
      {
        q: 'How do I know my size?',
        a: 'Our drop shoulder shirts have a relaxed fit. If you normally wear M in a regular-fit tee, we recommend the same size for drop shoulder pieces - the shoulder seam sits lower by design. If you prefer an even looser fit, size up.',
      },
      {
        q: 'Do the shirts shrink after washing?',
        a: 'Our shirts are pre-shrunk, but a small amount of shrinkage is normal with cotton. To keep the fit and color stable, wash cold and air dry when possible.',
      },
    ],
  },
  {
    title: 'Shipping & Delivery',
    questions: [
      {
        q: 'How long does delivery take?',
        a: 'We ship across Pakistan with delivery typically within 3–5 business days. Larger cities are usually faster.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Not yet. We currently ship within Pakistan. If you would like to order from outside Pakistan, contact us and we will try to help.',
      },
      {
        q: 'How much does shipping cost?',
        a: 'Shipping is calculated at checkout. Orders over a threshold ship free — the exact threshold is shown in your cart.',
      },
    ],
  },
  {
    title: 'Returns & Exchanges',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'Unworn items can be exchanged within 14 days of delivery. Please keep the tags attached and the packaging intact. Custom-printed items cannot be returned unless there is a printing defect.',
      },
      {
        q: 'How do I start an exchange?',
        a: 'Contact us at maniestaveyra@gmail.com with your order number and a short description of the issue. We will guide you through the next steps.',
      },
    ],
  },
  {
    title: 'Custom Print Studio',
    questions: [
      {
        q: 'What can I print on a shirt?',
        a: 'You can upload your own artwork - logos, illustrations, photos, or text. We print using direct-to-garment (DTG) for small runs and screen printing for larger orders.',
      },
      {
        q: 'Is there a minimum order for custom printing?',
        a: 'No. You can order a single custom shirt if you want. Volume discounts apply automatically for orders of 10 or more.',
      },
      {
        q: 'Can I preview my design before ordering?',
        a: 'Yes. Our customizer lets you upload your design, position it on the shirt, and see a live preview before you add it to your cart.',
      },
      {
        q: 'Do custom-printed shirts take longer to ship?',
        a: 'Yes — custom orders go through a review step before production. Expect 5–7 business days for custom items, plus shipping time.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Support"
            title="Frequently asked questions"
            subtitle="Everything you need to know about ordering, sizing, shipping, and custom printing."
          />

          <div className="mt-12 space-y-12">
            {FAQ_SECTIONS.map((section) => (
              <div key={section.title}>
                <h2 className="font-display text-2xl font-bold text-mv-text">
                  {section.title}
                </h2>
                <div className="mt-6 divide-y divide-mv-border border-y border-mv-border">
                  {section.questions.map((item) => (
                    <details key={item.q} className="group py-5">
                      <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-medium text-mv-text list-none">
                        {item.q}
                        <span
                          aria-hidden
                          className="shrink-0 text-mv-muted transition-transform group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-mv-text-secondary">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-lg border border-mv-border bg-mv-bg-alt p-6 text-center">
            <h3 className="font-display text-xl font-bold text-mv-text">
              Still need help?
            </h3>
            <p className="mt-2 text-sm text-mv-text-secondary">
              Our team is happy to answer any question we have not covered here.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-block text-sm font-medium text-mv-accent underline-offset-4 hover:underline"
            >
              Contact us →
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}