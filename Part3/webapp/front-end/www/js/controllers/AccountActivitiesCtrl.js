angular.module('app.controllers')

.controller('AccountActivitiesCtrl', ['$scope', '$rootScope', '$state', '$api', '$localStorage', '$utils',

    function ($scope, $rootScope, $state, $api, $localStorage, $utils) {

        $scope.activity_ids = [];

        $api.call('/user', 'GET', null, $localStorage.get('session_id'))
            .success(function (data, status, header, config) {

                if (data.user.activities) {

                    for (var i = 0, j = data.user.activities.length; i < j; i++) {
                        $scope.activity_ids.push(data.user.activities[i].id);
                    }

                    $api.call('/activities', 'GET', {
                            ids: JSON.stringify($scope.activity_ids)
                        }, null)
                        .success(function (data, status, header, config) {

                            $scope.activities = data;

                        }).error(function (data, status, headers, config) {

                            $utils.openPopup(data, CONFIG.connection_failed);
                        });
                }

            }).error(function (data, status, headers, config) {

                $utils.openPopup(data, CONFIG.connection_failed);
            })

        ['finally'](function () {

        });

        $scope.getItemClass = function (index) {
            return "a-item-joined";
        };

        $scope.onTapActivity = function (id) {
            $state.go("app.account.activity-detail", {
                id: id
            });
        };

        $scope.onRefresh = function () {
            $scope.$broadcast('scroll.refreshComplete');
        };
    }
]);

// $state.go("app.post-activity");
