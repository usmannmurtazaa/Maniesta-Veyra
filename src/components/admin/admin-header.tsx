import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth/auth';

export function AdminHeader() {
  return (
    <header className="bg-mv-dark text-white border-b border-mv-border-dark">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="font-display text-lg font-bold">
            Maniesta Veyra Admin
          </Link>
          <span className="text-xs text-mv-inverse-muted hidden sm:inline">Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-mv-inverse-muted hover:text-white">
              View Store
            </Button>
          </Link>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/auth/login' });
            }}
          >
            <Button type="submit" variant="outline" size="sm">
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}