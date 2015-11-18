angular.module('app.services', [])

.service('UserService', ['$api', '$localStorage', '$q', '$cacheFactory',

    function ($api, $localStorage, $q, $cacheFactory) {
        return {
            getSingleUser: function (id) {
                var deferred = $q.defer();
                $api.call('/user', 'GET', null, id).then(function (res) {
                    delete res.data.user.password;
                    delete res.data.user.salt;
                    deferred.resolve(res.data.user);
                }, function (reason) {
                    alert('Failed: ' + reason);
                });
                return deferred.promise;
            },
            getMultipleUsers: function (ids) {
                $api.call('/user', 'GET', null, $localStorage.get('session_id')).then(function (res) {
                    user.shouldUpdateCache = false;
                    delete res.data.user.password;
                    delete res.data.user.salt;
                    return res.data.user;
                }, function (reason) {
                    alert('Failed: ' + reason);
                });
            },
            /**
             * Get details of attendees of an activity.
             * @param id            Id of an acitivity.
             */
            getAttendeesOfActivity: function (act) {
                $api.call('/users', 'GET', {
                        ids: JSON.stringify(act.attendees)
                    }, null)
                    .then(function (result) {
                        var data = result.data;
                        for (var i = 0, j = data.length; i < j; i++) {
                            // attendees.push({
                            //     id: data[i]._id,
                            //     name: data[i].name,
                            //     college_name: data[i].college_name,
                            //     avatar: data[i].avatar
                            // });
                        }
                    });
            }
        };
    }
])
