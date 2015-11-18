angular.module('app.controllers')

.controller('BikeListCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$ionicScrollDelegate', '$timeout', '$location', '$utils', 'BikeService', 'bList', '$modals', '$translate', '$translatePartialLoader',

    function ($scope, $rootScope, $state, $stateParams, $ionicScrollDelegate, $timeout, $location, $utils, BikeService, bList, $modals, $translate, $translatePartialLoader) {

        $scope.bikes = bList;
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

        $scope.showPostBikeModal = function () {
            $modals.show("PostBike");
        };

        $scope.BikeDetail = function (id) {
            $state.go("app.home.cycling.bike-detail", {
                id: id
            });
        };

        $scope.onStartDate = function () {
            var options = {
                date: $rootScope.BIKE.startDate,
                mode: 'date'
            };

            datePicker.show(options, function (date) {
                if ((typeof date === "undefined") || (date == "Invalid Date"))
                    return;

                $rootScope.BIKE.startDate = date;

                $scope.blinkStart = true;
                $timeout(function () {
                    $scope.blinkStart = false;
                }, 300);
                $rootScope.$apply();
            });
        };

        $scope.onEndDate = function () {

            var options = {
                date: $rootScope.BIKE.endDate,
                mode: 'date'
            };

            datePicker.show(options, function (date) {
                if ((typeof date === "undefined") || (date == "Invalid Date"))
                    return;

                $rootScope.BIKE.endDate = date;

                $scope.blinkEnd = true;
                $timeout(function () {
                    $scope.blinkEnd = false;
                }, 300);
                $rootScope.$apply();
            });
        };

        $scope.onSearchBikes = function () {};

        $translatePartialLoader.addPart('bike_list');
        $translate.refresh();
    }
]);
