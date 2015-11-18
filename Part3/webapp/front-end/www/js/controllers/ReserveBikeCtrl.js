angular.module('app.controllers')

.controller('ReserveBikeCtrl', ['$scope', '$state', '$stateParams', '$ionicScrollDelegate', '$ionicHistory', '$timeout', '$utils', 'BikeService', 'UserService', 'ReserveBikeService', 'bDetail', '$translate', '$translatePartialLoader',

    function ($scope, $state, $stateParams, $ionicScrollDelegate, $ionicHistory, $timeout, $utils, BikeService, UserService, ReserveBikeService, bDetail, $translate, $translatePartialLoader) {

        $scope.bike = bDetail[0];
        $scope.user = bDetail[1];
        $scope.available_dates = ReserveBikeService.getAvailableDates($scope.bike.reserve_dates);

        // Match with reservation template
        $scope.reserve = {};
        $scope.reserve.start_date = moment().startOf('day').toDate();
        $scope.reserve.end_date = moment().startOf('day').toDate();

        var monthList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

        $scope.datepickerStart = {
            titleLabel: '开始日期', //Optional
            todayLabel: '今日', //Optional
            closeLabel: '取消', //Optional
            setLabel: '确定', //Optional
            errorMsgLabel: 'Please select time.', //Optional
            setButtonType: 'button-royal', //Optional
            templateType: 'popup', //Optional
            inputDate: $scope.reserve.start_date, //Optional
            mondayFirst: true, //Optional
            // disabledDates: disabledDates, //Optional
            monthList: monthList, //Optional
            from: new Date(2014, 5, 1), //Optional
            to: new Date(2016, 7, 1), //Optional
            callback: function (val) { //Optional
                datePickerCallbackStart(val);
            }
        };

        var datePickerCallbackStart = function (val) {
            if (typeof (val) === 'undefined') {
                console.log('No date selected');
            }
            else {
                $scope.datepickerStart.inputDate = val;
                console.log('Selected date is : ', val)
                $scope.reserve.start_date = val;
            }
        };

        $scope.datepickerEnd = {
            titleLabel: '开始日期', //Optional
            todayLabel: '今日', //Optional
            closeLabel: '取消', //Optional
            setLabel: '确定', //Optional
            errorMsgLabel: 'Please select time.', //Optional
            setButtonType: 'button-royal', //Optional
            templateType: 'popup', //Optional
            inputDate: $scope.reserve.end_date, //Optional
            mondayFirst: true, //Optional
            // disabledDates: disabledDates, //Optional
            monthList: monthList, //Optional
            from: new Date(2014, 5, 1), //Optional
            to: new Date(2016, 7, 1), //Optional
            callback: function (val) { //Optional
                datePickerCallbackEnd(val);
            }
        };

        var datePickerCallbackEnd = function (val) {
            if (typeof (val) === 'undefined') {
                console.log('No date selected');
            }
            else {
                $scope.datepickerEnd.inputDate = val;
                console.log('Selected date is : ', val)
                $scope.reserve.end_date = val;
            }
        };

        $scope.onCancel = function () {
            $ionicHistory.goBack();
        };

        $scope.onReserve = function () {

            if (ReserveBikeService.checkConflict($scope.bike.reserve_dates, $scope.reserve.start_date, $scope.reserve.end_date)) {
                alert("There is conflict. Can't reserve");
            }
            else {
                BikeService.reserveBike($scope.bike._id, $scope.reserve.start_date, $scope.reserve.end_date).then(function (res) {
                    alert("success!");
                });
            }
        };

        $translatePartialLoader.addPart('reserve_bike');
        $translate.refresh();
    }
])
