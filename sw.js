import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("fetch", (event) => {
  if (
    event.request.url.includes(
      "https://ruetta-bucket.s3.eu-north-1.amazonaws.com/"
    )
  ) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((response) => {
            return caches.open("dynamic-cache").then((cache) => {
              cache.put(event.request.url, response.clone());
              return response;
            });
          })
        );
      })
    );
  }
});