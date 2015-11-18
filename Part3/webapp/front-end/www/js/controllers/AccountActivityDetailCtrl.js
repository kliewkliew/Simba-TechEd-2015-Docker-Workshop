angular.module('app.controllers')

.controller('AccountActivityDetailCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$ionicScrollDelegate', '$api', '$utils', 'activity',

    function ($scope, $rootScope, $state, $stateParams, $timeout, $ionicScrollDelegate, $api, $utils, activity) {

        if (activity.data) {
            $scope.activity = activity.data;
        }
        else {
            $utils.openPopup(null, CONFIG.connection_failed);
        }

        $scope.$on("$ionicView.beforeEnter", function (scopes, states) {
            $scope.trimDesc = true;
            if (states.direction === "forward") {
                $scope.activityId = $stateParams.id;
                $rootScope.hideTabBar = true;
            }
        });

        $scope.$on("$ionicView.beforeLeave", function (scopes, states) {
            if (states.direction === "back")
                $rootScope.hideTabBar = false;
        });

        $scope.onProfile = function (index) {

        };

        $scope.isOnGoing = function () {

            return moment().isBefore(moment($scope.activity.deadline));
        };

        $scope.getBtnClass = function () {
            return $scope.isOnGoing() ? 'button-assertive ion-close' : 'button-balanced ion-checkmark';
        };

        $scope.getBtnCaption = function () {
            return $scope.isOnGoing() ? '不去' : '完成';
        };

        $scope.onAction = function () {
            alert($scope.isOnGoing() ? 'do 不去 actions' : 'do 完成 actions');
        };

        $scope.onDone = function () {
            $state.go("app.activity.my", {});
        };

        $scope.getStatusLine = function () {
            return $scope.isOnGoing() ?
                "还有" + parseInt($rootScope.ACTIVITY.curActivity.limit - $rootScope.ACTIVITY.curActivity.current) + "个位置" :
                "共有" + $rootScope.ACTIVITY.curActivity.current + "个小伙伴参加";
        };

        $scope.onTapDesc = function () {
            $scope.trimDesc = !$scope.trimDesc;
            $timeout(function () {
                $ionicScrollDelegate.resize();
            }, 200)
        };
    }
]);
