/* eslint-disable no-restricted-globals */
// This replaces the service worker that earlier builds registered. Any browser that still has the old,
// cache-first worker installed fetches this file on its next visit, installs it, and this worker then
// clears every cache, unregisters itself, and reloads the open pages so they load the current build.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((c) => c.navigate(c.url));
  })());
});
