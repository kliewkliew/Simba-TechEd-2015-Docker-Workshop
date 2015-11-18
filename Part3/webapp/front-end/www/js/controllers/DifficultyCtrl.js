angular.module('app.controllers')

.controller('DifficultyCtrl', ['$scope',

    function ($scope) {
        $scope.colors = ['green', 'green', 'yellow', 'red', 'red'];
    }
]).directive('difficulty', function ($parse) {
    return {
        restrict: 'E',
        link: function ($scope, element, attrs) {

            var colours = {
                0: '#90BD3C',
                1: '#F2A81D',
                2: '#FD4000'
            }

            var data = $parse(attrs.data)($scope);
            $scope.colours = data.map(function (x) {
                return colours[x];
            });

        },
        templateUrl: 'templates/Difficulty.html'
    };
});
