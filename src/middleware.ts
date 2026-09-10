import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware performs TWO jobs only:
 *   1. Redirect anonymous users away from auth-only routes.
 *   2. Redirect anonymous users away from admin routes.
 *
 * Role enforcement (ADMIN vs CUSTOMER) is NOT done here — it's done
 * server-side via requireAdmin() in the admin layout and every admin
 * API route. This keeps middleware edge-runtime-only (no Node APIs).
 *
 * Why not getToken()? Auth.js v5's jose dependency imports
 * CompressionStream/DecompressionStream, which the Edge runtime does
 * not expose. On Netlify this causes intermittent 502s on routes that
 * happen to hit the middleware. Cookie-presence is safe and sufficient
 * at the edge; the authoritative check is server-side.
 */

// Auth.js v5 cookie names (dev + production)
const SESSION_COOKIE_NAMES = [
  'authjs.session-token',
  '__Secure-authjs.session-token',
];

const PROTECTED_PREFIXES = ['/account', '/checkout', '/wishlist', '/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) =>
    pathname.startsWith(p)
  );
  if (!isProtected) return NextResponse.next();

  const hasSession = SESSION_COOKIE_NAMES.some((name) =>
    request.cookies.has(name)
  );

  if (!hasSession) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run middleware on everything EXCEPT:
     *   - api routes
     *   - _next assets
     *   - metadata + PWA files
     *   - static fallback pages
     *   - asset folders
     */
    '/((?!api|_next/static|_next/image|favicon.ico|favicon-32.png|favicon-192.png|apple-touch-icon.png|robots.txt|sitemap.xml|manifest.webmanifest|sw.js|offline.html|icons|images).*)',
  ],
};