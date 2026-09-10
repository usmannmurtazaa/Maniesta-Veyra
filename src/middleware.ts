import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const AUTH_ONLY_PREFIXES = ['/account', '/checkout', '/wishlist'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    // Auth.js v5 defaults to `authjs.session-token`; the helper handles
    // the __Secure- prefix automatically in production.
  });

  // ---------- Auth-only routes ----------
  if (AUTH_ONLY_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (!token) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // ---------- Admin routes (role required) ----------
  if (pathname.startsWith('/admin')) {
    if (!token) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    const role = token.role as string | undefined;
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      // Authenticated but not an admin → send them to their account page
      return NextResponse.redirect(new URL('/account', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|sw.js|icons|images).*)',
  ],
};