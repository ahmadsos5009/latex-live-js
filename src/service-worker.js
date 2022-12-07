/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { Strategy } from 'workbox-strategies';
import { createPartialResponse  } from 'workbox-range-requests';
import { ExpirationPlugin } from 'workbox-expiration';

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

class TexliveCacheStrategy extends Strategy {
  async _handle(request, handler) {
    const cache = await caches.open(this.cacheName);

    /**
     * will cache full data of range request to use it later for partial response
     */
    if (request.headers.get('range')) {
      const cachedPartialResponse = await cache.match(request.url);
      if (cachedPartialResponse){
        return await createPartialResponse(request, cachedPartialResponse)
      } else {
        const response = await fetch(request.url);
        await cache.put(request.url, response.clone())
        return await createPartialResponse(request, response);
      }
    } else {
      const cachedResponse = await cache.match(request.url);

      return cachedResponse || fetch(request).then((async fetchedResponse => {
        await cache.put(request.url, fetchedResponse.clone());
        return fetchedResponse;
      }))
    }
  }
}

registerRoute(/(pdftex|bibtex|service)-worker.js/, new TexliveCacheStrategy({
  cacheName: 'worker',
}))

registerRoute(/(texlive\/.*)|texlive.lst/, new TexliveCacheStrategy({
  cacheName: 'texlive',
  plugins: [
      new ExpirationPlugin({maxEntries: 2})
  ]
}))

registerRoute(/(texlive\/.*)|texlive.lst/, new TexliveCacheStrategy({
  cacheName: 'texlive-head',
  plugins: [
    new ExpirationPlugin({maxEntries: 2})
  ]
}), 'HEAD')

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
