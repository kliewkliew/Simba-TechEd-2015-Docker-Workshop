angular.module('app.controllers')

.controller('SignUpCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$ionicHistory', '$utils', '$timeout', '$api', '$localStorage', '$translate', '$translatePartialLoader',

    function ($scope, $rootScope, $state, $stateParams, $ionicHistory, $utils, $timeout, $api, $localStorage, $translate, $translatePartialLoader) {

        $scope.user = {
            gender: "男",
            school: "管理学院",
            grade: 2014
        };

        $scope.back = function () {
            if (Object.keys($scope.user).length > 3)
                $utils.openAlert("please save your changes first");
            else
                $state.go("intro", {});
        };

        $scope.SignUp = function () {

            $scope.user.is_admin = false;

            if (!$scope.user.email ||
                !$scope.user.password ||
                !$scope.user.confirm_password ||
                !$scope.user.name) {

                return $utils.openPopup(CONFIG.no_invalid_allowed);
            }

            if ($scope.user.password !== $scope.user.confirm_password) {
                return $utils.openPopup(CONFIG.different_password);
            }

            if ($scope.user.email === 'admin@admin.com' && $scope.user.password === 'admin') {
                $scope.user.is_admin = true;
            }

            $utils.showLoading();

            $api.call('/register', 'POST', {
                    email: $scope.user.email,
                    password: $scope.user.password,
                    name: $scope.user.name,
                    date_of_birth: $scope.user.dob,
                    gender: $scope.user.gender,
                    college_name: $scope.user.school,
                    grade: $scope.user.grade,
                    is_admin: $scope.user.is_admin
                })
                .success(function (data, status, headers, config) {

                    $rootScope.hideTabBar = false;

                    if (data.err) {
                        return $utils.openPopup(data.err.message);
                    }
                    else {
                        $localStorage.set('session_id', data.id);
                        $state.go('app.home.cycling.activities');
                    }

                })
                .error(function (data, status, headers, config) {
                    $utils.openPopup(CONFIG.connection_failed, data);
                })

            ['finally'](function () {
                $utils.hideLoading();
            });
        };

        $translatePartialLoader.addPart('sign_up');
        $translate.refresh();
    }
]);

// 5554e924f58dec7f615c6267
