/* el_Szafa — service worker: praca offline (najpierw pamięć podręczna, w tle odświeżenie). */
const CACHE_VERSION = 'el-szafa-v7';
importScripts('library/index.js');

const APP_FILES = [
  './', 'index.html', 'manifest.webmanifest',
  'css/tokens.css', 'css/components.css', 'css/app.css',
  'js/icons.js', 'js/core.js', 'js/cabinet.js', 'js/render-module.js', 'js/ui-common.js',
  'js/ui-canvas.js', 'js/ui-library.js', 'js/ui-panels.js', 'js/bom-print.js', 'js/app.js',
  'library/index.js',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'
].concat((self.EL_SZAFA_LIBRARY_FILES || []).map(f => 'library/' + f));

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_VERSION).then(c => c.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE_VERSION).then(async cache => {
    const hit = await cache.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(res => { if (res && res.ok) cache.put(e.request, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  }));
});
