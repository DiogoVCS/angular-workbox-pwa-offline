/// <reference lib="es2018" />
/// <reference lib="webworker" />
import {precacheAndRoute} from 'workbox-precaching';
import {clientsClaim, skipWaiting} from 'workbox-core';
import {registerRoute} from 'workbox-routing';
import {CacheFirst, StaleWhileRevalidate} from 'workbox-strategies';
import {ExpirationPlugin} from 'workbox-expiration';
import {Queue} from 'workbox-background-sync';

const queue = new Queue('myQueue');
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
    ({request}) => request.destination === 'document',
    // Use cache but update in the background.
    new StaleWhileRevalidate({
      // Use a custom cache name.
      cacheName: 'document-cache',
    })
  );

  registerRoute(
    ({request}) => request.destination === 'script',
    new StaleWhileRevalidate({
      // Use a custom cache name.
      cacheName: 'script-cache',
    })
  );

  registerRoute(
    // Cache style resources, i.e. CSS files.
    ({request}) => request.destination === 'style',
    // Use cache but update in the background.
    new StaleWhileRevalidate({
      // Use a custom cache name.
      cacheName: 'css-cache',
    })
  );

  registerRoute(
    // Cache image files.
    ({request}) => request.destination === 'image',
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

  self.addEventListener('fetch', (event) => {
    // Clone the request to ensure it's safe to read when
    // adding to the Queue.
    event.preventDefault();

    if (event.request.method !== 'GET') {
    // if (!navigator.onLine && event.request.method !== 'GET') {
      const promiseChain = fetch(event.request.clone())
        .catch((err) => {
          return queue.pushRequest({request: event.request});
        });
      event.waitUntil(promiseChain);
      return promiseChain;
    }
  });


  /*  const bgSyncPlugin = new BackgroundSyncPlugin('myQueueName', {
      maxRetentionTime: 24 * 60 // Retry for max of 24 Hours (specified in minutes)
    });

    registerRoute(
      /\/api\/reports/,
      new NetworkOnly({
        plugins: [bgSyncPlugin]
      }),
      'POST'
    );
  */
  precacheAndRoute(self.__WB_MANIFEST);
}
