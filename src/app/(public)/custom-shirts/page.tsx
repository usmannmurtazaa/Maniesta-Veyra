import { Container, Section, PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Custom Print Studio | Maniesta Veyra',
  description: 'Create your own custom printed shirts. Upload your design, choose garment, and preview before ordering.',
};

export default function CustomShirtsLandingPage() {
  return (
    <>
      <Section className="bg-mv-dark text-mv-inverse">
        <Container className="py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold">Custom Print Studio</h1>
            <p className="mt-4 text-lg text-mv-inverse-muted">
              Wear your identity. Upload your design, position it, and create a shirt that&apos;s truly yours.
            </p>
            <Link href="/customize">
              <Button size="lg" variant="accent" className="mt-8">
                Start Designing <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
      <Section>
        <Container>
          <PageHeader title="How it works" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Choose Garment', desc: 'Select from T-Shirts, Hoodies, Polos, and more.' },
              { step: '2', title: 'Upload Design', desc: 'Upload your artwork in PNG, JPG, SVG, or WebP.' },
              { step: '3', title: 'Preview & Order', desc: 'Position and resize your design, then add to cart.' },
            ].map((item) => (
              <div key={item.step} className="border border-mv-border rounded-lg p-6">
                <p className="text-3xl font-display text-mv-accent">{item.step}</p>
                <h3 className="mt-2 font-semibold">{item.title}</h3>
                <p className="text-sm text-mv-muted mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}