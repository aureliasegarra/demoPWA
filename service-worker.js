const cacheName = 'veille-techno-1.2';

self.addEventListener('install', event => {
    console.log('install event', event);
    const cachePromise = caches.open(cacheName).then(cache => {
        return cache.addAll([
            'index.html', 
            'main.js',
            'vendors/bootstrap4.min.css',
            'contact.html',
            'contact.js',
            'add_techno.html',
            'add_techno.js'
        ]);
    });

    // ensure that the service worker remains active
    event.waitUntil(cachePromise);
});

self.addEventListener('activate', event => {
    console.log('activate', event);
    // Delete old cache instances
    let cacheCleanedPromise = caches.keys().then(keys => {
        keys.forEach(key => {
            if(key !== cacheName) {
                caches.delete(key);
            }
        })
    });
    event.waitUntil(cacheCleanedPromise);
});

self.addEventListener('fetch', event => {
    /*
    if (!navigator.online) {
        const headers = { headers: { 'content-Type': 'text/html;charset=utf-8'}};
        event.respondWith(new Response('<h1>No network connection</h1><div>Application en mode dégradé. Veuillez vous connecter !</div>', headers));
    }
    */

    /*
    // Strategy cache only => Cache with network fallback
    event.respondWith(
        caches.match(event.request).then(res => {
            if(res) {
                console.log(`fetched url from cache ${event.request.url}`, res);
                return res;
            } 
            return fetch(event.request).then(newResponse => {
                console.log(`fetched url from network then put in the cache ${event.request.url}`, newResponse);
                caches.open(cacheName).then(cache => cache.put(event.request, newResponse));
                return newResponse.clone();
            })
        })
    );
    */

    // Strategy network first => cache fallback
    event.respondWith(
        fetch(event.request).then(res => {
            console.log(`${event.request.url} fetched form network`);
            caches.open(cacheName).then(cache => cache.put(event.request, res));
            return res.clone();
        }).catch(error => {
            console.log(`${event.request.url} fetched form cache`);
            return caches.match(event.request)
        })
    );
});





