angular.module('app.services')

.service('PropertyService', ['UserService', '$q',

    function (UserService, $q) {
        var currentBikeId;

        return {
            getCurrentUser: function () {
                var deferred = $q.defer();
                UserService.getSingleUser(id).then(function (res) {
                    currentUser = res.user;
                    deferred.resolve(true);
                });
                return deferred.promise;
            },
            getCurrentBikeId: function () {
                return currentBikeId;
            },
            setCurrentBikeId: function (id) {
                currentBikeId = id;
                return;
            }
        };
    }
])
