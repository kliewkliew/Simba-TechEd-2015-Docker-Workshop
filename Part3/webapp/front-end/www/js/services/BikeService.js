angular.module('app.services')

.service('BikeService', ['$api', 'UserService', '$q', '$utils', '$localStorage',

    function ($api, UserService, $q, $utils, $localStorage) {

        return {
            getBikeList: function () {
                $utils.showLoading();
                var deferred = $q.defer();
                $api.call('/bikes', 'GET', null).then(function (res) {
                    $utils.hideLoading();
                    console.log(res);
                    deferred.resolve(res.data);
                }, function (reason) {
                    alert('Failed: ' + reason);
                });
                return deferred.promise;
            },

            getBikeById: function (id) {
                $utils.showLoading();
                var deferred = $q.defer();
                var promise0 = $api.call('/bikes', 'GET', null, id);
                var promise1 = $api.call('/user', 'GET', null, $localStorage.get('session_id'));

                $q.all([promise0, promise1]).then(function (res) {
                    console.log(res);
                    var detail = [];
                    detail.push(res[0].data);
                    detail.push(res[1].data.user);
                    deferred.resolve(detail);
                    $utils.hideLoading();
                }, function (reason) {
                    console.log(reason);
                });

                return deferred.promise;
            },

            /**
             * Reserve a bike.
             * @param id            Id of an bike.
             * @param start_date    Start date of a reservation.
             * @param end_date      End date of a reservation.
             * @param user          The user who sends the reservation.
             */
            reserveBike: function (id, start_date, end_date) {
                var deferred = $q.defer();
                $api.call('/user', 'GET', null, $localStorage.get('session_id')).then(function (res) {
                    var cUser = res.data.user;
                    cUser.bikes.push({
                        id: id,
                        returned: false
                    });
                    //bike reservation
                    var reservation = {
                        bike_id: id,
                        start_date: start_date,
                        end_date: end_date,
                        user_id: cUser._id
                    };
                    var promise0 = $api.call('/reserve/bike', 'POST', reservation);
                    var promise1 = $api.call('/user', 'PUT', cUser, cUser._id);
                    $q.all([promise0, promise1]).then(function (data) {
                        deferred.resolve(data);
                    });
                });
                return deferred.promise;
            },

            /**
             * Add an bike.
             * @param bike          An bike object.
             * @return              True if success; otherwise false.
             */
            addBike: function (bike) {
                var deferred = $q.defer();
                return $api.call('/bike', 'POST', bike);
            },

            /**
             * Update an bike.
             * @param bike           An bike object.
             * @return              True if already joined; otherwise false.
             */
            updateBike: function (bike) {
                var deferred = $q.defer();
                var id = bike.id;
                return $api.call('/bike', 'PUT', bike, id);
            },

            /**
             * admin deletes an bike.
             * @param id            Id of an bike.
             */
            deleteBike: function (id) {
                var deferred = $q.defer();
                return $api.call('/bike', 'DELETE', null, id);
            }

        };
    }
])
