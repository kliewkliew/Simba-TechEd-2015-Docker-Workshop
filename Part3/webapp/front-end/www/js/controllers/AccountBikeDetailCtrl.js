

angular.module('app.controllers')

.controller('AccountBikeDetailCtrl', function($scope, $rootScope, $state, $stateParams, $timeout, $ionicScrollDelegate) {

	$scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {
		$scope.trimDesc = true;
		if (states.direction === "forward"){
			$rootScope.hideTabBar = true;
		}
	});

	$scope.$on( "$ionicView.beforeLeave", function( scopes, states ) {
		if (states.direction === "back")
			$rootScope.hideTabBar = false;
	});

	$scope.onReturn = function(){
		alert("on return");
	}

	$scope.onTapDesc = function(){
		$scope.trimDesc = !$scope.trimDesc;
		$timeout(function(){
			$ionicScrollDelegate.resize();
		}, 200)
	}
})
