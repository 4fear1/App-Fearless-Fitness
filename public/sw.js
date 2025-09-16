// This is a basic service worker
// It doesn't do much, just the minimum to be detected as a PWA

self.addEventListener('fetch', (event) => {
  // We are not caching anything in this basic service worker
  // We just want the app to be installable
  event.respondWith(fetch(event.request));
});
