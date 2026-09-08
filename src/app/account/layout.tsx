import { requireAuth } from '@/lib/auth/guards';
import { AccountSidebar } from '@/components/account/account-sidebar';
import { Container } from '@/components/layout';

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <Container className="py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <AccountSidebar />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </Container>
  );
}