/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { Strategy } from 'workbox-strategies';

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

class TexliveCacheStrategy extends Strategy {
  async _handle(request, handler) {
    const cache = await caches.open(this.cacheName);
    const cachedResponse = await cache.match(request);

    if (request.headers.has('range')) {
      return handler.fetch(request);
    }

    return cachedResponse || fetch(request).then((fetchedResponse => {
      cache.put(request, fetchedResponse.clone());
      return fetchedResponse;
    }))
  }
}

registerRoute(/(pdftex|bibtex|service)-worker.js/, new TexliveCacheStrategy({
  cacheName: 'worker',
}))

registerRoute(/(texlive\/.*)|texlive.lst/, new TexliveCacheStrategy({
  cacheName: 'texlive',
}))

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
