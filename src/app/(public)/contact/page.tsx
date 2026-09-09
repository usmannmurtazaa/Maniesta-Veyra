import { Container, Section, PageHeader } from '@/components/layout';
import { Reveal } from '@/components/shared/reveal';
import { Button } from '@/components/ui/button';
import { ContactForm } from '@/components/contact/contact-form';
import { ContactPageJsonLd } from '@/components/seo/contact-page-json-ld';
import Link from 'next/link';
import { publicEnv } from '@/lib/env';
import { getServerEnv } from '@/lib/env';

export const metadata = {
  title: 'Contact Maniesta Veyra | Get in Touch',
  description:
    'Contact Maniesta Veyra for support, custom order inquiries, or feedback. We’d love to hear from you.',
  openGraph: {
    title: 'Contact Maniesta Veyra',
    description: 'Get in touch with our team for support and custom print inquiries.',
    url: `${publicEnv.NEXT_PUBLIC_APP_URL}/contact`,
    type: 'website',
  },
};

export default function ContactPage() {
  const serverEnv = getServerEnv();
  const supportEmail = serverEnv.EMAIL_FROM;

  return (
    <>
      <ContactPageJsonLd />
      <main>
        {/* Hero */}
        <section className="bg-mv-dark text-mv-inverse">
          <Container className="py-20 md:py-28 text-center">
            <Reveal>
              <PageHeader
                title="Get in Touch"
                subtitle="Questions, custom orders, or feedback — we’re here to help."
              />
            </Reveal>
          </Container>
        </section>

        <Section>
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <Reveal>
                <div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-mv-text">
                    Send us a message
                  </h2>
                  <p className="mt-3 text-mv-text-secondary">
                    Fill out the form and our team will respond within 24–48 hours.
                  </p>
                  <div className="mt-6">
                    <ContactForm />
                  </div>
                </div>
              </Reveal>

              {/* Contact info & quick links */}
              <Reveal delay={0.1}>
                <div className="space-y-8">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-mv-text">
                      Contact Information
                    </h2>
                    <div className="mt-4 space-y-2 text-mv-text-secondary">
                      {supportEmail && (
                        <p>
                          <strong>Email:</strong> <a href={`mailto:${supportEmail}`} className="hover:text-mv-accent">{supportEmail}</a>
                        </p>
                      )}
                      <p>
                        <strong>Hours:</strong> Monday – Saturday, 10:00 AM – 7:00 PM (PKT)
                      </p>
                    </div>
                  </div>

                  <div>
                    <h2 className="font-display text-2xl font-bold text-mv-text">
                      Quick Help
                    </h2>
                    <p className="mt-2 text-mv-text-secondary">
                      Have a question about orders, shipping, or custom printing? Check our FAQ page.
                    </p>
                    <Link href="/faq" className="inline-block mt-4">
                      <Button variant="outline">Visit FAQ</Button>
                    </Link>
                  </div>

                  <div>
                    <h2 className="font-display text-2xl font-bold text-mv-text">
                      Explore Maniesta Veyra
                    </h2>
                    <div className="mt-4 flex flex-wrap gap-4">
                      <Link href="/shop">
                        <Button variant="accent">Shop Collection</Button>
                      </Link>
                      <Link href="/custom-shirts">
                        <Button variant="outline">Custom Print Studio</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </Container>
        </Section>
      </main>
    </>
  );
}