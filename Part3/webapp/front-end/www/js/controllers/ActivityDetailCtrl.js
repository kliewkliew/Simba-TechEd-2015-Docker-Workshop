angular.module('app.controllers')

.controller('ActivityDetailCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$ionicPopup', '$ionicSideMenuDelegate', '$ionicScrollDelegate', '$api', '$localStorage', '$modals', '$utils', 'ActivityService', 'UserService', 'aDetail', '$translate', '$translatePartialLoader', '$cordovaGeolocation',

    function ($scope, $rootScope, $state, $stateParams, $timeout, $ionicPopup, $ionicSideMenuDelegate, $ionicScrollDelegate, $api, $localStorage, $modals, $utils, ActivityService, UserService, aDetail, $translate, $translatePartialLoader, $cordovaGeolocation) {

        var activityId = $stateParams.id;
        if (aDetail) {
            $scope.activity = aDetail[0];
            $scope.attendees = aDetail[1];
            $scope.joined = aDetail[2];
            $scope.user = aDetail[3];
        }

        $scope.onJoin = function () {
            ActivityService.joinActivity(activityId).then(function (attendee) {
                $scope.attendees.push(attendee);
                $scope.joined = true;
            });
        }

        $scope.onNotJoin = function () {
            ActivityService.notJoinActivity(activityId).then(function (cUser_id) {
                $scope.attendees = $scope.attendees
                    .filter(function (el) {
                        return el.id !== cUser_id;
                    });
                $scope.joined = false;
            });
        };

        $scope.edit = function () {
            $state.go("app.home.cycling.update-activity", {
                id: activityId
            });
        };

        $scope.confirmDelete = function () {

            var confirmPopup = $ionicPopup.confirm({
                title: '删除确认',
                template: '删除活动: ' + $scope.activity.title + '?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    ActivityService.deleteActivity(activityId).then(function (res) {
                        $rootScope.hideTabBar = false;
                        $ionicSideMenuDelegate.$getByHandle('main-side-menu').toggleRight(false);
                        $state.go('app.home.cycling.activities', {});
                    });
                }
            });
        };

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

        //Google maps: refer to http://www.joshmorony.com/integrating-google-maps-with-an-ionic-application/
        var options = {
            timeout: 10000,
            enableHighAccuracy: true
        };

        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

            // use user's current location as the center
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer;

            directionsDisplay.setMap($scope.map);

            directionsService.route({
                origin: $scope.activity.start_location,
                destination: $scope.activity.end_location,
                travelMode: google.maps.TravelMode.BICYCLING
            }, function (response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    console.log(response);
                }
                else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        }, function (error) {
            console.log("Could not get location");
        });

        //TODO: redirect to attendees' profile
        $scope.onProfile = function (index) {

        };

        $scope.onBikes = function () {
            $state.go("app.home.cycling.activity-bikes", {});
        };

        //TODO: move to user's account.
        $scope.onDone = function () {
            $state.go("app.activity.search", {});
        };

        $scope.onTapDesc = function () {
            $scope.trimDesc = !$scope.trimDesc;
            $timeout(function () {
                $ionicScrollDelegate.resize();
            }, 200);
        };

        $scope.onRefresh = function () {
            ActivityService.getActivityById(activityId).then(function (aDetail) {
                $scope.activity = aDetail[0];
                $scope.attendees = aDetail[1];
                $scope.joined = aDetail[2];
                $scope.user = aDetail[3];
            })['finally'](function () {
                $scope.$broadcast('scroll.refreshComplete')
            });
        };

        $translatePartialLoader.addPart('activity_detail');
        $translate.refresh();
    }
])
