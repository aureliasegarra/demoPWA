const webPush = require('web-push');
const pushServerKeys = require('./pushServerKeys.json');
const pushClientSubscription = require('./pushClientSubscription.json');

webPush.setVapidDetails('mailto:av.segarra@gmail.com', pushServerKeys.publicKey, pushServerKeys.privateKey);

const subscription = {
    endpoint: pushClientSubscription.endpoint,
    keys: {
        auth: pushClientSubscription.keys.auth,
        p256dh: pushClientSubscription.keys.p256dh
    }
};


webPush.sendNotification(subscription, 'Notification envoyée depuis le server push node : )')
    .then(res => console.log('ma push notification a bien été poussée', res))
    .catch(err => console.error);