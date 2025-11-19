// Minimal service worker for PWA installability
// No caching - just enables install prompt

self.addEventListener('install', (event) => {
  console.log('Service Worker: Install event');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate event');
  // Take control of all clients immediately
  event.waitUntil(self.clients.claim());
});

// Minimal fetch handler - just pass through without caching
self.addEventListener('fetch', (event) => {
  // Just fetch normally, no caching
  event.respondWith(fetch(event.request));
});
