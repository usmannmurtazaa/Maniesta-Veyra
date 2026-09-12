import type { Metadata } from 'next';
import { requireAuth } from '@/lib/auth/guards';
import { AccountSidebar } from '@/components/account/account-sidebar';
import { Container } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Account',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <Container className="py-6 md:py-8">
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        <aside className="w-full shrink-0 md:w-56 lg:w-64">
          <AccountSidebar />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </Container>
  );
}