var admin = require("firebase-admin");
var serviceAccount = require("../keys/ed-frontend-firebase-adminsdk-g1ld7-6fac7daf6d.json");

const firebaseapp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
async function sendPushNotification(fcmToken, title, body) {
    await firebaseapp.messaging().send({
        token: fcmToken,
        notification: {
            title, body
        }
    })
}

async function sendToMultiple(registrationTokens) {
    const message = {
        data: { score: '850', time: '2:45' },
        tokens: registrationTokens,
    };
    firebaseapp
        .sendMulticast(message)
        .then((response) => {
            console.log(response.successCount + ' messages were sent successfully');
        });
}
module.exports = { sendPushNotification, sendToMultiple }
