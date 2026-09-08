import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Cookie names used by NextAuth v5 (dev vs production)
const AUTH_COOKIE_NAMES = [
  'next-auth.session-token',
  '__Secure-next-auth.session-token',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes that require an authenticated session
  const protectedPaths = ['/account', '/checkout', '/wishlist', '/admin'];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected) {
    const hasSessionCookie = AUTH_COOKIE_NAMES.some((name) =>
      request.cookies.has(name)
    );

    if (!hasSessionCookie) {
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icons|images).*)'],
};