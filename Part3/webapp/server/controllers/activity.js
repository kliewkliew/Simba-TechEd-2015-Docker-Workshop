var Activity = require('../models/activity');
var ActivityApi = require('../dao/activity')();
var flatten = require('flat');

// Handle request of getting list of activities
var GetActivities = function getActivities(request, reply) {

    ActivityApi.getActivities(function (err, res) {
        if (!err) {
            reply(res);
        }
    });
};

// Handle request of getting a specific activity
var GetActivityById = function getActivityById(request, reply) {

    ActivityApi.getActivityById(request.params.id, function (err, res) {

        if (!err) {
            reply(res);
        }
    });
};

// Handle request of add an activity
var AddActivity = function addActivity(request, reply) {

    var activity = new Activity({
        user_id: request.payload.user_id,
        title: request.payload.title,
        start_date: request.payload.start_date,
        start_time: request.payload.start_time,
        start_location: request.payload.start_location,
        end_location: request.payload.end_location,
        distance: request.payload.distance,
        pace: request.payload.pace,
        meetup_time: request.payload.meetup_time,
        meetup_location: request.payload.meetup_location,
        size: request.payload.size,
        description: request.payload.description
    });
    activity.save(function (err, res) {

        if (err) {
            reply({
                err: err
            });
        }
        else {
            reply({
                success: 1
            });
        }
    });
};

// Handle request for get activities of a specific user
var GetActivitiesByUserId = function getActivitiesByUserId(request, reply) {

    ActivityApi.getActivitiesByUserId(request.params.user_id, function (err, res) {

        if (err) {
            reply({
                err: err
            });
        }
        else {
            reply(res);
        }
    });
};

// Handle request for reserve an activity
var RsvpActivity = function rsvpActivity(request, reply) {

    ActivityApi.rsvpActivity(request.payload.activity_id, request.payload.user_id, function (err, res) {

        if (err) {
            reply({
                err: err
            });
        }
        else {
            reply({
                success: res.nModified
            });
        }
    });
};

// Handle request of cancelling a reservation of an activity
var CancelRsvpActivity = function cancelRsvpActivity(request, reply) {

    ActivityApi.cancelRsvpActivity(request.payload.activity_id, request.payload.user_id, function (err, res) {

        if (err) {
            reply({
                err: err
            });
        }
        else {
            reply({
                success: res.nModified
            });
        }
    });
};

var ArchiveActivityById = function archiveActivityById(request, reply) {

    ActivityApi.archiveActivityById(request.payload.activity_id, function (err, res) {

        if (err) {
            reply({
                err: err
            });
        }
        else {
            reply({
                success: res
            });
        }
    });
};

var UpdateActivityById = function updateActivityById(request, reply) {

    ActivityApi.updateActivityById(request.params.id, flatten(request.payload), function (err, res) {

        if (err) {
            reply({
                err: err
            });
        }
        else {
            reply({
                success: res
            });
        }
    });
};

var DeleteActivityById = function deleteActivityById(request, reply) {

    ActivityApi.deleteActivityById(request.params.id, function (err, res) {
        if (err) {
            reply({
                err: err
            });
        }
        else {
            reply({
                success: res
            });
        }
    });
};

module.exports = exports = function () {

    var _this = exports;

    _this.getActivities = GetActivities;
    _this.getActivityById = GetActivityById;
    _this.addActivity = AddActivity;
    _this.getActivitiesByUserId = GetActivitiesByUserId;
    _this.rsvpActivity = RsvpActivity;
    _this.cancelRsvpActivity = CancelRsvpActivity;
    _this.archiveActivityById = ArchiveActivityById;
    _this.updateActivityById = UpdateActivityById;
    _this.deleteActivityById = DeleteActivityById;

    return _this;
};
