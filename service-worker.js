// Service worker NIMM Chrono
// Permet à l'application de fonctionner même sans connexion internet,
// une fois que la page a été visitée au moins une fois.

const CACHE_VERSION = "2026-06-26";
const CACHE_NAME = "nimm-chrono-cache-" + CACHE_VERSION;
const FILES_TO_CACHE = [
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png"
];

// Installation : on met en cache les fichiers nécessaires
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activation : on supprime les anciens caches si la version change
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Récupération des fichiers : on sert depuis le cache si possible,
// sinon on va chercher sur le réseau (et on met à jour le cache).
self.addEventListener("fetch", (event) => {
  // On ne met jamais en cache les appels vers les API des LLM (Deepseek, Claude, Gemini) :
  // ce sont des appels dynamiques qui doivent toujours passer par le réseau.
  if (
    event.request.url.includes("api.deepseek.com") ||
    event.request.url.includes("api.anthropic.com") ||
    event.request.url.includes("generativelanguage.googleapis.com")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // On met en cache la nouvelle ressource pour la prochaine fois
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      });
    })
  );
});
