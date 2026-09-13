import { Container, Section } from '@/components/layout';
import { SectionHeading } from '@/components/shared/section-heading';

export const metadata = {
  title: 'Privacy Policy | Maniesta Veyra',
  description:
    'How Maniesta Veyra collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Legal"
            title="Privacy policy"
            subtitle="Last updated: December 2025"
          />

          <div className="prose prose-neutral mt-10 max-w-none">
            <p className="text-mv-text-secondary">
              Maniesta Veyra (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your
              privacy. This policy explains what information we collect, how we
              use it, and the choices you have. By using our website you agree
              to this policy.
            </p>

            <h2 className="mt-10 font-display text-xl font-bold text-mv-text">
              Information we collect
            </h2>
            <ul className="mt-3 space-y-2 text-mv-text-secondary list-disc pl-6">
              <li>Account details you provide - name, email, phone number, and password.</li>
              <li>Order details - shipping address, items purchased, and payment method.</li>
              <li>Custom design files you upload to our print studio.</li>
              <li>Technical data - IP address, browser type, and pages visited for analytics.</li>
            </ul>

            <h2 className="mt-10 font-display text-xl font-bold text-mv-text">
              How we use your information
            </h2>
            <ul className="mt-3 space-y-2 text-mv-text-secondary list-disc pl-6">
              <li>To process and ship your orders.</li>
              <li>To send order confirmations, shipping updates, and support responses.</li>
              <li>To improve our website, product range, and shopping experience.</li>
              <li>To detect and prevent fraud.</li>
            </ul>

            <h2 className="mt-10 font-display text-xl font-bold text-mv-text">
              What we do not do
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              We do not sell your personal information to third parties. We do
              not use your uploaded custom designs for marketing without your
              explicit permission.
            </p>

            <h2 className="mt-10 font-display text-xl font-bold text-mv-text">
              Cookies
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              We use cookies to keep you signed in, remember your cart, and
              measure site performance. You can disable cookies in your browser
              settings, though parts of the site may not work correctly if you
              do.
            </p>

            <h2 className="mt-10 font-display text-xl font-bold text-mv-text">
              Data security
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              We use industry-standard security measures to protect your
              information, including encrypted connections (HTTPS) and secure
              password storage. No online system is completely immune to
              attack - if you ever suspect your account is compromised, contact
              us immediately.
            </p>

            <h2 className="mt-10 font-display text-xl font-bold text-mv-text">
              Your rights
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              You can request a copy of the personal data we hold about you, ask
              us to correct it, or ask us to delete it. To do so, email{' '}
              <a href="mailto:maniestaveyra@gmail.com" className="text-mv-accent underline-offset-4 hover:underline">
                maniestaveyra@gmail.com
              </a>
              .
            </p>

            <h2 className="mt-10 font-display text-xl font-bold text-mv-text">
              Changes to this policy
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              We may update this policy from time to time. The date at the top
              of this page reflects the most recent version.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}