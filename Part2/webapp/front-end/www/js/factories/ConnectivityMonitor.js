'use strict';

// Reference: http://www.joshmorony.com/monitoring-online-and-offline-states-in-an-ionic-application/
angular.module('app.factories')
    .factory('ConnectivityMonitor', ['$rootScope', '$cordovaNetwork', function ($rootScope, $cordovaNetwork) {

        return {
            isOnline: function () {
                if (ionic.Platform.isWebView()) {
                    return $cordovaNetwork.isOnline();
                }
                else {
                    return navigator.onLine;
                }
            },
            ifOffline: function () {
                if (ionic.Platform.isWebView()) {
                    return !$cordovaNetwork.isOnline();
                }
                else {
                    return !navigator.onLine;
                }
            },
            startWatching: function () {
                if (ionic.Platform.isWebView()) {

                    $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                        console.log("went online");
                    });

                    $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                        console.log("went offline");
                    });

                }
                else {

                    window.addEventListener("online", function (e) {
                        console.log("went online");
                    }, false);

                    window.addEventListener("offline", function (e) {
                        console.log("went offline");
                    }, false);
                }
            }
        };
    }]);
