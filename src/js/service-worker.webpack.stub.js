workbox.skipWaiting();
workbox.clientsClaim();
workbox.routing.registerNavigationRoute('index.html', {
    whitelist: [/^(?!\/__).*/],
});
workbox.precaching.precacheAndRoute(self.__precacheManifest);
