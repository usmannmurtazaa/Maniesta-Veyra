import { Container, Section } from '@/components/layout';
import { SectionHeading } from '@/components/shared/section-heading';

export const metadata = {
  title: 'Terms of Service | Maniesta Veyra',
  description:
    'Terms and conditions for shopping with and using the Maniesta Veyra website.',
};

export default function TermsPage() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Legal"
            title="Terms of service"
            subtitle="Last updated: September 2026"
          />

          <div className="prose prose-neutral mt-10 max-w-none">
            <p className="text-mv-text-secondary">
              These terms govern your use of the Maniesta Veyra website and any
              purchase you make through it. By using the site you agree to them.
            </p>

            <h2 className="mt-10 font-display text-xl font-bold text-mv-text">
              1. Your account
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              You are responsible for keeping your account password secure and
              for any activity that happens under your account. If you believe
              your account has been compromised, contact us immediately.
            </p>

            <h2 className="mt-10 font-display text-xl font-bold text-mv-text">
              2. Orders and pricing
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              All prices are listed in Pakistani Rupees (PKR) and include
              applicable taxes unless stated otherwise. We reserve the right to
              cancel an order if a product is out of stock, if a pricing error
              has occurred, or if we suspect fraud. If we cancel your order, we
              will notify you and any payment made will be refunded in full.
            </p>

            <h2 className="mt-10 font-display text-xl font-bold text-mv-text">
              3. Shipping
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              Delivery times shown on the site are estimates. We are not
              responsible for delays caused by courier partners, weather, or
              circumstances outside our control.
            </p>

            <h2 className="mt-10 font-display text-xl font-bold text-mv-text">
              4. Returns
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              Returns are governed by our Returns & Exchanges policy. Custom -
              printed items cannot be returned unless defective. Please review
              the design carefully in the customizer before ordering.
            </p>

            <h2 className="mt-10 font-display text-xl font-bold text-mv-text">
              5. Custom designs
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              By uploading a design to our custom print studio, you confirm
              that you own the rights to the artwork or have permission from the
              rights holder to have it printed. You agree not to upload
              content that is:
            </p>
            <ul className="mt-3 space-y-2 text-mv-text-secondary list-disc pl-6">
              <li>Infringing on anyone else&rsquo;s intellectual property.</li>
              <li>Hateful, threatening, defamatory, or obscene.</li>
              <li>Illegal in Pakistan or the country where the item ships.</li>
            </ul>
            <p className="mt-3 text-mv-text-secondary">
              We reserve the right to refuse to print any order that violates
              these rules.
            </p>

            <h2 className="mt-10 font-display text-xl font-bold text-mv-text">
              6. Website use
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              You agree not to abuse the site - including attempts to breach
              security, scrape pricing or inventory, place fraudulent orders, or
              interfere with other users. Accounts that violate these terms may
              be suspended.
            </p>

            <h2 className="mt-10 font-display text-xl font-bold text-mv-text">
              7. Intellectual property
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              All content on this site - including the brand name, logos,
              product photography, and copy - is owned by Maniesta Veyra unless
              stated otherwise. You may not reuse it without permission.
            </p>

            <h2 className="mt-10 font-display text-xl font-bold text-mv-text">
              8. Liability
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              Our liability for any order is limited to the amount you paid for
              that order. We are not liable for indirect losses such as
              missed opportunities or consequential damages.
            </p>

            <h2 className="mt-10 font-display text-xl font-bold text-mv-text">
              9. Changes to these terms
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              We may update these terms from time to time. The date at the top
              of this page reflects the most recent version. Continuing to use
              the site after changes means you accept them.
            </p>

            <h2 className="mt-10 font-display text-xl font-bold text-mv-text">
              10. Contact
            </h2>
            <p className="mt-3 text-mv-text-secondary">
              Questions about these terms? Email{' '}
              <a href="mailto:maniestaveyra@gmail.com" className="text-mv-accent underline-offset-4 hover:underline">
                maniestaveyra@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}