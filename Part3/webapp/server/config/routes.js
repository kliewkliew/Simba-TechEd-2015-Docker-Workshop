var bike = require('./../controllers/bike')();
var activity = require('./../controllers/activity')();
var auth = require('./../controllers/authentication');
var main = require('./../controllers/main');
var aws = require('./../controllers/aws');

module.exports = [{
        method: "GET",
        path: "/{param*}", // more info about this {param*} stuff : https://github.com/hapijs/hapi/blob/master/docs/Reference.md#path-parameters
        handler: {
            directory: {
                path: "../front-end/www",
                //listing: true, //uncomment this if you want to allow file listing
                index: true
            }
        }
    },

    // bike related rest api
    {
        path: "/api/bikes",
        method: "GET",
        handler: bike.getBikes
    }, {
        path: "/api/bike",
        method: "POST",
        handler: bike.addBike
    }, {
        path: "/api/bikes/{id}",
        method: "GET",
        handler: bike.getBikeById
    }, {
        path: "/api/bike/{id}",
        method: "PUT",
        handler: bike.updateBikeById
    }, {
        path: "/api/bike/{id}",
        method: "DELETE",
        handler: bike.deleteBikeById
    }, {
        path: "/api/bikes/user/{user_id}",
        method: "GET",
        handler: bike.getBikesByUserId
    }, {
        path: '/api/reserve/bike',
        method: 'POST',
        handler: bike.reserveBike
    },

    // activity related rest api
    {
        path: "/api/activities",
        method: "GET",
        handler: activity.getActivities
    }, {
        path: "/api/activity",
        method: "POST",
        handler: activity.addActivity
    }, {
        path: "/api/activity/{id}",
        method: "PUT",
        handler: activity.updateActivityById
    }, {
        path: "/api/activity/{id}",
        method: "DELETE",
        handler: activity.deleteActivityById
    }, {
        path: "/api/activities/{id}",
        method: "GET",
        handler: activity.getActivityById
    }, {
        path: "/api/activities/user/{user_id}",
        method: "GET",
        handler: activity.getActivitiesByUserId
    }, {
        path: '/api/activity/rsvp',
        method: 'POST',
        handler: activity.rsvpActivity
    }, {
        path: '/api/activity/rsvp/cancel',
        method: 'POST',
        handler: activity.cancelRsvpActivity
    }, {
        path: '/api/activity/archive',
        method: 'POST',
        handler: activity.archiveActivityById
    },

    // login and register related rest api
    {
        path: '/api/login',
        method: 'POST',
        config: auth.login
    }, {
        path: '/api/logout',
        method: 'GET',
        config: auth.logout
    }, {
        path: '/api/register',
        method: 'POST',
        config: auth.register
    }, {
        path: '/api/user/{user_id}',
        method: 'GET',
        config: auth.getUserById
    }, {
        path: '/api/user/{user_id}',
        method: 'PUT',
        config: auth.updateUserById
    }, {
        path: '/api/users',
        method: 'GET',
        config: auth.getUsers
    }, {
        path: '/api/user/updateToken',
        method: 'POST',
        config: auth.updateTokenByUserId
    },

    // tokens
    {
        path: '/api/tokens',
        method: "GET",
        config: auth.getDeviceTokens
    },

    // aws
    {
        path: '/api/s3Policy',
        method: "GET",
        config: aws.getS3Policy
    }
]
