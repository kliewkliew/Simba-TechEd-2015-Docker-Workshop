// User related Api for fetching users from database

var User = require('../models/user').User;

// Get all users
var GetUsers = function getUsers(callback) {

    User
        .find({})
        .select('email name avatar')
        .sort('name')
        .exec(function (err, res) {
            callback(err, res);
        });
};

// Get a specific user by the user's id
var GetUserById = function getUserById(id, callback) {

    User.findById(id).exec(function (err, res) {
        callback(err, res);
    });
};

var RsvpUserById = function rsvpUserById(params, callback) {

    var doc = {};

    doc[params.method] = {};
    doc[params.method][params.category] = {}

    if (params.method === '$push') {

        doc[params.method][params.category] = {
            $each: [{
                id: params.id,
                completed: false
            }]
        };

    }
    else {
        doc[params.method][params.category]['id'] = params.id
    }

    User.update({
        _id: params.user_id
    }, doc, null, function (err, res) {
        callback(err, res);
    });
};

var ArchiveUserActivityById = function archiveUserActivityById(activity_id, callback) {

    User.update({
            activities: {
                $elemMatch: {
                    id: activity_id
                }
            }
        }, {
            $set: {
                'activities.$.completed': true
            }
        }, {
            multi: true
        },
        function (err, res) {
            callback(err, res);
        });
};

var Update = function update(conditions, update, callback) {

    User.update(conditions, update, null, function (err, res) {
        callback(err, res);
    });
};

var AddBike = function update(user_id, bike_id, callback) {

    User.update({'_id': user_id}, {'$push': {'bikes': bike_id}}, null, function (err, res) {
        callback(err, res);
    });
};

module.exports = exports = function () {

    var _this = exports;

    _this.getUsers = GetUsers;
    _this.getUserById = GetUserById;
    _this.rsvpUserById = RsvpUserById;
    _this.archiveUserActivityById = ArchiveUserActivityById;
    _this.update = Update;
    _this.addBike = AddBike;

    return _this;
};
