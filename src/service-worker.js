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
import { Strategy, CacheFirst } from 'workbox-strategies';
import { createPartialResponse, RangeRequestsPlugin,  } from 'workbox-range-requests';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

class TexliveCacheStrategy extends Strategy {
  async _handle(request, handler) {
    const cache = await caches.open(this.cacheName);
    const cachedResponse = await cache.match(request);

    return cachedResponse || fetch(request).then((async fetchedResponse => {
      if (request.headers.get('range')){
        return await createPartialResponse(request, fetchedResponse)
      }
      await cache.put(request, fetchedResponse.clone());
      return fetchedResponse;
    }))
  }
}

registerRoute(/(pdftex|bibtex|service)-worker.js/, new TexliveCacheStrategy({
  cacheName: 'worker',
}))

registerRoute(/(texlive\/.*)|texlive.lst/, new TexliveCacheStrategy({
  cacheName: 'texlive',
  // plugins: [
  //   new CacheableResponsePlugin({ statuses: [200] }),
  //   new RangeRequestsPlugin()
  // ]
  // plugins: [
  //   {
  //     cacheWillUpdate: async ({ response }) => {
  //       if (response.status === 200) return response;
  //       console.log(response.status,response.headers.get('content-encoding'))
  //       // Content encoding shouldn't be set, or content-type will be inaccurate
  //       if (response.status === 206 && !response.headers.get('content-encoding')) {
  //         const contentLength = parseInt(response.headers.get('content-length'));
  //         if (
  //             `bytes 0-${contentLength - 1}/${contentLength}` ===
  //             response.headers.get('content-range')
  //         ) {
  //           // Convert response from 206 -> 200 to make it cacheable
  //           return new Response(response.body, { status: 200, headers: response.headers });
  //         }
  //       }
  //
  //       return null;
  //     }
  //   }
  // ]
}))

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
