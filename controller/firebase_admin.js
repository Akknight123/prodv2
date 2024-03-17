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

module.exports = { sendPushNotification }
