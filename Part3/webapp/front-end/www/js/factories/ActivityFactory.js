angular.module('app.factories')

.factory('Activity', ['ActivityService', '$localStorage', function (ActivityService, $localStorage) {

    return {

        /**
         * Get an activity by activity id
         *
         * @param id            Id of an acitivity.
         *
         * @return              An activity object with details of attendees..
         */
        getActivityList: function () {
            var actList = ActivityService.getActivityList();
            if (actList) {
                actList.then(function (actListResult) { // this is only run after $http completes
                    for (var i = 0; i < actListResult.length; i++) {

                        //TODO: Reuse isJoinedActivity;
                        actListResult[i].isReserved = false;
                        for (var j = 0; j < actListResult[i].attendees.length; j++) {
                            if ($localStorage.get('session_id') === actListResult[i].attendees[j]) {
                                actListResult[i].isReserved = true;
                                break;
                            }
                        }
                    }
                    return actListResult;
                });
                return actList;
            }
            return;
        },

        /**
         * Get an activity by activity id
         * @param id            Id of an acitivity
         * @return              An activity object with details of attendees..
         */
        getActivity: function (id) {
            var act = ActivityService.getActivityById(id);
            if (act) {
                act.then(function (actResult) { // this is only run after $http completes
                    var users = ActivityService.getAttendeesOfActivity(actResult);
                    if (users) {
                        users.then(function (attendeesResult) {
                            actResult.attendees_detail = attendeesResult;
                            return actResult;
                        });
                    }
                    return users;
                });
                return act;
            }
            return;
        },

        /**
         * Check whether a user already joined a activity.
         *
         * @param id            Id of an acitivity.
         * @param user          An user object.
         *
         * @return              True if already joined; otherwise false.
         */
        isJoinedActivity: function (id, user) {
            if (id && user.activities) {
                for (var i = 0, j = user.activities.length; i < j; i++) {
                    if (id === user.activities[i].id) {
                        return true;
                    }
                }
            }
            return false;
        }
    };
}]);
