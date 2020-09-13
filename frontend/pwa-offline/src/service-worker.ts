/// <reference lib="es2018" />
/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching';
import { clientsClaim, skipWaiting } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare const self: ServiceWorkerGlobalScope;

skipWaiting();
clientsClaim();

if (process.env.NODE_ENV === 'production') {
  registerRoute(
    /assets\/images\/icons\/icon-.+\.png$/,
    new CacheFirst({
      cacheName: 'icons',
    })
  );

  registerRoute(
    // Cache style resources, i.e. CSS files.
    ({ request }) => request.destination === 'document',
    // Use cache but update in the background.
    new StaleWhileRevalidate({
      // Use a custom cache name.
      cacheName: 'document-cache',
    })
  );

  registerRoute(
    ({ request }) => request.destination === 'script',
    new StaleWhileRevalidate({
      // Use a custom cache name.
      cacheName: 'script-cache',
    })
  );

  registerRoute(
    // Cache style resources, i.e. CSS files.
    ({ request }) => request.destination === 'style',
    // Use cache but update in the background.
    new StaleWhileRevalidate({
      // Use a custom cache name.
      cacheName: 'css-cache',
    })
  );

  registerRoute(
    // Cache image files.
    ({ request }) => request.destination === 'image',
    // Use the cache if it's available.
    new CacheFirst({
      // Use a custom cache name.
      cacheName: 'image-cache',
      plugins: [
        new ExpirationPlugin({
          // Cache only 20 images.
          maxEntries: 20,
          // Cache for a maximum of a week.
          maxAgeSeconds: 7 * 24 * 60 * 60,
        }),
      ],
    })
  );

  precacheAndRoute(self.__WB_MANIFEST);
}
