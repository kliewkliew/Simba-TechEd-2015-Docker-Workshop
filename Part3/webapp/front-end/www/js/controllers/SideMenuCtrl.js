angular.module('app.controllers')

.controller('SideMenuCtrl', ['$scope', '$rootScope', '$state', '$ionicModal', '$ionicSideMenuDelegate', '$ionicScrollDelegate', '$ionicActionSheet', '$cordovaCamera', '$timeout', '$localStorage', '$modals', 'ActivityService', 'UserService', '$translate', '$translatePartialLoader',

    function ($scope, $rootScope, $state, $ionicModal, $ionicSideMenuDelegate, $ionicScrollDelegate, $ionicActionSheet, $cordovaCamera, $timeout, $localStorage, $modals, ActivityService, UserService, $translate, $translatePartialLoader) {

        $rootScope.hideTabBar = false;

        UserService.getSingleUser($localStorage.get('session_id')).then(function (user) {
            $scope.user = user;
        });

        $scope.showModal = function (html) {

            // var handle = html.toLowerCase().indexOf('bike') > 0 ? 'id-scl-pb' : 'id-scl-pa';
            // $ionicScrollDelegate.$getByHandle(handle).scrollTop(false);

            $modals.show(html);
        };

        $scope.profile = function () {
            $modals.show("Profile", $scope);
        };

        $scope.home = function () {
            $state.go("app.home.activities", {});
        };

        $scope.myAccount = function () {
            $state.go("app.account.activities", {});
        };

        $scope.myBike = function () {
            $state.go("app.bike.my", {});
        };

        $scope.LogOut = function () {
            //clean all cache
            $state.go("intro", {});
        };

        $translatePartialLoader.addPart('side_menu');
        $translate.refresh();
    }
]);
