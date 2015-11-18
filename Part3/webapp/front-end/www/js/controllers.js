angular.module('app.controllers', [])

.controller('AppCtrl', ['$scope', '$rootScope', '$state', '$ionicModal', '$ionicSideMenuDelegate', '$ionicScrollDelegate', '$ionicActionSheet', '$cordovaCamera', '$timeout', '$localStorage',

      function($scope, $rootScope, $state, $ionicModal, $ionicSideMenuDelegate, $ionicScrollDelegate, $ionicActionSheet, $cordovaCamera, $timeout, $localStorage) {

      $rootScope.hideTabBar = false;


      if ($localStorage.contains("json_settings"))
            $rootScope.SETTINGS = $localStorage.getObject("json_settings");
      else{
            $rootScope.SETTINGS = {
                  push_notification: true
            };
            $localStorage.setObject("json_settings", $rootScope.SETTINGS);
      }


      $scope.getBackIcon = function(){
            if (ionic.Platform.isAndroid())
                  return 'icon ion-android-arrow-back';
            else
                  return 'icon ion-ios-arrow-back';
      }

      $scope.onSettings = function() {
            $scope.tempSettings = {
                  push_notification: $rootScope.SETTINGS.push_notification
            };
            $scope.modalSettings.show();
      };

      $scope.onSaveSettings = function(){
            $rootScope.SETTINGS = $scope.tempSettings;
            $localStorage.setObject("json_settings", $rootScope.SETTINGS);
            $scope.modalSettings.hide();
      }

      $scope.onCloseSettings = function(){
            $scope.modalSettings.hide();
      }

      $scope.onRefreshActivity = function(){
            $scope.prepareNewActivity();
      }

      $scope.onBikeDone = function(){
            $ionicSideMenuDelegate.$getByHandle('main-side-menu').toggleRight(false);
            $scope.onClosePostBike();
            $state.go("app.bike.search", {});
      }
}]);
