angular.module('app.services')

.service('ActivityService', ['$api', '$localStorage', 'UserService', 'PropertyService', '$utils', '$q', '$cacheFactory',

    function ($api, $localStorage, UserService, PropertyService, $utils, $q, $cacheFactory) {

        return {
            /**
             * Get activity list
             */
            getActivityList: function () {
                $utils.showLoading();
                var deferred = $q.defer();
                $api.call('/activities', 'GET', null, null).then(function (res) {
                    $utils.hideLoading();
                    deferred.resolve(res.data);
                });
                return deferred.promise;
            },

            getActivityById: function (id) {
                $utils.showLoading();
                var deferred = $q.defer();
                $api.call('/activities', 'GET', null, id).then(function (res0) {
                    var promise0 = $api.call('/users', 'GET', {
                        ids: JSON.stringify(res0.data.attendees)
                    }, null);

                    var promise1 = $api.call('/user', 'GET', null, $localStorage.get('session_id'));

                    $q.all([promise0, promise1]).then(function (res) {
                        // get atte(ndees
                        var attendees = [];
                        var data = res[0].data;
                        for (var i = 0, j = data.length; i < j; i++) {
                            attendees.push({
                                id: data[i]._id,
                                name: data[i].name,
                                college_name: data[i].college_name,
                                avatar: data[i].avatar
                            });
                        }

                        //get whether joined
                        var isJoined = false;
                        var cUser = res[1].data.user;
                        if (cUser) {
                            for (var i = 0, j = cUser.activities.length; i < j; i++) {
                                if (id === cUser.activities[i].id) {
                                    isJoined = true;
                                }
                            }
                        }
                        else {
                            alert("no current user");
                        }

                        var detail = [];
                        detail.push(res0.data);
                        detail.push(attendees);
                        detail.push(isJoined);
                        detail.push(cUser);
                        $utils.hideLoading();
                        deferred.resolve(detail);

                    });
                });
                return deferred.promise;
            },

            /**
             * A user reserves an activity.
             * @param id            Id of an acitivity.
             * @param user          An user object.
             * @return              True if already joined; otherwise false.
             */
            joinActivity: function (id) {
                $utils.showLoading();
                var deferred = $q.defer();

                $api.call('/user', 'GET', null, $localStorage.get('session_id')).then(function (res) {
                    var cUser = res.data.user;
                    cUser.activities.push({
                        id: id,
                        completed: false
                    });

                    var reservation = {
                        activity_id: id,
                        user_id: cUser._id
                    };
                    var promise0 = $api.call('/activity/rsvp', 'POST', reservation);
                    var promise1 = $api.call('/user', 'PUT', cUser, cUser._id);
                    $q.all([promise0, promise1]).then(function (data) {
                        var cAttendee = {};
                        cAttendee.id = cUser._id;
                        cAttendee.name = cUser.name;
                        cAttendee.college_name = cUser.college_name;
                        cAttendee.avatar = cUser.avatar;
                        deferred.resolve(cAttendee);
                        $utils.hideLoading();
                    });
                });
                return deferred.promise;
            },

            /**
             * A user cancels an activity.
             * @param id            Id of an acitivity.
             * @param user          An user object.
             * @return              True if already joined; otherwise false.
             */
            notJoinActivity: function (id) {
                $utils.showLoading();
                var deferred = $q.defer();

                $api.call('/user', 'GET', null, $localStorage.get('session_id')).then(function (res) {
                    var cUser = res.data.user;

                    // delete activity on current user object
                    cUser.activities = cUser.activities
                        .filter(function (el) {
                            return el.id !== id;
                        });

                    var reservation = {
                        activity_id: id,
                        user_id: cUser._id
                    };
                    var promise0 = $api.call('/activity/rsvp/cancel', 'POST', reservation);
                    var promise1 = $api.call('/user', 'PUT', cUser, cUser._id);
                    $q.all([promise0, promise1]).then(function (data) {
                        deferred.resolve(cUser._id);
                        $utils.hideLoading();
                    });
                });
                return deferred.promise;
            },

            /**
             * admin deletes an activity.
             * @param id            Id of an acitivity.
             */
            deleteActivity: function (id) {
                return $api.call('/activity', 'DELETE', null, id);
            },

            /**
             * Adds an activity.
             * @param act          An activity object.
             * @return             True if success; otherwise false.
             */
            addActivity: function (act) {
                return $api.call('/activity', 'POST', act);
            },

            /**
             * Update an activity.
             * @param act           An activity object.
             * @return              True if success; otherwise false.
             */
            updateActivity: function (act) {
                return $api.call('/activity', 'PUT', act, act.id);
            }
        };
    }
])
