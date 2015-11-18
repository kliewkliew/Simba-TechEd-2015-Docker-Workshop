var Bike = require('../models/bike');
var BikeApi = require('../dao/bike')();
var flatten = require('flat');
var Gridfs = require('../database').Gridfs;
var mongoose = require('../database').Mongoose;
var AWS = require('aws-sdk');
var config = require('../config/config');

// aws information, hardcoded for now.
AWS.config.update({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
});

// Handle request of fetching a list of bikes
var GetBikes = function getBikes(request, reply) {

    BikeApi.getBikes(function (err, res) {

        if (!err) {
            reply(res);
        }
    });
};

// Handle request of getting a specific bike
var GetBikeById = function getBikeById(request, reply) {

    BikeApi.getBikeById(request.params.id, function (err, res) {

        if (!err) {
            reply(res);
        }
    });
};

// Handle reqeust of adding a bike
var AddBike = function addBike(request, reply) {
    var s3 = new AWS.S3();
    var img_id = mongoose.Types.ObjectId();

    s3.createBucket({
        Bucket: config.aws.bucket
    }, function () {

        var buf = new Buffer(request.payload.images.replace(/^data:image\/\w+;base64,/, ""), 'base64')

        var params = {
            Bucket: config.aws.bucket,
            Key: img_id.toString(),
            Body: buf,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg'
        };

        s3.putObject(params).on('httpUploadProgress', function (progress) {
            console.log(progress);
        }).send(function (err, data) {
            if (err) {
                console.log(err)
            }
            else {
                console.log('s3 success:', data);
            }
        });
    });

    var bike = new Bike({
        user_id: request.payload.user_id,
        title: request.payload.title,
        description: request.payload.description,
        brand: request.payload.brand,
        model: request.payload.model,
        purchase_year: request.payload.purchase_year,
        phone: request.payload.phone,
        email: request.payload.email,
        contact: request.payload.contact,
        images: img_id.toString()

        // available_dates: [{ "start_date": start_date, "end_date": end_date}],
        // pickup_address: request.payload.pickup_address,
        // return_address: request.payload.return_address,
    });

    BikeApi.addBike(bike, function (err) {

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

// Hanlde request of getting bikes posted by a specific user
var GetBikesByUserId = function getBikesByUserId(request, reply) {

    BikeApi.getBikesByUserId(request.params.user_id, function (err, res) {

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

// Handle request for reserve an Bike
var ReserveBike = function reserveBike(request, reply) {
    BikeApi.reserveBike(
        request.payload.bike_id,
        request.payload.user_id,
        request.payload.start_date,
        request.payload.end_date,
        function (err, res) {

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

var UpdateBikeById = function updateBikeById(request, reply) {

    BikeApi.updateBikeById(request.params.id, flatten(request.payload), function (err, res) {

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

var DeleteBikeById = function deleteBikeById(request, reply) {

    BikeApi.deleteBikeById(request.params.id, function (err, res) {
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

    _this.getBikes = GetBikes;
    _this.getBikeById = GetBikeById;
    _this.addBike = AddBike;
    _this.getBikesByUserId = GetBikesByUserId;
    _this.reserveBike = ReserveBike;
    _this.updateBikeById = UpdateBikeById;
    _this.deleteBikeById = DeleteBikeById;

    return _this;
};
