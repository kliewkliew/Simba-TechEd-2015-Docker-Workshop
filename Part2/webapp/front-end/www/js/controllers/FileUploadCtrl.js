angular.module('app.controllers')

.controller('FileUploadCtrl', ['$http', '$scope', '$rootScope', '$state', '$stateParams', '$ionicSideMenuDelegate', '$ionicScrollDelegate', '$ionicHistory', '$ionicActionSheet', '$cordovaCamera', '$localStorage', '$timeout', '$api', '$modals', '$utils', 'ActivityService', '$translate', '$translatePartialLoader', 'Upload',

    function ($http, $scope, $rootScope, $state, $stateParams, $ionicSideMenuDelegate, $ionicScrollDelegate, $ionicHistory, $ionicActionSheet, $cordovaCamera, $localStorage, $timeout, $api, $modals, $utils, ActivityService, $translate, $translatePartialLoader, Upload) {

        $scope.files = [];
        $scope.imageUploads = [];
        $scope.types = ['success', 'warning', 'default', 'alert', 'info'];

        $scope.random = function() {
            return $scope.types[Math.floor((Math.random() * 5))];
        };

        $scope.submit = function () {
            if (form.file.$valid && $scope.file && !$scope.file.$error) {
                $scope.upload($scope.file);
            }
        };

        $scope.upload = function (file) {
            $http.get('/api/s3Policy?mimeType=' + file[0].type).success(function (response) {
                Upload.upload({
                    url: response.s3Url,
                    method: 'POST',
                    fields: {
                        key: file[0].name, // the key to store the file on S3, could be file name or customized
                        AWSAccessKeyId: response.AWSAccessKeyId,
                        acl: response.s3Acl, // sets the access to the uploaded file in the bucket: private or public
                        policy: response.s3Policy, // base64-encoded json policy (see article below)
                        signature: response.s3Signature, // base64-encoded signature based on policy string (see article below)
                        'Content-Type': file[0].type || 'application/octet-stream', // content type of the file (NotEmpty)
                        filename: file[0].name // this is needed for Flash polyfill IE8-9
                    },
                    file: file[0]
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
                    console.log('error data: ' + data);
                    console.log('error headers: ' + headers);
                    console.log('error config: ' + config);
                });
            });
        };

        $scope.uploadFiles = function (files) {

            $scope.files = files;
            $scope.upload = [];
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                file.progress = parseInt(0);
                file.bartype = $scope.random();
                (function (file, i) {
                    $http.get('/api/s3Policy?mimeType=' + file.type).success(function (response) {
                        $scope.upload[i] = Upload.upload({
                            url: response.s3Url,
                            method: 'POST',
                            data: {
                                key: file.name,
                                AWSAccessKeyId: response.AWSAccessKeyId,
                                acl: response.s3Acl,
                                policy: response.s3Policy,
                                signature: response.s3Signature,
                                'Content-Type': file.type || 'application/octet-stream',
                                success_action_status: 201,
                                filename: file.name
                            },
                            file: file,
                        });
                        $scope.upload[i].then(function (response) {
                            file.progress = parseInt(100);
                            if (response.status === 201) {
                                file.status = 'success';
                            }
                            else {
                                file.upload_err = 'Upload error';
                            }
                        }, function (err) {
                            file.err = err;
                        }, function (evt) {
                            file.progress = parseInt(100.0 * evt.loaded / evt.total);
                        });
                    });
                }(file, i));
            }
        };

        $scope.confirm = function () {
            return confirm('Are you sure? Your local changes will be lost.');
        };

        $scope.getReqParams = function () {
            return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
                '&errorMessage=' + $scope.serverErrorMsg : '';
        };

        angular.element(window).bind('dragover', function (e) {
            e.preventDefault();
        });
        angular.element(window).bind('drop', function (e) {
            e.preventDefault();
        });

        $timeout(function () {
            $scope.capture = 'camera';
            $scope.pattern = 'image/*';
            $scope.acceptSelect = 'image/*';
            $scope.modelOptions = '{debounce:100}';
            $scope.dragOverClass = '{accept:\'dragover\', reject:\'dragover-err\', pattern:\'image/*\'}';
            $scope.disabled = false;
            $scope.multiple = true;
            $scope.allowDir = false;
            $scope.validate = '{size: {max: \'10MB\'}, height: {max: 5000}, width: {max: 5000}, duration: {max: \'5m\'}}';
            $scope.keep = 'distinct';
            $scope.s3url = 'https://mratheist.s3.amazonaws.com/';
            $scope.AWSAccessKeyId = 'AKIAJZQJIZMJWACG53ZQ';
            $scope.acl = 'private';
            $scope.success_action_redirect = 201;
            // $scope.success_action_redirect = window.location.protocol + '//' + window.location.host + '/s3callback';
            $scope.jsonPolicy = '{\n  "expiration": "2020-01-01T00:00:00Z",\n  "conditions": [\n    {"bucket": "mratheist"},\n    ["starts-with", "$key", ""],\n    {"acl": "private"},\n    ["starts-with", "$Content-Type", ""],\n    ["starts-with", "$filename", ""],\n    ["content-length-range", 0, 10485760]\n  ]\n}';
            $scope.policy = {};
            $scope.signature = '';
        });
    }
]);
