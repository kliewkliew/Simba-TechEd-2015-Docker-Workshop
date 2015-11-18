angular.module('app.controllers')

.controller('MessagesCtrl', ['$scope', '$state', '$utils', '$ionicActionSheet', 'ActivityService', '$modals', '$translate', '$translatePartialLoader',

    function ($scope, $state, $utils, $ionicActionSheet, ActivityService, $modals, $translate, $translatePartialLoader) {

        $scope.messages = [
          {
            _id: 0,
            avatar: 'img/avatar/1.png',
            name: 'Jon Snow',
            detail: 'Da illest illegitimate'
          },
          {
            _id: 1,
            avatar: 'img/avatar/2.png',
            name: 'Daenerys Targaryen',
            detail: 'Dragon mommy'
          }
        ];

        $scope.MessageDetail = function (id) {
            $state.go("app.home.message-detail", {
                id: id
            });
        };

        $scope.onRefresh = function () {
            ActivityService.getActivityList().then(function (actList) {
                $scope.activities = actList;
            })['finally'](function () {
                $scope.$broadcast('scroll.refreshComplete')
            });
        };

        $translatePartialLoader.addPart('message');
        $translate.refresh();
    }
]);
