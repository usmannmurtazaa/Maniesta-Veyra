import { cookies } from 'next/headers';

const GUEST_SESSION_COOKIE = 'mv_guest_session';

export function getGuestSessionId(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get(GUEST_SESSION_COOKIE)?.value;
}

export function setGuestSessionCookie(sessionId: string) {
  const cookieStore = cookies();
  cookieStore.set(GUEST_SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });
}

export function clearGuestSessionCookie() {
  const cookieStore = cookies();
  cookieStore.set(GUEST_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}