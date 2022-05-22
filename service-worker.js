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

    // Strategy network first => cache fallback
    console.log('event', event);
    if(event.request.method === 'POST') {
        return;
    }
    event.respondWith(
        fetch(event.request).then(res => {
            // Add the latest version into the cache
            caches.open(cacheName).then(cache => cache.put(event.request, res));
            // we clone it as as a response can be read only once
            return res.clone();
        }).catch(error => {
            console.log(`${event.request.url} fetched form cache`);
            return caches.match(event.request)
        })
    );
});


// ------------------------------------------------------------
// -----------  PERSISTENT NOTIFICATIONS ------------------
// ------------------------------------------------------------

/* self.registration.showNotification('Notif depuis le sw', {
    body: 'je suis une notification dite "persitante"',
    actions: [
        {action: 'accept', title: 'accepted'},
        {action: 'refuse', title: 'refused'}
    ]
});

// Message when close notifications
self.addEventListener('notificationclose', event => {
    console.log('notification fermée', event);
});

self.addEventListener('notificationclick', event => {
    // Detect action
    if (event.action === 'accept') {
        console.log('Vous avez accepté');
    } else if (event.action === 'refuse') {
        console.log('Vous avez refusé');
    } else {
        console.log('Vous avez cliqué sur la notification (pas sur un bouton)');
    }
    event.notification.close();
});
 */

// Notification Push
self.addEventListener('push', event => {
    console.log('push event', event);
    console.log('data envoyée par la push notification des dev tools : ', event.data.text());
    const title = event.data.text();
    self.waitUntil(self.registration .showNotification(title, 
        {
            body: "ça marche !", 
            image: "images/icons/icon-192x192.png"
        }));
});

