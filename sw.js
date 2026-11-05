/* Service worker : permet d'utiliser l'app hors connexion une fois installée (réseau d'abord, cache en secours). */
const CACHE = 'rumbo-bcn-v1';
const ASSETS = [
  './', 'index.html', 'css/style.css', 'manifest.webmanifest', 'icon.svg',
  'js/util.js', 'js/store.js', 'js/data/vocab.js', 'js/data/grammar.js', 'js/data/dialogues.js', 'js/data/daily.js',
  'js/conjugator.js', 'js/srs.js', 'js/speech.js', 'js/session.js', 'js/views.js', 'js/app.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })
      .catch(() => caches.match(req).then(r => r || caches.match('index.html')))
  );
});
