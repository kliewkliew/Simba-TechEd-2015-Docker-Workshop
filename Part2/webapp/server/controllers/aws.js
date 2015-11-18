'use strict';

var AWS = require('aws-sdk'),
    crypto = require('crypto'),
    config = require('../config/config'),
    moment = require('moment');

function createS3Policy(contentType, callback) {
    var acl = 'public-read';
    var s3Policy = {
        'expiration': moment().add(1, 'm').toISOString(),
        'conditions': [
          {'bucket': config.aws.bucket},
          ['starts-with', '$key', ''],
          {'acl': acl},
          ['starts-with', '$Content-Type', contentType],
          ['starts-with', '$filename', ''],
          {'success_action_status': '201'},
          ['content-length-range', 0, 10485760]
        ]
    };
    // stringify and encode the policy
    var stringPolicy = JSON.stringify(s3Policy);
    var base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');

    // sign the base64 encoded policy
    var signature = crypto.createHmac('sha1', config.aws.secretAccessKey)
        .update(new Buffer(base64Policy, 'utf-8')).digest('base64');

    // build the results object
    var s3Credentials = {
        AWSAccessKeyId: config.aws.accessKeyId,
        s3Acl: acl,
        s3Policy: base64Policy,
        s3Signature: signature,
        s3Url: 'https://' + config.aws.bucket + '.s3.amazonaws.com/'
    };

    // send it back
    callback(null, s3Credentials);
};

exports.getS3Policy = {

    handler: function (request, reply) {
        createS3Policy(request.query.mimeType, function (err, creds) {
            if (!err) {
                return reply(creds);
            }
        });
    }
};
