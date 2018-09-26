workbox.skipWaiting();
workbox.clientsClaim();
workbox.routing.registerNavigationRoute('index.html', {
    //whitelist: [/^(?!\/__).*/],
    blacklist: [/\.(js|json|html|css|ico|jpe?g|png|svg|mp4|webm|vtt|md)$/],
});
workbox.precaching.precacheAndRoute(self.__precacheManifest);
