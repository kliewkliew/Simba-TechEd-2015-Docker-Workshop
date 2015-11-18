angular.module('app.factories')

.factory('$localStorage', ['$window', function ($window) {

    return {

        contains: function (key) {
            return $window.localStorage.hasOwnProperty(key);
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    };
}]);
