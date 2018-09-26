workbox.skipWaiting();
workbox.clientsClaim();
//workbox.routing.registerNavigationRoute('index.html', {
//    whitelist: [/^(?!\/__).*/],
//});
workbox.routing.registerNavigationRoute('index.html');
workbox.precaching.precacheAndRoute(self.__precacheManifest);
