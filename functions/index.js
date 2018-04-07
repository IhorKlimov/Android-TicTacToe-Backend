const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.https.onRequest((req, res) => {
    const to = req.query.to;
    const title = req.query.title;
    const body = req.query.body;

    var payload;
    if (body != undefined && body !== '') {
        payload = {
            notification: {
                title: title,
                body: body
            }
        };
    } else {
        payload = {
            notification: {
                title: title
            }
        };
    }

    var options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };
    if (to === 'all') {
        admin.messaging().sendToTopic(to, payload, options)
            .then(function (response) {
                res.send(200, 'ok');
            })
            .catch(function (error) {
                res.send(200, 'failed');
            });
    } else {
        admin.messaging().sendToDevice(to, payload, options)
            .then(function (response) {
                res.send(200, 'ok');
            })
            .catch(function (error) {
                res.send(200, 'failed');
            });
    }
});