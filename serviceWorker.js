const staticDevMath = "dev-daily-math";
const assets = [
  "/",
  "/index.html",
  "/cheatsheet.html",
  "/style.css",
  "/app.js",
  "/drawing.js",
];

self.addEventListener("install", (installEvent) => {
  let current = new Date().getDate() * 5;

  for (let i = current; i < 31 * 5; i++) {
    assets.push(`images/${i}.png`);
  }

  installEvent.waitUntil(
    caches.open(staticDevMath).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
