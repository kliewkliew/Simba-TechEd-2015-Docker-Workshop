angular.module('app.services')

.service('ReserveBikeService', [
    function () {
        return {
            getAvailableDates: function (reserveDates) {

                if (!reserveDates) return;
                //calcuate available dates which will display on reservebike page
                var availableDdates = [];
                //sort
                if (reserveDates.length === 0) {
                    var date_temp = moment().toDate().toLocaleDateString() + "-" + moment().add(3, 'months').toDate().toLocaleDateString();
                    availableDdates.push(date_temp);
                }
                else {
                    var sortedReserveDates = reserveDates.sort(function (a, b) {
                        return a.start_date - b.start_date;
                    });
                    for (var i = 0; i < sortedReserveDates.length; i++) {

                        //if the first start date is today
                        if (i == 0) {
                            if (moment().diff(moment(sortedReserveDates[i].start_date)) == 0) {
                                continue;
                            }
                            else {
                                var date_temp = moment().toDate().toLocaleDateString() + "-" + moment(sortedReserveDates[i].start_date).subtract(1, 'days').toDate().toLocaleDateString();
                                availableDdates.push(date_temp);
                            }
                        }
                        if (sortedReserveDates.length > 1 && i < sortedReserveDates.length - 1) {
                            if (moment(sortedReserveDates[i + 1].start_date).diff(sortedReserveDates[i].end_date) > 0) {
                                var date_temp = moment(sortedReserveDates[i].end_date).add(1, 'days').toDate().toLocaleDateString() + "-" + moment(sortedReserveDates[i + 1].start_date).subtract(1, 'days').toDate().toLocaleDateString();
                                availableDdates.push(date_temp);
                            }
                        }
                        // the last end date is today
                        if (i == sortedReserveDates.length - 1) {
                            if (moment().add(3, 'months').diff(moment(sortedReserveDates[i].end_date)) == 0) {
                                continue;
                            }
                            else {
                                var date_temp = moment(sortedReserveDates[i].end_date).add(1, 'days').toDate().toLocaleDateString() + "-" + moment().add(3, 'months').toDate().toLocaleDateString();
                                availableDdates.push(date_temp);
                            }
                        }
                    }
                }
                return availableDdates;
            },

            checkConflict: function (reserveDates, startDate, endDate) {
                if (startDate.toISOString() > endDate.toISOString()) {
                    alert("start > end, can't reserve!");
                    return;
                }
                var isConflict = false;
                // Check whether the dates are available
                for (var i = 0; i < reserveDates.length; i++) {
                    if (startDate.toISOString() > reserveDates[i].end_date || endDate.toISOString() <= reserveDates[i].start_date) {
                        //continue
                    }
                    else {
                        isConflict = true;
                        break;
                    }
                }
                return isConflict;
            }
        };
    }
])
