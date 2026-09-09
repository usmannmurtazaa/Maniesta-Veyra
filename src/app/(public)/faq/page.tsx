import { Container, Section, PageHeader } from '@/components/layout';
import { Reveal } from '@/components/shared/reveal';
import { Accordion } from '@/components/shared/accordion';
import { FaqJsonLd } from '@/components/seo/faq-json-ld';
import { publicEnv } from '@/lib/env';

export const metadata = {
  title: 'FAQ | Maniesta Veyra',
  description:
    'Frequently asked questions about orders, shipping, returns, payments, custom print studio, and more.',
  openGraph: {
    title: 'FAQ | Maniesta Veyra',
    description: 'Answers to common questions about Maniesta Veyra.',
    url: `${publicEnv.NEXT_PUBLIC_APP_URL}/faq`,
    type: 'website',
  },
};

const faqSections = [
  {
    category: 'Orders',
    questions: [
      {
        question: 'How do I place an order?',
        answer:
          'Browse our store or Custom Print Studio, add items to your cart, and proceed to checkout. Follow the steps to enter your shipping details and select a payment method.',
      },
      {
        question: 'Can I modify my order after placing it?',
        answer:
          'Modifications are possible only before the order enters processing. Contact support as soon as possible for assistance.',
      },
    ],
  },
  {
    category: 'Shipping',
    questions: [
      {
        question: 'How long does delivery take?',
        answer:
          'Ready-made items usually arrive in 2–7 business days. Custom orders require additional production time (3–5 business days) before shipping.',
      },
      {
        question: 'Do you offer tracking?',
        answer:
          'Yes, tracking details are shared via email or SMS once your order has shipped.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    questions: [
      {
        question: 'Can I return a custom printed item?',
        answer:
          'Custom printed items are made to order and cannot be returned unless there is a manufacturing defect or error on our part.',
      },
      {
        question: 'What is the return window for ready-made items?',
        answer:
          'Ready-made items can be returned within the period stated in your order confirmation, provided they are unworn and in original packaging.',
      },
    ],
  },
  {
    category: 'Payments',
    questions: [
      {
        question: 'What payment methods do you accept?',
        answer:
          'We accept Cash on Delivery and bank transfer. Online payment may be available depending on your location.',
      },
      {
        question: 'Is my payment information secure?',
        answer:
          'Yes, all payment information is processed securely by our payment partners and is never stored on our servers.',
      },
    ],
  },
  {
    category: 'Custom Print Studio',
    questions: [
      {
        question: 'How does the custom print studio work?',
        answer:
          'Choose a garment, color, and size, then upload your design. Use the editor to position and resize it, preview the result, and add to cart.',
      },
      {
        question: 'Can I use multiple print locations?',
        answer:
          'Yes, you can select front, back, left sleeve, or right sleeve, and upload different artwork for each location.',
      },
    ],
  },
  {
    category: 'Artwork/Uploads',
    questions: [
      {
        question: 'What file formats are accepted?',
        answer: 'We accept PNG, JPG, JPEG, WEBP, and SVG files up to 10 MB.',
      },
      {
        question: 'Do you check my design before printing?',
        answer:
          'Yes, our team reviews all custom designs before production. If there are issues, we will contact you.',
      },
    ],
  },
  {
    category: 'Products & Sizing',
    questions: [
      {
        question: 'How do I find my size?',
        answer:
          'Refer to the size guide on each product page. If you are between sizes, we recommend choosing the larger size.',
      },
      {
        question: 'Are the colors accurate?',
        answer:
          'We strive to display colors as accurately as possible, but minor variations may occur due to monitor settings.',
      },
    ],
  },
  {
    category: 'Account',
    questions: [
      {
        question: 'How do I create an account?',
        answer:
          'Click on "Account" in the navigation and choose "Register". Fill in your details and verify your email.',
      },
      {
        question: 'Can I order without an account?',
        answer:
          'Yes, guest checkout is available. However, creating an account lets you track orders and save addresses.',
      },
    ],
  },
];

export default function FaqPage() {
  const allQuestions = faqSections.flatMap((section) => section.questions);

  return (
    <>
      <FaqJsonLd items={allQuestions} />
      <main>
        <section className="bg-mv-dark text-mv-inverse">
          <Container className="py-20 md:py-28">
            <Reveal>
              <PageHeader
                title="Frequently Asked Questions"
                subtitle="Find answers to common questions"
              />
            </Reveal>
          </Container>
        </section>

        <Section>
          <Container className="space-y-12">
            {faqSections.map((section) => (
              <Reveal key={section.category}>
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text mb-4">
                    {section.category}
                  </h2>
                  <Accordion items={section.questions} />
                </div>
              </Reveal>
            ))}
          </Container>
        </Section>
      </main>
    </>
  );
}