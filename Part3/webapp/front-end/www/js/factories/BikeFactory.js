angular.module('app.factories')

.factory('BikeFactory', ['BikeService', '$localStorage', function (BikeService, $localStorage) {

    return {

        /**
         * Get an activity by activity id
         *
         * @param id            Id of an acitivity.
         *
         * @return              An activity object with details of attendees..
         */
        getBikeList: function () {
            var bikeList = BikeService.getBikeList();
            if (bikeList) {
                bikeList.then(function (bikeListResult) { // this is only run after $http completes

                    for (var i = 0; i < bikeListResult.length; i++) {

                        //TODO: Reuse isJoinedActivity;
                        bikeListResult[i].isReserved = false;
                        for (var j = 0; j < bikeListResult[i].renters.length; j++) {
                            if ($localStorage.get('session_id') === bikeListResult[i].renters[j]) {
                                bikeListResult[i].isReserved = true;
                                break;
                            }
                        }
                    }
                    return bikeListResult;
                });
                return bikeList;
            }
            return;
        }
    };
}]);
