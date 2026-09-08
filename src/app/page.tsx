import { publicEnv } from '@/lib/env';
import { Footer } from '@/components/layout/footer';
import { Container, Section, PageHeader } from '@/components/layout';

export default function HomePage() {
  return (
    <>
      <main className="min-h-screen flex flex-col">
        <Container className="flex-1 flex flex-col items-center justify-center text-center">
          <Section>
            <PageHeader
              title={publicEnv.NEXT_PUBLIC_APP_NAME}
              subtitle={publicEnv.NEXT_PUBLIC_APP_TAGLINE}
            />
            <p className="mt-6 text-lg text-mv-text-secondary max-w-2xl">
              Premium ready‑made clothing and a custom print studio.
            </p>
          </Section>
        </Container>
      </main>
      <Footer />
    </>
  );
}