// Service worker: deixa o CV Legível funcionando sem internet depois do primeiro acesso.
// - Página (HTML): rede primeiro, para receber atualizações; cache se estiver offline.
// - Arquivos do site (CSS, JS, fontes, ícones): cache primeiro, atualizados quando VERSION muda.
// - Bibliotecas pesadas (jsPDF, pdf.js, fonte Unicode): guardadas no primeiro uso.
// - Lista de cidades do IBGE: rede primeiro, cache como reserva.
// Ao mudar qualquer arquivo listado em SHELL, aumente VERSION (o teste unitário confere a lista).
const VERSION = "v2.2.0";
const CACHE = `cv-legivel-${VERSION}`;

const SHELL = [
  "./",
  "index.html",
  "en/",
  "en/index.html",
  "es/",
  "es/index.html",
  "manifest.webmanifest",
  "en/manifest.webmanifest",
  "es/manifest.webmanifest",
  "assets/css/fonts.css",
  "assets/css/styles.css",
  "assets/icons/icon.svg",
  "assets/icons/icon-192.png",
  "assets/js/boot.js",
  "assets/js/main.js",
  "assets/js/checks.js",
  "assets/js/options.js",
  "assets/js/format.js",
  "assets/js/jobmatch.js",
  "assets/js/model.js",
  "assets/js/pdf.js",
  "assets/js/rules.js",
  "assets/js/state.js",
  "assets/js/i18n/index.js",
  "assets/js/i18n/pt.js",
  "assets/js/i18n/en.js",
  "assets/js/i18n/es.js",
  "assets/js/ui/chrome.js",
  "assets/js/ui/data-io.js",
  "assets/js/ui/dom.js",
  "assets/js/ui/form.js",
  "assets/js/ui/location.js",
  "assets/js/ui/preview.js",
  "assets/js/ui/store.js",
  "assets/js/ui/tools.js",
  "assets/vendor/fonts/ui/bricolage-grotesque-latin-opsz-normal.woff2",
  "assets/vendor/fonts/ui/instrument-sans-latin-wght-normal.woff2",
  "assets/vendor/fonts/ui/ibm-plex-mono-latin-400-normal.woff2",
  "assets/vendor/fonts/ui/ibm-plex-mono-latin-500-normal.woff2"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k.startsWith("cv-legivel-") && k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

const networkFirst = async (req) => {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    return (await cache.match(req, { ignoreSearch: true })) || Response.error();
  }
};

const cacheFirst = async (req) => {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) cache.put(req, res.clone());
  return res;
};

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.hostname === "servicodados.ibge.gov.br") return e.respondWith(networkFirst(req));
  if (url.origin !== location.origin) return;
  if (req.mode === "navigate") return e.respondWith(networkFirst(req));
  e.respondWith(cacheFirst(req));
});
