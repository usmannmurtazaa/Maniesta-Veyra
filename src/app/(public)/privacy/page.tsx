import { Container, Section, PageHeader } from '@/components/layout';
import { Reveal } from '@/components/shared/reveal';
import { publicEnv } from '@/lib/env';

export const metadata = {
  title: 'Privacy Policy | Maniesta Veyra',
  description:
    'How Maniesta Veyra collects, uses, protects, and manages your personal information.',
  openGraph: {
    title: 'Privacy Policy | Maniesta Veyra',
    description: 'Privacy practices of Maniesta Veyra.',
    url: `${publicEnv.NEXT_PUBLIC_APP_URL}/privacy`,
    type: 'website',
  },
};

export default function PrivacyPage() {
  return (
    <main>
      <section className="bg-mv-dark text-mv-inverse">
        <Container className="py-20 md:py-28">
          <Reveal>
            <PageHeader
              title="Privacy Policy"
              subtitle="Your privacy and trust matter to us"
            />
          </Reveal>
        </Container>
      </section>

      <Section>
        <Container className="max-w-3xl space-y-10">
          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Information We Collect
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                We collect personal information you provide during account creation, order
                placement, and custom design upload, including name, email, phone, shipping
                address, and payment details. Payment information is processed securely by our
                payment providers and is not stored on our servers.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                How We Use Your Data
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                We use your data to process orders, communicate about your purchases, improve
                our services, and comply with legal obligations. We do not sell your personal
                data to third parties.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Custom Artwork and Uploads
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                Designs you upload for custom printing are stored securely and used solely for
                fulfilling your order. We do not use your artwork for marketing or any other
                purpose without your explicit permission.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Cookies and Analytics
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                We use cookies and analytics tools (such as Google Analytics) to understand
                how visitors interact with our site, improve performance, and enhance user
                experience. You can control cookie preferences through your browser settings.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Communications
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                We may send transactional emails about your orders, as well as occasional
                marketing communications if you have opted in. You can unsubscribe from
                marketing emails at any time.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Data Security
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                We implement appropriate technical and organizational measures to protect your
                personal data against unauthorized access, alteration, or disclosure.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Data Retention
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                We retain personal information only as long as necessary to fulfil the purposes
                described in this policy or as required by law. You may request deletion of your
                account and associated data at any time.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Your Rights
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                You have the right to access, correct, update, or delete your personal data,
                and to object to or restrict certain processing. To exercise these rights,
                contact us using the details on our Contact page.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
                Contact Us
              </h2>
              <p className="mt-3 text-mv-text-secondary">
                If you have any questions about this Privacy Policy or how we handle your data,
                please reach out via our contact page or the support email provided there.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}