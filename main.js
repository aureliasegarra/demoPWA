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
        .then(registration => {
            //public vapid key generated with web-push
            const publicKey = 'BBtOaPW5XgRNIVSqA8GSM9X7jDnI0eeG7enrh-YBBzZNVL_e6PncbMJj6kAm6m_58q-GRuQqEPT0ndYy1JiXSUY';
            registration.pushManager.getSubscription().then(subscription => {
                if (subscription) {
                    console.log('subscription', subscription);
                     // no more keys proprety directly visible on the subscription objet. So you have to use getKey()
                     const keyArrayBuffer = subscription.getKey('p256dh');
                     const authArrayBuffer = subscription.getKey('auth');
                     const p256dh = btoa(String.fromCharCode.apply(null, new Uint8Array(keyArrayBuffer)));
                     const auth = btoa(String.fromCharCode.apply(null, new Uint8Array(authArrayBuffer)));
                     console.log('p256dh key', keyArrayBuffer, p256dh);
                     console.log('auth key', authArrayBuffer, auth);
                } else {
                    // ask a subscription
                    const convertedKey = urlBase64ToUint8Array(publicKey);
                    return registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: convertedKey
                    })
                    .then(newSubscription =>  {
                        console.log('newSubscription', newSubscription);
                    })
                }
            })
        })
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

// ------------------------------------------------------------
// -----------  PUSH SERVER NOTIFICATIONS  ------------------
// ------------------------------------------------------------

// and used to convert base64 string to Uint8Array == to an array buffer
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};


