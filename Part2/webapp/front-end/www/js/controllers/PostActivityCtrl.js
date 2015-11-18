angular.module('app.controllers')

.controller('PostActivityCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$ionicSideMenuDelegate', '$ionicScrollDelegate', '$ionicHistory', '$ionicActionSheet', '$cordovaCamera', '$localStorage', '$timeout', '$api', '$modals', '$utils', 'ActivityService', '$translate', '$translatePartialLoader',

    function ($scope, $rootScope, $state, $stateParams, $ionicSideMenuDelegate, $ionicScrollDelegate, $ionicHistory, $ionicActionSheet, $cordovaCamera, $localStorage, $timeout, $api, $modals, $utils, ActivityService, $translate, $translatePartialLoader) {

        $scope.$on("$ionicView.beforeEnter", function (scopes, states) {
            if (states.direction === "forward") {
                $rootScope.hideTabBar = true;
            }
        });

        $scope.$on("$ionicView.beforeLeave", function (scopes, states) {
            if (states.direction === "back")
                $rootScope.hideTabBar = false;
        });

        var dates = {
            start_date: moment().startOf('day').toDate()
        };

        if ($scope.activity) {
            $scope.edit = true;
        }
        else {
            $scope.activity = angular.copy(dates);
        }

        //FOR select date
        var disabledDates = [
            new Date(1437719836326),
            new Date(2015, 7, 10), //months are 0-based, this is August, 10th!
            new Date('Wednesday, August 12, 2015'), //Works with any valid Date formats like long format
            new Date("08-14-2015"), //Short format
            new Date(1439676000000) //UNIX format
        ];

        var monthList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

        $scope.datepickerObjectPopup = {
            titleLabel: '活动开始日期', //Optional
            todayLabel: '今日', //Optional
            closeLabel: '取消', //Optional
            setLabel: '确定', //Optional
            errorMsgLabel: 'Please select time.', //Optional
            setButtonType: 'button-royal', //Optional
            templateType: 'popup', //Optional
            inputDate: $scope.activity.start_date, //Optional
            mondayFirst: true, //Optional
            disabledDates: disabledDates, //Optional
            monthList: monthList, //Optional
            from: new Date(2014, 5, 1), //Optional
            to: new Date(2016, 7, 1), //Optional
            callback: function (val) { //Optional
                datePickerCallbackPopup(val);
            }
        };

        var datePickerCallbackPopup = function (val) {
            if (typeof (val) === 'undefined') {
                console.log('No date selected');
            }
            else {
                $scope.datepickerObjectPopup.inputDate = val;
                console.log('Selected date is : ', val)
                $scope.activity.start_date = val;
            }
        };

        $scope.timePickerObject24Hour = {
            inputEpochTime: ((new Date()).getHours() * 60 * 60), //Optional
            step: 15, //Optional
            format: 12, //Optional
            titleLabel: '集合时间', //Optional
            closeLabel: '取消', //Optional
            setLabel: '确定', //Optional
            setButtonType: 'button-royal', //Optional
            closeButtonType: 'button-royal', //Optional
            callback: function (val) { //Mandatory
                timePicker24Callback(val);
            }
        };

        function timePicker24Callback(val) {
            if (typeof (val) === 'undefined') {
                console.log('Time not selected');
            }
            else {
                $scope.timePickerObject24Hour.inputEpochTime = val;
                $scope.activity.meetup_time = val;
                var selectedTime = new Date(val * 1000);
                console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
            }
        }

        $scope.refresh = function () {
            $scope.activity = angular.copy(dates);
        };

        $scope.cancel = function () {
            $ionicHistory.goBack();
        };

        $scope.submit = function () {

            if (!$scope.activity.title) {
                return $utils.openPopup(CONFIG.prompt, 'Title');
            }
            var activity = {
                id: $scope.activity._id,
                title: $scope.activity.title,
                user_id: $localStorage.get('session_id'),
                end_location: $scope.activity.end_location,
                end_date: $scope.activity.end_date,
                description: $scope.activity.description,
                meetup_time: $scope.activity.meetup_time,
                meetup_location: $scope.activity.meetup_location,
                start_date: $scope.activity.start_date,
                start_location: $scope.activity.start_location,
                distance: $scope.activity.distance,
                pace: $scope.activity.pace,
                size: $scope.activity.size
            };

            ActivityService.addActivity(activity).then(function (res) {
                $state.go('app.home.cycling.activities');
            });

        };

        $scope.disableTap = function () {
            container = document.getElementsByClassName('pac-container');
            // disable ionic data tab
            angular.element(container).attr('data-tap-disabled', 'true');
            // leave input field if google-address-entry is selected
            angular.element(container).on("click", function () {
                document.getElementById('start_location').blur();
                document.getElementById('end_location').blur();
            });
        };

        $translatePartialLoader.addPart('post_activity');
        $translate.refresh();
    }
]);
