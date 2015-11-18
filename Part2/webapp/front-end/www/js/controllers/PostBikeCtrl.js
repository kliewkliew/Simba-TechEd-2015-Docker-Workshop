angular.module('app.controllers')

.controller('PostBikeCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$ionicSideMenuDelegate', '$ionicScrollDelegate', '$ionicHistory', '$ionicActionSheet', '$localStorage', '$cordovaCamera', '$timeout', '$api', '$modals', '$utils', 'BikeService', '$translate', '$translatePartialLoader',

    function ($scope, $rootScope, $state, $stateParams, $ionicSideMenuDelegate, $ionicScrollDelegate, $ionicHistory, $ionicActionSheet, $localStorage, $cordovaCamera, $timeout, $api, $modals, $utils, BikeService, $translate, $translatePartialLoader) {

        var bike = {
            title: '',
            brand: '',
            model: '',
            purchase_year: '',
            phone: '',
            email: '',
            contact: '',
            description: '',
            photo: CONFIG.base64
        };

        if ($scope.bike) {
            //$scope.bike is passed by BikeDetailCtrl
            $scope.edit = true;
        }
        else {
            //User post a new bike
            $scope.bike = angular.copy(bike);
        }

        $scope.closeModal = function () {
            $modals.hide();
        };

        $scope.$on('$destroy', function () {
            $modals.destroy();
        });

        $scope.getBackIcon = function () {
            if (ionic.Platform.isAndroid())
                return 'icon ion-android-arrow-back';
            else
                return 'icon ion-ios-arrow-back';
        };

        $scope.refresh = function () {
            $scope.bike = angular.copy(bike);
        };

        $scope.openPhoto = function (srcType) {

            var options = {
                quality: 80,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: srcType,
                allowEdit: false,
                targetWidth: 800,
                targetHeight: 800,
                correctOrientation: true,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function (data) {
                $scope.bike.photo = "data:image/jpeg;base64," + data;
            }, function (err) {

            });
        };

        $scope.onPickPhoto = function () {
            $ionicActionSheet.show({
                buttons: [{
                    text: '打开相机'
                }, {
                    text: '从相册里选择'
                }],
                cancelText: 'Close',
                cancel: function () {
                    console.log('CLOSED');
                },
                buttonClicked: function (index) {
                    if (index == 0)
                        $scope.openPhoto(Camera.PictureSourceType.CAMERA);
                    else if (index == 1)
                        $scope.openPhoto(Camera.PictureSourceType.PHOTOLIBRARY);
                    return true;
                }
            });
        };

        $scope.submit = function () {

            if (!$scope.bike.title) {
                return $utils.openPopup(CONFIG.prompt, 'Title');
            }

            var bike = {
                id: $scope.bike._id,
                title: $scope.bike.title,
                user_id: $localStorage.get('session_id'),
                brand: $scope.bike.brand,
                model: $scope.bike.model,
                purchase_year: $scope.bike.purchase_year,
                phone: $scope.bike.phone,
                email: $scope.bike.email,
                contact: $scope.bike.contact,
                description: $scope.bike.description,
                images: $scope.bike.photo
            };

            if ($scope.edit) {
                BikeService.updateBike(bike).then(function (res) {
                    $rootScope.hideTabBar = true;
                    $ionicSideMenuDelegate.$getByHandle('main-side-menu').toggleRight(false);
                    $scope.closeModal();
                    $state.go('app.home.cycling.bike-detail', {
                        id: $scope.bike._id
                    });
                });

            }
            else {
                BikeService.addBike(bike).then(function (res) {
                    $rootScope.hideTabBar = false;
                    $ionicSideMenuDelegate.$getByHandle('main-side-menu').toggleRight(false);
                    $scope.closeModal();
                    $state.go('app.home.cycling.bikes');
                });
            }
        };

        $translatePartialLoader.addPart('post_bike');
        $translate.refresh();
    }
]);
