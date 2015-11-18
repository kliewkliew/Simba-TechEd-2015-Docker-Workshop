angular.module('app.factories', [])

.factory('$api', ['$http', '$utils', 'ConnectivityMonitor', function ($http, $utils, ConnectivityMonitor) {

    var base = 'http://[please replace it with the web server's ip address]:8080/api';
    var appId = 'e046db85';
    var privateKey = 'bfe536d49f0ec82ae8e2e04f325a9afcbbe9251c1c790901';
    var auth = btoa(privateKey + ':');

    return {
        call: function (service, method, data, path, cache) {

            var req = {
                method: method,
                url: base + service,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Origin': '*'
                }
            }

            if (service === CONFIG.ionic_push_url) {
                req.url = CONFIG.ionic_push_url;
                req.headers['X-Ionic-Application-Id'] = appId;
                req.headers['Authorization'] = 'basic ' + auth;
            }
            if (method !== 'POST' && path != null) {
                req.url += '/' + path;
            }
            if (method === 'GET' && data != null) {
                req.params = data;
            }
            if (method === 'POST' || method === 'PUT') {
                req.data = data;
            }
            if (cache != null && typeof cache === 'boolean') {
                req.cache = cache;
            }

            if (ConnectivityMonitor.isOnline()) {
                console.log(req);
                return $http(req);
            }
            else {
                return $utils.openPopup(data, CONFIG.connection_failed);
            }
        }
    };
}]);
