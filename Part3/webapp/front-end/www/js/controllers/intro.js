angular.module('app.controllers')

.controller('IntroCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$utils', '$translate', '$translatePartialLoader',

    function ($scope, $rootScope, $state, $stateParams, $timeout, $utils, $translate, $translatePartialLoader) {

        $('.gearinn-logo').css('height', window.innerHeight * .15 + 'px');
        $('#i-button-div').css('height', window.innerHeight * .32 + 'px');

        $scope.$on("$ionicView.beforeLeave", function (scopes, states) {
            $('.gearinn-logo').css('margin-top', '-=' + (ionic.Platform.isIOS() ? '64' : '44') + 'px');
        });

        $scope.signIn = function () {
            $state.go("sign-in", {});
        };

        $scope.signUp = function () {
            $state.go("sign-up", {});
        };

        $rootScope.getBackIcon = function () {
            if (ionic.Platform.isAndroid())
                return 'icon ion-android-arrow-back';
            else
                return 'icon ion-ios-arrow-back';
        };

        $translatePartialLoader.addPart('intro');
        $translate.refresh();
    }
])
