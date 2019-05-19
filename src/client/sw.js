/* global caches fetch skipWaiting */

const cacheName = '#sw-cache-string#',
    origin = '#sw-origin#';

this.addEventListener(
    'install',
    event => {
        event.waitUntil(
            caches.open(cacheName)
                .then(
                    cache => cache.addAll(
                        [
                            origin,
                            origin + 'index.html',
                            origin + 'styles/styles.css',
                            origin + 'scripts/app.js',
                            origin + 'images/pexels-photo-64778.jpg',
                            origin + 'fonts/OpenSans-Bold.ttf',
                            origin + 'fonts/OpenSans-Regular.ttf',
                            origin + 'fonts/fontawesome-webfont.woff2',
                            origin + 'icons/launcher-icon-1x.png',
                            origin + 'icons/launcher-icon-2x.png',
                            origin + 'icons/launcher-icon-4x.png',
                            origin + 'manifest.json',
                            origin + 'favicon.ico',
                            origin + 'configs'
                        ]
                    )
                )
                .catch(
                    err => {
                        console.log(err);
                    }
                )
        );
    });

this.addEventListener(
    'fetch',
    event => {
        const urlWithoutQueryParams = event.request.url.split('?')[0];

        event.respondWith(
            caches.match(urlWithoutQueryParams)
                .then(
                    response => {
                        if (response) {
                            return response;
                        }

                        return fetch(event.request);
                    }
                )
        );
    }
);

this.addEventListener(
    'activate',
    event => {
        event.waitUntil(
            caches.keys()
                .then(
                    keyList => Promise.all(
                        keyList.map(
                            key => {
                                if (key !== cacheName) {
                                    return caches.delete(key);
                                } else {
                                    return null;
                                }
                            }
                        )
                    )
                )
        );
    }
);

this.addEventListener(
    'message',
    messageEvent => {
        if (messageEvent.data === 'skipWaiting') {
            return skipWaiting();
        } else {
            return null;
        }
    }
);
