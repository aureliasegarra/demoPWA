const cacheName = 'veille-techno-1.0';

self.addEventListener('install', event => {
    console.log('install event', event);
    caches.open(cacheName).then(cache => {
        cache.addAll([
            'index.html', 
            'main.js',
            'vendors/bootstrap4.min.css',
            'contact.html',
            'contact.js',
            'add_techno.html',
            'add_techno.js'
        ]);
    })
});

self.addEventListener('activate', event => {
    console.log('activate', event);
});

self.addEventListener('fetch', event => {
    if (!navigator.online) {
        const headers = { headers: { 'content-Type': 'text/html;charset=utf-8'}};
        event.respondWith(new Response('<h1>No network connection</h1><div>Application en mode dégradé. Veuillez vous connecter !</div>', headers));
    }
    console.log('fetch event', event.request.url);

    event.respondWith(
        caches.match(event.request).then(res => {
            if(res) {
                return res;
            }
        })
    )

});





