/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { Strategy } from 'workbox-strategies';
import { createPartialResponse  } from 'workbox-range-requests';
import { CacheExpiration } from 'workbox-expiration';
import {config} from "./config";

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

class TexliveCacheStrategy extends Strategy {
  async _handle(request, handler) {
    const cache = await caches.open(this.cacheName);

    await this.cleanCache();

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
        await this.updateCache(request.url);
        return await createPartialResponse(request, response);
      }
    } else {
      const cachedResponse = await cache.match(request.url);

      return cachedResponse || fetch(request).then((async fetchedResponse => {
        await cache.put(request.url, fetchedResponse.clone());
        await this.updateCache(request.url);
        return fetchedResponse;
      }))
    }
  }

  async updateCache(url){
    const expirationManager = this.plugins[0]
    if (expirationManager){
      await expirationManager.updateTimestamp(url)
    }
  }

  /**
   * clear cache if we reach 90% of storage usage
   * @return {Promise<void>}
   */
  async cleanCache(){
    const expirationManager = this.plugins[0]
    const estimate =  await navigator.storage.estimate()
    const usedSize = parseFloat((estimate.usage / estimate.quota * 100).toFixed(2))
    if (usedSize > config.CACHE_OVERFLOW_PERCENTAGE && expirationManager){
      await expirationManager.expireEntries()
    }
  }

}

registerRoute(/(pdftex|bibtex|service)-worker.js/, new TexliveCacheStrategy({
  cacheName: config.WORKER_CACHE,
  version: config.WORKER_VERSION,
}))

registerRoute(/(texlive\/.*)|texlive.lst/, new TexliveCacheStrategy({
  cacheName: config.TEXLIVE_CACHE,
  version: config.TEXLIVE_VERSION,
  plugins: [
    new CacheExpiration(config.TEXLIVE_CACHE, {
      maxEntries: 128,
    })
  ]
}))

registerRoute(/(texlive\/.*)|texlive.lst/, new TexliveCacheStrategy({
  cacheName: config.TEXLIVE_HEAD_CACHE,
  version: config.TEXLIVE_VERSION,
  plugins: [
    new CacheExpiration(config.TEXLIVE_HEAD_CACHE, {
      maxEntries: 128,
    })
  ]
}))

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  await caches.delete(config.WORKER_CACHE)
  await caches.delete(config.TEXLIVE_CACHE)
  await caches.delete(config.TEXLIVE_HEAD_CACHE)
  console.log("Clean up", config.WORKER_VERSION)
  self.skipWaiting();
})
