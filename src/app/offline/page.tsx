import Link from 'next/link';
import { WifiOff } from 'lucide-react';
import { Container } from '@/components/layout';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Offline | Maniesta Veyra',
  robots: { index: false, follow: false },
};

// Force static so it can be precached
export const dynamic = 'force-static';

export default function OfflinePage() {
  return (
    <Container className="py-24 text-center">
      <WifiOff className="mx-auto h-16 w-16 text-mv-muted" aria-hidden="true" />
      <h1 className="mt-6 font-display text-3xl font-bold text-mv-text">
        You&rsquo;re offline
      </h1>
      <p className="mt-3 text-mv-text-secondary max-w-md mx-auto">
        Check your internet connection and try again. Your cart and account are safe.
      </p>
      <Link href="/" className="inline-block mt-8">
        <Button variant="accent" size="lg">
          Try again
        </Button>
      </Link>
    </Container>
  );
}