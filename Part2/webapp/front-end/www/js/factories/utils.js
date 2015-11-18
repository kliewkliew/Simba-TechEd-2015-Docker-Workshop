angular.module('app.factories')

.factory('$utils', ['$cordovaDialogs', '$ionicLoading', '$ionicPopup', function ($cordovaDialogs, $ionicLoading, $ionicPopup) {

    return {

        showLoading: function (msg) {
            var message = msg;
            var sIcon = ionic.Platform.isIOS() ? 'ios' : 'android'

            if (typeof msg === "undefined")
                message = "Loading...";

            $ionicLoading.show({
                template: "<ion-spinner icon='" + sIcon + "' class='spinner-stable'></ion-spinner><span style='margin-top: .5em; float: right; line-height: 1em;'>&nbsp" + message + "</span>"
            });
        },

        hideLoading: function () {
            $ionicLoading.hide();
        },

        openAlert: function (msg, title) {

            if (typeof title === "undefined")
                title = "Warning";

            if ($cordovaDialogs) {
                $cordovaDialogs.alert(msg, title).then(function () {});
            }
            else
                alert(msg);
        },

        openPopup: function (title, msg) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: '<font color=black>' + msg + '</font>'
            });
            alertPopup.then(function (res) {});
        }
    };
}]);
