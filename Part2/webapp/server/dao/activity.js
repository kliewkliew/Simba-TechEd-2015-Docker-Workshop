var Activity = require('../models/activity');
var User = require('./user')();
var mongoose = require('../database').Mongoose;

// get a list of activities
var GetActivities = function getActivities(callback) {

    Activity
        .find({})
        .select('title start_date attendees.length size')
        //.sort('start_date') // Let the client do the sort in the template html file?
        .exec(function (err, res) {
            callback(err, res);
        });
};

// get a specific activity by activity id.
var GetActivityById = function getActivityById(id, callback) {

    Activity.findById(id, '-__v').exec(function (err, res) {
        callback(err, res);
    });
};

// add an activity to the database
var AddActivity = function addActivity(activity, callback) {

    activity.save(function (err, res) {
        callback(err, res);
    });
};

// get activities of a specific user
var GetActivitiesByUserId = function getActivitiesByUserId(user_id, callback) {

    Activity
        .find({'attendees': user_id})
        .select('title start_date attendees.length size')
        //.sort('start_date') // Let the client do the sort in the template html file?
        .exec(function (err, res) {
            callback(err, res);
        });
};

// reserve an activity in database
var RsvpActivity = function rsvpActivity(activity_id, user_id, callback) {

    Activity.update({'_id': activity_id}, {'$push': {'attendees': user_id}}, null, function (err, res) {

        // confirm a user was added?
        if (!err && res.nModified === 1) {
            User.rsvpUserById({
                id: activity_id,
                user_id: user_id,
                category: 'activities',
                method: '$push'
            }, function (err, res) {
                callback(err, res);
            });
        }
        else {
            callback(err, res);
        }
    });
};

// cancel an activity
var CancelRsvpActivity = function cancelRsvpActivity(activity_id, user_id, callback) {

    Activity.update({'_id': activity_id}, {'$pull': {'attendees': user_id}}, null, function (err, res) {

        // confirm the user was removed?
        if (!err && res.nModified === 1) {
            User.rsvpUserById({
                id: activity_id,
                user_id: user_id,
                category: 'activities',
                method: '$pull'
            }, function (err, res) {
                callback(err, res);
            });
        }
        else {
            callback(err, res);
        }
    });
};

var ArchiveActivityById = function archiveActivityById(activity_id, callback) {

    User.archiveUserActivityById(activity_id, function (err, res) {
        callback(err, res);
    });
};

var UpdateActivityById = function updateActivityById(id, document, callback) {

    Activity.update({'_id': id}, {'$set': document}, null, function (err, res) {
        callback(err, res);
    });
};

var DeleteActivityById = function deleteActivityById(id, callback) {

    Activity.findByIdAndRemove(id, function (err, res) {
        callback(err, res);
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
