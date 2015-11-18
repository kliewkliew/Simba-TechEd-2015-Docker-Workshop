var Mongoose = require('mongoose');
var Config = require('./config/config');
var fs = require('fs');

var url = 'mongodb://' + Config.mongo.docker + '/' + Config.mongo.database;

//load database
Mongoose.connect(url, Config.mongo.dbOptions, function (err, db) {
    console.log('mongo initiated at', url);
    if (err) {
        console.log('MongoDB connection error: ', err);
        process.exit(1);
    }
});

//Mongoose.connect('mongodb://' + Config.mongo.username + ':' + Config.mongo.password + '@' + Config.mongo.url + '/' + Config.mongo.database);
var db = Mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log("Connection with database succeeded.");
});

//Close the connection on exiting the process
process.on('SIGINT', function () {
    db.close(function () {
        console.log('Mongoose connection disconnected through app termination');
        process.exit(0);
    });
});

exports.Mongoose = Mongoose;
exports.db = db;
