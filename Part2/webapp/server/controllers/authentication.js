// joi: Object schema description language and validator for JavaScript objects
var Joi = require('joi');
var UserApi = require('../dao/user')();
var User = require('../models/user').User;
var flatten = require('flat');

/**
 * Responds to POST /login and logs the user in
 */
exports.login = {
    validate: {
        payload: {
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }
    },
    handler: function (request, reply) {

        User.authenticate()(request.payload.email, request.payload.password, function (err, user, message) {

            if (err) {
                return reply(err).code(500);
            }

            if (user) {
                console.log(user.email + ' is logged in');
                request.auth.session.set(user);
                return reply({
                    id: user._id,
                    email: user.email
                }).code(200);
            }

            return reply(message).code(401);
        });
    }
};

/**
 * Responds to GET /logout and logs out the user
 */
exports.logout = {
    auth: 'session',
    handler: function (request, reply) {
        request.auth.session.clear();
        reply({
            success: 1
        });
    }
};

/**
 * Responds to POST /register and creates a new user.
 */
exports.register = {
    validate: {
        payload: {
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            college_name: Joi.string(),
            date_of_birth: Joi.date(),
            gender: Joi.string(),
            name: Joi.string(),
            grade: Joi.number(),
            created_date: Joi.date(),
            is_admin: Joi.boolean()
        }
    },
    handler: function (request, reply) {

        // Create a new user, this is the place where you add firstName, lastName etc.
        // Just don't forget to add them to the validator above.

        var newUser = new User({
            email: request.payload.email,
            name: request.payload.name,
            college_name: request.payload.college_name,
            date_of_birth: request.payload.date_of_birth,
            gender: request.payload.gender,
            grade: request.payload.grade,
            is_admin: request.payload.is_admin
        });

        // The register function has been added by passport-local-mongoose and takes as first parameter
        // the user object, as second the password it has to hash and finally a callback with user info.
        User.register(newUser, request.payload.password, function (err, user) {

            if (err) {
                return reply({
                    err: err
                });
            }

            if (user) {
                console.log(user.email + ' is registered');
                return reply({
                    id: user._id,
                    email: user.email
                }).code(201);
            }
        });
    }
};

exports.getUsers = {

    handler: function (request, reply) {

        UserApi.getUsers(function (err, res) {
            if (!err) {
                reply(res);
            }
        });
    }
};

// Handle request of get a specific user
exports.getUserById = {

    handler: function (request, reply) {

        //User.findByUsername(request.params.username, function (err, user) {

        User.findById(request.params.user_id, function (err, user) {

            if (err) {
                reply({
                    err: err
                }).code(500);
            }

            if (user) {
                return reply({
                    user: user
                });
            }

            return reply({
                err: 'user not found'
            }).code(404);
        });
    }
};

// Handle request of get a specific user
exports.updateUserById = {

    handler: function (request, reply) {
        var conditions = {
            _id: request.params.user_id
        };
        var update = {
            '$set': flatten(request.payload)
        };

        UserApi.update(conditions, update, function (err, res) {
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
    }
};

exports.updateTokenByUserId = {

    handler: function (request, reply) {
        var conditions = {
            _id: request.payload.user_id
        };
        var update = {};
        update['$' + request.payload.method] = {
            'settings.device_token': request.payload.token
        };

        UserApi.update(conditions, update, function (err, res) {
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
    }
};

exports.getDeviceTokens = {

    handler: function (request, reply) {
        var selector = {
            'settings.push_notification': true
        };
        var projection = {
            '_id': 0,
            'settings.device_token': 1
        };
        var options = {
            safe: true
        };

        UserApi.getUsers(selector, projection, options, function (err, res) {
            if (err) {
                reply({
                    err: err
                });
            }
            else {

                var tokens = [];
                for (var i = 0, j = res.length; i < j; i++) {
                    if (res[i].settings.device_token) {
                        for (var m = 0, n = res[i].settings.device_token.length; m < n; m++) {
                            tokens.push(res[i].settings.device_token[m]);
                        }
                    }
                }
                reply({
                    tokens: tokens
                });
            }
        });
    }
};
