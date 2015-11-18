angular.module('app.filters', [])

.filter('moment', function () {
    return function (input, momentFn /*, param1, param2, ...param n */ ) {
        var args = Array.prototype.slice.call(arguments, 2),
            momentObj = moment(input);
        return momentObj[momentFn].apply(momentObj, args);
    };
})
.filter('moment_time', function() {
    return function (input) {
        return moment.utc(input * 1000).format('LT');
    };
});
