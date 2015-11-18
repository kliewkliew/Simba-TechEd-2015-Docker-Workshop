angular.module('app.controllers')

.controller('MessageDetailCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$ionicPopup', '$ionicSideMenuDelegate', '$ionicScrollDelegate', '$api', '$localStorage', '$modals', '$utils', 'ActivityService', 'UserService','$translate', '$translatePartialLoader',

    function ($scope, $rootScope, $state, $stateParams, $timeout, $ionicPopup, $ionicSideMenuDelegate, $ionicScrollDelegate, $api, $localStorage, $modals, $utils, ActivityService, UserService, $translate, $translatePartialLoader) {

        $rootScope.hideTabBar = true;

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

        $scope.onTapDesc = function () {
            $scope.trimDesc = !$scope.trimDesc;
            $timeout(function () {
                $ionicScrollDelegate.resize();
            }, 200);
        };

        $scope.onRefresh = function () {
        };

        // $translatePartialLoader.addPart('activity_detail');
        // $translate.refresh();
    }
])
