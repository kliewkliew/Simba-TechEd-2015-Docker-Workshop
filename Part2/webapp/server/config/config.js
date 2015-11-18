// database and server configuration

var host = '0.0.0.0';
var port = 8080;

module.exports = {
    mongo: {
        username: '<dbusername>',
        password: '<dbpassword>',
        url: '<dbstring>.mongolab.com:<port>',
        server: host + ':27017',
        replica: host + ':27017,' + host + ':27018,' + host + ':27019',
        docker: '[Please replace it with mongodb query server hostname or ip address]:27017',
        database: 'GearInn',
        host: host,
        port: 27017
    },
    dbOptions: {
        db: {
            w: 'majority'
        },
        replset: {
            auto_reconnect: false,
            poolSize: 10,
            rs_name: 'rs',
            socketOptions: {
                keepAlive: 1,
                connectTimeoutMS: 30000
            }
        },
        server: {
            poolSize: 5,
            socketOptions: {
                keepAlive: 1,
                connectTimeoutMS: 30000
            }
        }
    },
    server: {
        host: 'server.webapp.dev.docker',
        port: port
    },
    aws: {
        'accessKeyId': 'AKIAJZQJIZMJWACG53ZP',
        'secretAccessKey': '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',
        'region': 'us-west-1',
        'bucket': 'webapp-photos'
    }
};
