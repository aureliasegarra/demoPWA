self.addEventListener('install', event => {
    console.log('install event', event);
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
});



