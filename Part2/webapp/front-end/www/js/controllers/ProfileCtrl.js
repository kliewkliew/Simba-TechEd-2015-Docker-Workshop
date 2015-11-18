angular.module('app.controllers')

.controller('ProfileCtrl', ['$scope', '$rootScope', '$state', '$ionicSideMenuDelegate', '$ionicScrollDelegate', '$ionicHistory', '$localStorage', '$timeout', '$api', '$modals', '$utils', '$ionicPopup',

    function ($scope, $rootScope, $state, $ionicSideMenuDelegate, $ionicScrollDelegate, $ionicHistory, $localStorage, $timeout, $api, $modals, $utils, $ionicPopup) {

        $scope.editable = false;
        $scope.profile = {
            name: $scope.user.name,
            gender: $scope.user.gender,
            college_name: $scope.user.college_name,
            grade: $scope.user.grade,
            avatar: $scope.user.avatar
        };

        $scope.getBackIcon = function () {
            if (ionic.Platform.isAndroid())
                return 'icon ion-android-arrow-back';
            else
                return 'icon ion-ios-arrow-back';
        };

        $scope.closeModal = function () {
            $modals.hide();
        };

        $scope.editProfile = function () {
            $scope.editable = true;
        };

        $scope.candelEditProfile = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: '编辑个人页面',
                template: '你确定要退出吗?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $scope.profile = {
                        name: $scope.user.name,
                        gender: $scope.user.gender,
                        college_name: $scope.user.college_name,
                        avatar: $scope.user.avatar,
                        grade: $scope.user.grade
                    };
                    $scope.editable = false;
                }
                else {
                    console.log('You are not sure');
                }
            });

        };

        $scope.saveEditProfile = function () {
            $api.call('/user', 'PUT', $scope.profile, $localStorage.get('session_id'))
                .success(function (data, status, headers, config) {
                    $scope.editable = false;
                    $scope.user.name = $scope.profile.name;
                    $scope.user.gender = $scope.profile.gender;
                    $scope.user.college_name = $scope.profile.college_name;
                    $scope.user.grade = $scope.profile.grade;
                    $scope.user.avatar = $scope.profile.avatar;
                    var alertPopup = $ionicPopup.alert({
                        title: '消息',
                        template: '您的个人信息已更新'
                    });
                    alertPopup.then(function (res) {
                        console.log('谢谢！');
                    });
                })
                .error(function (data, status, headers, config) {
                    $utils.openPopup(CONFIG.connection_failed, JSON.stringify(data, null, 2));
                })

            ['finally'](function () {
                $utils.hideLoading();
            });
        };

        // Triggered on a button click, or some other target
        $scope.showAvatarPopup = function () {

            // if ($scope.editable) {
                $scope.avatarIndex = 0;

                // An elaborate, custom popup
                var myPopup = $ionicPopup.show({
                    templateUrl: 'templates/AvatarList.html',
                    title: '选择头像',
                    subTitle: '请选择一个你喜欢的头像',
                    scope: $scope,
                    buttons: [{
                        text: '取消'
                    }, {
                        text: '<b>保存</b>',
                        type: 'button-positive',
                        onTap: function () {
                            return $scope.avatarIndex;
                        }
                    }]
                });
                myPopup.then(function (res) {
                    console.log('Tapped!', res);
                    $scope.profile.avatar = "img/avatar/" + $scope.avatarIndex + ".png";
                    console.log($scope.profile.avatar);
                    $scope.saveEditProfile();
                });
                $timeout(function () {
                    myPopup.close(); //close the popup after 3 seconds for some reason
                }, 100000000);


            // }
            // else {
            //     var alertPopup = $ionicPopup.alert({
            //         title: '请按编辑',
            //         template: '编辑后再选头像'
            //     });
            //     alertPopup.then(function (res) {
            //         console.log('谢谢！');
            //     });
            // }
        };
    }
]);
