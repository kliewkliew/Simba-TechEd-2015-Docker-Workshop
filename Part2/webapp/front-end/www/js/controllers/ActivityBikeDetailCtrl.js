angular.module('app.controllers')

.controller('ActivityBikeDetailCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$ionicScrollDelegate', '$utils', '$modals', '$ionicPopup', '$api', '$ionicSideMenuDelegate', 'BikeService', 'bDetail', 'PropertyService',

    function ($scope, $rootScope, $state, $stateParams, $timeout, $ionicScrollDelegate, $utils, $modals, $ionicPopup, $api, $ionicSideMenuDelegate, BikeService, bDetail, PropertyService) {
        var bikeId = $stateParams.id;
        PropertyService.setCurrentBikeId(bikeId);

        $rootScope.hideTabBar = true;

        $scope.bike = bDetail[0];
        $scope.user = bDetail[1];

        $scope.$on("$ionicView.beforeEnter", function (scopes, states) {

            $scope.trimDesc = true;
            if (states.direction === "forward") {
                $rootScope.hideTabBar = true;
                $scope.bikeId = $stateParams.id;
            }
        });

        $scope.$on("$ionicView.beforeLeave", function (scopes, states) {
            if (states.direction === "back")
                $rootScope.hideTabBar = true;
        });

        $scope.onReserve = function () {
            $state.go("app.home.cycling.activity-reserve-bike", {
                id: $scope.bikeId
            });
        };

        $scope.onTapDesc = function () {
            $scope.trimDesc = !$scope.trimDesc;
            $timeout(function () {
                $ionicScrollDelegate.resize();
            }, 200);
        };

        $scope.edit = function () {
            $modals.show('PostBike', $scope);
        };

        $scope.confirmDelete = function () {

            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Confirmation',
                template: 'Delete Bike: ' + $scope.bike.title + '?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    BikeService.deleteBike($scope.bike._id).then(function (res) {
                        $rootScope.hideTabBar = true;
                        $ionicSideMenuDelegate.$getByHandle('main-side-menu').toggleRight(false);
                        $state.go('app.home.cycling.bikes', {});
                    });
                }
                else {
                    alert('Did not get deleted bike list promise');
                }
            });
        };
    }
])
