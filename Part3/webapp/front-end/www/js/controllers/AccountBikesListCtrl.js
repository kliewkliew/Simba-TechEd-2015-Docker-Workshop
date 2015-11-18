

angular.module('app.controllers')

.controller('AccountBikesListCtrl', function($scope, $rootScope, $state, $stateParams, $ionicScrollDelegate, $timeout, $utils) {
	$scope.onTapBike = function(index){
		$state.go("app.account.bike-detail", {
			id: index
		});
	}
})
