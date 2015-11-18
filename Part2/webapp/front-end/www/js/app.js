angular.module('app', ['ionic', 'ionic.service.core', 'ionic.service.push', 'ionic-material', 'ionMdInput', 'app.controllers', 'app.directives', 'app.filters', 'app.factories', 'app.services', 'ngCordova', 'angularMoment', 'ionic-datepicker', 'ionic-timepicker', 'ngFileUpload', 'ngAutocomplete', 'pascalprecht.translate', 'ui.bootstrap'])

.run(function ($ionicPlatform, $ionicHistory, $ionicSideMenuDelegate, $ionicPush, $localStorage, $rootScope, $api) {
    $ionicPlatform.ready(function () {

        if (navigator.splashscreen) {
            navigator.splashscreen.hide();
        }
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });

    $ionicPlatform.registerBackButtonAction(function (event) {

        if ($ionicHistory.currentStateName() == "intro") {
            navigator.notification.confirm(
                CONFIG.sure_quit,
                function (index) {
                    if (index == 1) ionic.Platform.exitApp();
                },
                null, ['Yes', 'No']
            );
        }
        else if (($ionicHistory.currentStateName() == "app.home.cycling.activities") ||
            ($ionicHistory.currentStateName() == "app.home.cycling.bikes") ||
            ($ionicHistory.currentStateName() == "app.bike.search") ||
            ($ionicHistory.currentStateName() == "app.bike.my") ||
            ($ionicHistory.currentStateName() == "app.post-activity") ||
            ($ionicHistory.currentStateName() == "app.post-bike")) {
            $ionicSideMenuDelegate.$getByHandle("main-side-menu").toggleRight();
        }
        else {
            $ionicHistory.goBack();
        }
    }, 100);

    $rootScope.$on('$cordovaPush:tokenReceived', function (event, data) {

        var post = {
            user_id: $localStorage.get('session_id'),
            token: data.token,
            method: 'push'
        };
        // console.log('Successfully registered token ', data.token);
        console.log('Platform was', data.platform);
        $localStorage.set('device-token', data.token);
        $rootScope.registerDeviceStatus = 'received';
        $api.call('/user/updateToken', 'POST', post, null)
            .success(function (data, status, headers, config) {
                console.log('add device token success', data);
            })
            .error(function (data, status, headers, config) {
                console.log('add device token failed!', data);
            })

        ['finally'](function () {
            $utils.hideLoading();
        });
    });

    $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
        switch(notification.event) {
            case 'registered':
                if (notification.regid.length > 0 ) {
                  console.log('registration ID = ' + notification.regid);
                }
                break;

            case 'message':
                // this is the actual push notification. its format depends on the data model from the push server
                console.log('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
                break;

            case 'error':
                console.log('GCM error = ' + notification.msg);
                break;

            default:
                console.log('An unknown GCM event has occurred');
                break;
        }
    });
})
.config(['$ionicAppProvider', function($ionicAppProvider) {
    // Identify app
    $ionicAppProvider.identify({
        // The App ID for the server
        app_id: 'e046db85',
        // The API key all services will use for this app
        api_key: '3821e2c739169c95f972303d5a272d1e3e12d357f5fa26e0',
        //The GCM project number
        gcm_id: '250684524067',
        dev_push: false
    });
}])
.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $locationProvider) {

    // $locationProvider.html5Mode(true);

    $stateProvider

        .state('intro', {
        url: "/intro",
        templateUrl: "templates/Intro.html",
        controller: 'IntroCtrl'
    })

    .state('sign-in', {
        url: "/sign-in",
        templateUrl: "templates/SignIn.html",
        controller: 'SignInCtrl'
    })

    .state('sign-up', {
        url: "/sign-up",
        templateUrl: "templates/SignUp.html",
        controller: 'SignUpCtrl'
    })

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/Main.html"
    })

    .state('app.home', {
        url: "/home",
        views: {
            'menuContent': {
                templateUrl: "templates/Home.html"
            }
        }
    })

    .state('app.home.cycling', {
        url: "/cycling",
        views: {
            'cycling': {
                templateUrl: "templates/Cycling.html"
            }
        }
    })

    .state('app.home.messages', {
        url: "/messages",
        views: {
            'messages': {
                templateUrl: "templates/Messages.html",
                controller: 'MessagesCtrl'
            }
        }
    })

    .state('app.home.message-detail', {
        url: "/messages/:id",
        views: {
            'messages': {
                templateUrl: "templates/MessageDetail.html",
                controller: 'MessageDetailCtrl'
            }
        }
    })

    .state('app.home.cycling.activities', {
        url: "/activities",
        views: {
            'aContent': {
                templateUrl: "templates/ActivityList.html",
                controller: 'ActivityListCtrl'
            }
        },
        resolve: {
            aList: function (ActivityService) {
               return ActivityService.getActivityList();
            }
        }
    })

    .state('app.home.cycling.bikes', {
        url: "/bikes",
        views: {
            'bContent': {
                templateUrl: "templates/BikeList.html",
                controller: 'BikeListCtrl'
            }
        },
        resolve: {
            bList: function (BikeService) {
               return BikeService.getBikeList();
            }
        }
    })


    .state('app.home.cycling.activity-detail', {
        url: "/activities/:id",
        views: {
            'aContent': {
                templateUrl: "templates/ActivityDetail.html",
                controller: 'ActivityDetailCtrl'
            }
        },
        resolve: {
            aDetail: function (ActivityService, $stateParams) {
               return ActivityService.getActivityById($stateParams.id);
            }
        }
    })


    .state('app.home.cycling.update-activity', {
        url: "/activities/:id/update",
        views: {
            'aContent': {
                templateUrl: "templates/PostUpdateActivity.html",
                controller: 'UpdateActivityCtrl'
            }
        },
        resolve: {
            aDetail: function (ActivityService, $stateParams) {
               return ActivityService.getActivityById($stateParams.id);
            }
        }
    })

    .state('app.home.cycling.add-activity', {
        url: "/activities/add",
        views: {
            'aContent': {
                templateUrl: "templates/PostUpdateActivity.html",
                controller: 'PostActivityCtrl'
            }
        }
    })

    .state('app.home.cycling.activity-bikes', {
        url: "/activities/:id/bikes",
        views: {
            'aContent': {
                templateUrl: "templates/ActivityBikeList.html",
                controller: 'ActivityBikeListCtrl'
            }
        },
        resolve: {
            bList: function (BikeService) {
               return BikeService.getBikeList();
            }
        }
    })

    .state('app.home.cycling.activity-bike-detail', {
        url: "/activity/bike/:id",
        views: {
            'aContent': {
                templateUrl: "templates/ActivityBikeDetail.html",
                controller: 'ActivityBikeDetailCtrl'
            }
        },
        resolve: {
            bDetail: function (BikeService, $stateParams) {
               return BikeService.getBikeById($stateParams.id);
            }
        }
    })

    .state('app.home.cycling.activity-reserve-bike', {
        url: "/activity/bike/:id/reserve",
        views: {
            'aContent': {
                templateUrl: "templates/ReserveBike.html",
                controller: 'ReserveBikeCtrl'
            }
        },
        resolve: {
            bDetail: function (BikeService, $stateParams) {
               return BikeService.getBikeById($stateParams.id);
            }
        }
    })

    .state('app.home.cycling.bike-detail', {
        url: "/bike/:id",
        views: {
            'bContent': {
                templateUrl: "templates/BikeDetail.html",
                controller: 'BikeDetailCtrl'
            }
        },
        resolve: {
            bDetail: function (BikeService, $stateParams) {
               return BikeService.getBikeById($stateParams.id);
            }
        }
    })

    .state('app.home.cycling.reserve-bike', {
        url: "/bike/:id/reserve",
        views: {
            'bContent': {
                templateUrl: "templates/ReserveBike.html",
                controller: 'ReserveBikeCtrl'
            }
        },
        resolve: {
          bDetail: function (BikeService, PropertyService) {
             return BikeService.getBikeById(PropertyService.getCurrentBikeId());
          }
        }
    })

    .state('app.account', {
        url: "/account",
        views: {
            'menuContent': {
                templateUrl: "templates/AccountPanel.html"
            }
        }
    })

    .state('app.account.activities', {
        url: "/activities",
        views: {
            'aContent': {
                templateUrl: "templates/AccountActivities.html",
                controller: 'AccountActivitiesCtrl'
            }
        }
    })

    .state('app.account.bikes', {
        url: "/bikes",
        views: {
            'bContent': {
                templateUrl: "templates/AccountBikes.html",
                controller: 'AccountBikesListCtrl'
            }
        }
    })

    .state('app.account.activity-detail', {
        url: "/activity/:id",
        views: {
            'aContent': {
                templateUrl: "templates/AccountActivityDetail.html",
                controller: 'AccountActivityDetailCtrl'
            }
        },
        resolve: {
            activity: function ($api, $stateParams) {
                return $api.call('/activities', 'GET', null, $stateParams.id);
            }
        }
    })

    .state('app.account.bike-detail', {
        url: "/bike/:id",
        views: {
            'bContent': {
                templateUrl: "templates/AccountBikeDetail.html",
                controller: 'AccountBikeDetailCtrl'
            }
        },
        resolve: {
            bike: function ($api, $stateParams) {
                return $api.call('/bikes', 'GET', null, $stateParams.id);
            }
        }
    })

    .state('app.s3-upload', {
        url: "/s3upload",
        views: {
            'menuContent': {
                templateUrl: "templates/s3upload.html"
            }
        }
    })

    $urlRouterProvider.otherwise('/intro');

    // $ionicConfigProvider.backButton.text("返回").previousTitleText(false);
    $ionicConfigProvider.backButton.text("").previousTitleText(false);
    $ionicConfigProvider.views.swipeBackEnabled(false);
    // to fix issue on switching between two tab panels when side-menu exists
    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.tabs.position("bottom"); //Places them at the bottom for all OS
    $ionicConfigProvider.tabs.style("standard"); //Makes them all look the same across all OS
})
.config(['$translateProvider', '$translatePartialLoaderProvider',
    function ($translateProvider, $translatePartialLoaderProvider) {
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: 'locales/{lang}/{part}.json'
        });

        $translateProvider.preferredLanguage('en-US');
        $translateProvider.fallbackLanguage("en-US");
        $translateProvider.useSanitizeValueStrategy('sanitize');
    }
])
