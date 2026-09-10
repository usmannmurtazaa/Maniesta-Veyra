import { cookies } from 'next/headers';

const GUEST_SESSION_COOKIE = 'mv_guest_session';

export async function getGuestSessionId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(GUEST_SESSION_COOKIE)?.value;
}

export async function setGuestSessionCookie(sessionId: string) {
  const cookieStore = await cookies();
  cookieStore.set(GUEST_SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });
}

export async function clearGuestSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(GUEST_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}