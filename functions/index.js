const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.https.onRequest((req, res) => {
    const to = req.query.to;
    const fromId = req.query.fromId;
    const fromPushId = req.query.fromPushId;
    const fromName = req.query.fromName;
    const type = req.query.type;
    const title = req.query.title;
    const body = req.query.body;

    var payload;
    if (to === 'all') {
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
    } else {
        payload = {
            data: {
                fromId: fromId,
                fromPushId: fromPushId,
                fromName: fromName,
                type: type
            },
            notification: {
                title: 'hi',
                body: 'body'
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

exports.sendNotification2 = functions.https.onRequest((req, res) => {
    const to = req.query.to;
    const fromId = req.query.fromId;
    const fromPushId = req.query.fromPushId;
    const fromName = req.query.fromName;
    const type = req.query.type;

    var payload = {
        data: {
            click_action: "FLUTTER_NOTIFICATION_CLICK",
            fromId: fromId,
            fromPushId: fromPushId,
            fromName: fromName,
            type: type
        }
    };

    if (type === 'invite') {
        payload.notification = {
            title: 'Game invite',
            body: `${fromName} invites you to play!`
        };
    } else if (type === 'accept') {
        payload.notification = {
            title: 'Game invite',
            body: `${fromName} accepted your invitation!`
        };
    }

    var options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };

    admin.messaging().sendToDevice(to, payload, options)
        .then(function (response) {
            res.send(200, 'ok');
        })
        .catch(function (error) {
            res.send(200, 'failed');
        });
});