angular.module('app.controllers')

.controller('ActivityBikeListCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$ionicScrollDelegate', '$timeout', '$location', '$utils', 'BikeService', 'bList', '$modals',

    function ($scope, $rootScope, $state, $stateParams, $ionicScrollDelegate, $timeout, $location, $utils, BikeService, bList, $modals) {

        $scope.bikes = bList;
        $rootScope.hideTabBar = true;

        $scope.onRefresh = function () {
            BikeService.getBikeList().then(function (bList) {
                $scope.bikes = bList;
            })['finally'](function () {
                $scope.$broadcast('scroll.refreshComplete')
            });
        };

        $scope.getCExp = function (dt) {
            return getCExp(dt);
        };

        $scope.onTapActivity = function (id) {
            $state.go("app.home.cycling.activity-bike-detail", {
                id: id
            });

            // $location.hash("id-bike-3");
            // console.log($location.hash());
            // $ionicScrollDelegate.anchorScroll(true);
        };
    }
]);
