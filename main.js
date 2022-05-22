console.log('hello from main');
const technosDiv = document.querySelector('#technos');

function loadTechnologies() {
    fetch('http://localhost:3001/technos')
        .then(response => {
            response.json()
                .then(technos => {
                    const allTechnos = technos.map(techno => `<div><b>${techno.name}</b> ${techno.description}  <a href="${techno.url}">site de ${techno.name}</a> </div>`)
                            .join('');
            
                    technosDiv.innerHTML = allTechnos; 
                });
        })
        .catch(console.error);
}

loadTechnologies(technos);

if (navigator.serviceWorker) {
    navigator.serviceWorker.register("service-worker.js")
        .catch(error => console.error)
}

// Cache creation
if (window.caches) {
    caches.open('veille-techno-1.0').then(cache => {
        cache.addAll([
            'index.html', 
            'main.js',
            'vendors/bootstrap4.min.css'
        ]);
    })
    
}

// ------------------------------------------------------------
// -----------  NON PERSISTENT NOTIFICATIONS ------------------
// ------------------------------------------------------------


// Check if user's browser can support notifications
 if (window.Notification && window.Notification !== 'denied') {
    Notification.requestPermission(perm => {
        if(perm === 'granted') {
            const options = {
                body: 'Body de la notification',
                icon: 'images/icons/icon-192x192.png'
            }
            const notif = new Notification('Hello nototification', options);
        } else {
            console.log('autorisation de recevoir des notifications a été refusé ! ');
        }
    })
}  
