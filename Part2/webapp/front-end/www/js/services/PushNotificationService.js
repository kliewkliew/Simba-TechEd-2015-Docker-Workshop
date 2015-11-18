angular.module('app.services')

.service('PushNotificationService', ['$api',

    function ($api) {

        var post = {
            "tokens": [],
            "notification": {
                "alert": "Hello World!",
                "ios": {
                    "badge": 1,
                    "sound": "ping.aiff",
                    "expiry": 1423238641,
                    "priority": 10,
                    "contentAvailable": true,
                    "payload": {
                        "key1": "value",
                        "key2": "value"
                    }
                },
                "android": {
                    "collapseKey": "foo",
                    "delayWhileIdle": true,
                    "timeToLive": 300,
                    "payload": {
                        "key1": "value",
                        "key2": "value"
                    }
                }
            }
        };

        return {

            sendNotification: function (body) {

                post.notification.alert = body;

                $api.call('/tokens', 'GET').then(function (res) {

                    if (res) {
                        post.tokens = res.data.res[0].settings.device_token;
                        $api.call(CONFIG.ionic_push_url, 'POST', post)
                            .then(function (res) {

                            }, function (err) {

                            });
                    }
                });
            }
        }
    }
]);
