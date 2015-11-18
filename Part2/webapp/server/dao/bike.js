var Bike = require('../models/bike');
var User = require('./user')();

//Get all bikes
var GetBikes = function getBikes(callback) {

    Bike.find({})
        .select('title isReserved images')
        .exec(function (err, res) {
            callback(err, res);
        });
};

//Get a specific bike by bike id
var GetBikeById = function getBikeById(id, callback) {

    Bike.findById(id).exec(function (err, res) {
        callback(err, res);
    });
};

//Post a bike into database
var AddBike = function addBike(bike, callback) {

    bike.save(function(err, res) {
        callback(err, res);
    });

    // Is this part useful?
    //User.AddBike(bike.user_id, bike._id, function(err, res) {
    //    callback(err, res);
    //});
};

//Get all bikes related to a specific user
var GetBikesByUserId = function getBikesByUserId(id, callback) {

    Bike.find({user_id: id})
        .select('picture name location period')
        .exec(function(err, res) {
        callback(err, res);
    });
};

// reserve a bike in database
var ReserveBike = function reserveBike(bike_id, user_id, start_date, end_date, callback) {

    Bike.update({'_id': bike_id},
        {'$push': {
            "renters": user_id,
            "reserve_dates": {"start_date": start_date, "end_date": end_date}}
    }, null, function (err, res) {

        if (!err && res.nModified === 1) {
            User.rsvpUserById({
                id: bike_id,
                user_id: user_id,
                category: 'bikes',
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

var UpdateBikeById = function updateBikeById(id, bike, callback) {

    Bike.update(id, {'$set': bike}, null, function (err, res) {
        callback(err, res);
    });
};

var DeleteBikeById = function deleteBikeById(id, callback) {

    Bike.findByIdAndRemove(id, function (err, res) {
        callback(err, res);
    });
};


module.exports = exports = function () {

    var _this = exports;

    _this.getBikes = GetBikes;
    _this.getBikeById = GetBikeById;
    _this.addBike = AddBike;
    _this.getBikesByUserId = GetBikesByUserId;
    _this.reserveBike = ReserveBike;
    _this.updateBikeById = UpdateBikeById;
    _this.deleteBikeById = DeleteBikeById;

    return _this;
};
