/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts(
  "https://cdn.jsdelivr.net/npm/workbox-sw@4.3.1/build/workbox-sw.min.js"
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "source.60d74768.js",
    "revision": "1fa593e25cd7cda05af320de4d23a1ab"
  },
  {
    "url": "source.96b4d510.css",
    "revision": "0b66451fc358c2235921ee12f9f532a7"
  },
  {
    "url": "wuhan2020-mini.424de3ea.png",
    "revision": "d26fe4c73d47e743fe0be7b8d80408f2"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
