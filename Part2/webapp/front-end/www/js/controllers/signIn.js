angular.module('app.controllers')

.controller('SignInCtrl', ['$ionicUser', '$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$api', '$localStorage', '$utils', 'PropertyService', '$translate', '$translatePartialLoader',

    function ($ionicUser, $scope, $rootScope, $state, $stateParams, $timeout, $api, $localStorage, $utils, PropertyService, $translate, $translatePartialLoader) {

        $scope.userCred = {
            email: '',
            pwd: ''
        }

        if ($localStorage.get('session_email') && $localStorage.get('session_pwd')) {
            $scope.userCred.email = $localStorage.get('session_email');
            $scope.userCred.pwd = $localStorage.get('session_pwd');
        }

        $scope.SignUp = function () {
            $state.go('sign-up', {});
        };

        $scope.SignIn = function () {

            if (!$scope.userCred.email || !$scope.userCred.email) {
                return $utils.openAlert(CONFIG.no_empty_user_pwd);
            }

            $localStorage.set('session_email', $scope.userCred.email);
            $localStorage.set('session_pwd', $scope.userCred.pwd);

            $utils.showLoading();

            $api.call('/login', 'POST', {
                    email: $scope.userCred.email,
                    password: $scope.userCred.pwd
                })
                .success(function (data, status, headers, config) {

                    var user = $ionicUser.get();
                    if (!user.user_id) {
                        // Set your user_id here, or generate a random one.
                        user.user_id = data.id
                    };

                    // Add some metadata to your user object.
                    angular.extend(user, {
                        email: data.email
                    });

                    // Identify your user with the Ionic User Service
                    $ionicUser.identify(user).then(function () {
                        $scope.identified = true;
                        console.log('Identified user ' + user.email + '\n ID ' + user.user_id);
                    });

                    $localStorage.set('session_id', data.id);
                    $rootScope.hideTabBar = false;
                    $state.go('app.home.cycling.activities', {});
                })
                .error(function (data, status, headers, config) {
                    $utils.openPopup(data.message, CONFIG.invalid_cred);
                })

            ['finally'](function () {
                $utils.hideLoading();
            });
        };

        $translatePartialLoader.addPart('sign_in');
        $translate.refresh();
    }
]);
