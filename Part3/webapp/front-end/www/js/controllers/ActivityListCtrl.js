angular.module('app.controllers')

.controller('ActivityListCtrl', ['$scope', '$state', '$utils', '$ionicActionSheet', 'ActivityService', 'aList', '$modals', '$translate', '$translatePartialLoader',

    function ($scope, $state, $utils, $ionicActionSheet, ActivityService, aList, $modals, $translate, $translatePartialLoader) {

        $scope.activities = aList;
        $scope.getItemClass = function (index) {
            return "a-item-normal";
        };

        $scope.ActivityDetail = function (id) {
            $state.go("app.home.cycling.activity-detail", {
                id: id
            });
        };

        $scope.addActivity = function (id) {
            $state.go("app.home.cycling.add-activity");
        };

        $scope.onRefresh = function () {
            ActivityService.getActivityList().then(function (actList) {
                $scope.activities = actList;
            })['finally'](function () {
                $scope.$broadcast('scroll.refreshComplete')
            });
        };

        //TODO: add visualized difficulty level
        // $scope.difficulty = [0, 0, 0, 1, 1, 2];

        //TODO: add action sheet on hold
        $scope.onHold = function () {
            $ionicActionSheet.show({
                titleText: '活动菜单',
                buttons: [{
                    text: '分享'
                }, {
                    text: '移动'
                }, ],
                destructiveText: '删除',
                cancelText: '取消',
                cancel: function () {
                    console.log('CANCELLED');
                },
                buttonClicked: function (index) {
                    console.log('BUTTON CLICKED', index);
                    return true;
                },
                destructiveButtonClicked: function () {
                    console.log('DESTRUCT');
                    return true;
                }
            });
        };

        $translatePartialLoader.addPart('activity_list');
        $translate.refresh();
    }
]);
