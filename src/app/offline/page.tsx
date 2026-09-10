import { Container } from '@/components/layout';

export default function OfflinePage() {
  return (
    <Container className="py-32 text-center">
      <h1 className="font-display text-3xl font-bold text-mv-text">
        You&apos;re Offline
      </h1>
      <p className="mt-4 text-mv-text-secondary">
        Please check your internet connection and try again.
      </p>
    </Container>
  );
}