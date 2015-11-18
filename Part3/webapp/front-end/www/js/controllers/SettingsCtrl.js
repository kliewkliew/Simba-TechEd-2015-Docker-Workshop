angular.module('app.controllers')

.controller('SettingsCtrl', ['$scope', '$rootScope', '$state', '$ionicUser', '$ionicPush', '$ionicModal', '$ionicSideMenuDelegate', '$ionicScrollDelegate', '$ionicActionSheet', '$cordovaCamera', '$timeout', '$localStorage', '$api', '$modals', '$utils', 'PushNotificationService', 'UserService', '$translate', '$translatePartialLoader',

    function ($scope, $rootScope, $state, $ionicUser, $ionicPush, $ionicModal, $ionicSideMenuDelegate, $ionicScrollDelegate, $ionicActionSheet, $cordovaCamera, $timeout, $localStorage, $api, $modals, $utils, PushNotificationService, UserService, $translate, $translatePartialLoader) {

        $rootScope.hideTabBar = false;

        $scope.push_notification = {
            checked: false
        };

        UserService.getSingleUser($localStorage.get('session_id')).then(function (user) {
            if (user.settings) {
                $scope.push_notification.checked = user.settings.push_notification;
            }
        })

        $scope.getBackIcon = function () {
            if (ionic.Platform.isAndroid())
                return 'icon ion-android-arrow-back';
            else
                return 'icon ion-ios-arrow-back';
        };

        $scope.save = function () {
            var post = {};
            post.settings = {
                push_notification: $scope.push_notification.checked
            };

            $api.call('/user', 'PUT', post, $localStorage.get('session_id'))
                .success(function (data, status, headers, config) {

                    if ($scope.push_notification.checked) {
                        $scope.pushRegister();
                    }
                    else {
                        $scope.pushUnregister();

                        $api.call('/user/updateToken', 'POST', {
                                user_id: $localStorage.get('session_id'),
                                token: $localStorage.get('device-token'),
                                method: 'pull'
                            }, null)
                            .success(function (data, status, headers, config) {
                                console.log('remove device token success', data);
                            })
                            .error(function (data, status, headers, config) {
                                console.log('remove device token failed!', data);
                            })
                    }
                })
                .error(function (data, status, headers, config) {
                    $utils.openPopup(CONFIG.connection_failed, JSON.stringify(data, null, 2));
                })

            ['finally'](function () {
                $utils.hideLoading();
            });
        };

        $scope.close = function () {
            $modals.hide();
        };

        $scope.pushRegister = function () {
            // Register with the Ionic Push service.  All parameters are optional.
            $ionicPush.register({
                canShowAlert: true, //Can pushes show an alert on your screen?
                canSetBadge: true, //Can pushes update app icon badges?
                canPlaySound: true, //Can notifications play a sound?
                canRunActionsOnWake: true, //Can run actions outside the app,
                onNotification: function (notification) {
                    // Handle new push notifications here
                    console.log(notification);
                    return true;
                }
            });
        };

        $scope.pushUnregister = function () {
            if (window.cordova) {
                $ionicPush.unregister();
            }
            else {
                // unregister is not working at the moment
                // https://github.com/driftyco/ionic-push-issues/issues/11
            }
        };

        $scope.getTokens = function () {
            $api.call('/tokens', 'GET')
                .success(function (data, status, headers, config) {
                    $scope.tokens = data.tokens;
                })
                .error(function (data, status, headers, config) {
                    $scope.tokens = 'Error in getting tokens';
                })
        };

        $scope.toggleLanguage = function () {
            $translate.use(($translate.use() === 'en-US') ? 'zh_CN' : 'en-US');
        };

        $scope.sendNotification = function () {
            PushNotificationService.sendNotification('This is a test!');
        };

        $translatePartialLoader.addPart('settings');
        $translate.refresh();
    }
]);
