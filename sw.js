/* Service worker : l'app s'ouvre instantanément depuis le cache, même sans réseau,
   et se met à jour en arrière-plan pour la prochaine ouverture. */
const CACHE = 'rumbo-bcn-v2';
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
  // Cache d'abord, puis mise à jour du cache en arrière-plan (seulement avec des réponses valides)
  const network = fetch(req).then(async res => {
    if (res.ok) await (await caches.open(CACHE)).put(req, res.clone());
    return res;
  });
  e.waitUntil(network.catch(() => {}));
  e.respondWith(caches.match(req).then(hit => hit || network.catch(() => caches.match('index.html'))));
});
