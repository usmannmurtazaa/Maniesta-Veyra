// Self-destruct service worker.
// The real SW is at /service-worker.js (Serwist-generated).
// This file exists ONLY to unregister the legacy /sw.js registration.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.registration.unregister().then(() =>
      self.clients.matchAll({ type: 'window' }).then((clients) =>
        clients.forEach((client) => client.navigate(client.url))
      )
    )
  );
});